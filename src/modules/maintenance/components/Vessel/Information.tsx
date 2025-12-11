import { useState, useEffect } from "react";
import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Checkbox, Input } from "@progress/kendo-react-inputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Button } from "@progress/kendo-react-buttons";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faLocationDot,
  faPlus,
  faTrash,
  faCheck,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import ReadonlyField from "@/shared/ui/ReadOnly";
import { Grid, GridColumn, GridCellProps } from "@progress/kendo-react-grid";
import BranchSelectionModel, { BranchData } from "@/shared/ui/BranchSelectionModel";
import { useUpdateVesselMutation, useCreateVesselMutation } from "@/services/api/apiSlice";

// --- Validation Schema ---
const vesselOwnerSchema = z.object({
  id: z.number(),
  name: z.string().min(1, "Name is required"),
  eff: z.string().optional(),
  exp: z.string().optional(),
});

const vesselDataSchema = z.object({
  vesselName: z.string().min(1, "Vessel Name is required"),
  vesselType: z.string().min(1, "Vessel Type is required"),
  imo: z.string().optional(),
  active: z.boolean().optional(),
  oceanGoing: z.boolean().optional(),
  branch: z.string().optional(),
  // Units
  vetUnits: z.string().optional(),
  draftUnit: z.string().optional(),
  gaugeUnit: z.string().optional(),
  volumeUnit: z.string().optional(),
  // Specs
  vesselCapacity: z.string().optional(),
  compartments: z.string().optional(),
  sandPipe: z.string().optional(),
  lengthOverall: z.string().optional(),
  // Additional Info
  formerName: z.string().optional(),
  connectionType: z.string().optional(),
  vesselLine: z.string().optional(),
  lastDryDock: z.string().optional(),
  lastSampling: z.string().optional(),
  website: z.string().optional(),
  bargeCompany: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  class: z.string().optional(),
  buildYear: z.string().optional(),
  flag: z.string().optional(),
  lbp: z.string().optional(),
  beam: z.string().optional(),
  draught: z.string().optional(),
  gross: z.string().optional(),
  net: z.string().optional(),
  ballast: z.string().optional(),
  manifold: z.string().optional(),
  // Owners & Notes
  owners: z.array(vesselOwnerSchema).optional(),
  notes: z.string().optional(),
});

type VesselFormValues = z.infer<typeof vesselDataSchema>;

// --- Constants ---
const DROPDOWN_OPTIONS = {
  vesselType: ["Barge", "Tow", "Ship"],
  volumeUnit: ["BBL", "USG", "Liters", "Cubic Meters", "Barrels"],
  gaugeUnit: ["IN", "CM", "MM", "FT"],
  draftUnit: ["FT", "M", "CM"],
  vetUnits: ["USG", "BBL", "Liters", "Cubic Meters"],
  connectionType: ["Flange", "Quick Connect", "Threaded", "Welded", "Other"],
  sandPipe: ["Yes", "No"],
  bargeCompany: ["Marine LLC", "Ocean Transport Co", "Harbor Services", "Coastal Shipping", "Other"],
  ballast: ["Yes", "No"],
};

// --- Reusable Form Field Component ---
interface FormFieldProps {
  control: any;
  name: keyof VesselFormValues;
  label: string | React.ReactNode;
  mode: "edit" | "view";
  type?: "text" | "select" | "date" | "checkbox";
  options?: string[];
  placeholder?: string;
  className?: string;
}

const FormField = ({
  control,
  name,
  label,
  mode,
  type = "text",
  options = [],
  placeholder = " ",
  className,
}: FormFieldProps) => {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        // View Mode
        if (mode === "view") {
          let displayValue = value;
          if (type === "date" && value) {
             try { displayValue = new Date(value as string).toLocaleDateString(); } catch {}
          }
          if (type === "checkbox") {
             return (
               <div className={className}>
                 <label className="font-medium text-gray-600 block">{label}</label>
                 <FontAwesomeIcon icon={value ? faCheck : faXmark} />
               </div>
             );
          }
          return (
            <div className={className}>
              <ReadonlyField label={label as string} value={displayValue as string} />
            </div>
          );
        }

        // Edit Mode
        return (
          <div className={`space-y-1 ${className}`}>
            <label className="font-medium block">
              {label}
              {error && <span className="text-red-500 text-sm ml-1">({error.message})</span>}
            </label>
            
            {type === "text" && (
              <Input
                value={value as string}
                onChange={(e) => onChange(e.value)}
                placeholder={placeholder}
              />
            )}

            {type === "select" && (
              <DropDownList
                className="!bg-transparent w-full"
                data={options}
                value={value}
                onChange={(e) => onChange(e.value)}
              />
            )}

            {type === "date" && (
              <DatePicker
                value={value ? new Date(value as string) : null}
                onChange={(e) => {
                   const val = e.value ? e.value.toISOString().split('T')[0] : "";
                   onChange(val);
                }}
                placeholder={placeholder}
                className="w-full"
              />
            )}
            
            {type === "checkbox" && (
               <Checkbox 
                  checked={value as boolean}
                  onChange={(e) => onChange(e.value)}
                  label={placeholder}
               />
            )}
          </div>
        );
      }}
    />
  );
};

// --- Main Component ---
export default function VesselInformation({
  mode = "edit",
  data,
}: {
  mode?: "edit" | "view";
  data?: any;
}) {
  const [updateVessel, { isLoading: isUpdating }] = useUpdateVesselMutation();
  const [createVessel, { isLoading: isCreating }] = useCreateVesselMutation();
  const isLoading = isUpdating || isCreating;

  const defaultValues: VesselFormValues = {
    vesselName: data?.vesselName ?? "",
    vesselType: data?.vesselType ?? "",
    imo: data?.imo ?? "",
    active: data?.active ?? true,
    oceanGoing: false,
    branch: data?.branch ?? "",
    vetUnits: data?.vetUnits ?? "",
    draftUnit: data?.draftUnit ?? "",
    gaugeUnit: data?.gaugeUnit ?? "",
    volumeUnit: data?.volumeUnit ?? "",
    vesselCapacity: data?.vesselCapacity ?? "",
    compartments: data?.compartments ?? "",
    sandPipe: data?.sandPipe ?? "",
    lengthOverall: data?.lengthOverall ?? "",
    formerName: data?.additional?.formerName ?? "",
    connectionType: data?.additional?.connectionType ?? "",
    vesselLine: data?.additional?.vesselLine ?? "",
    lastDryDock: data?.additional?.lastDryDock ?? "",
    lastSampling: data?.additional?.lastSampling ?? "",
    website: data?.additional?.website ?? "",
    bargeCompany: data?.additional?.bargeCompany ?? "",
    phone: data?.additional?.phone ?? "",
    email: data?.additional?.email ?? "",
    class: data?.additional?.class ?? "",
    buildYear: data?.additional?.buildYear ?? "",
    flag: data?.additional?.flag ?? "",
    lbp: data?.additional?.lbp ?? "",
    beam: data?.additional?.beam ?? "",
    draught: data?.additional?.draught ?? "",
    gross: data?.additional?.gross ?? "",
    net: data?.additional?.net ?? "",
    ballast: data?.additional?.ballast ?? "",
    manifold: data?.additional?.manifold ?? "",
    owners: data?.owners ?? [],
    notes: data?.notes ?? "",
  };

  const { control, handleSubmit, reset, setValue, watch } = useForm<VesselFormValues>({
    resolver: zodResolver(vesselDataSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [data, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "owners",
  });

  const [openSections, setOpenSections] = useState({
    general: true,
    additional: true,
    owners: true,
    notes: true
  });
  const [branchSelectionOpen, setBranchSelectionOpen] = useState(false);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const handleBranchSave = (branchData: BranchData) => {
    setValue("branch", branchData.value || "");
  };

  const onSubmit = async (formData: VesselFormValues) => {
    const payload = {
      ...formData,
      additional: {
        formerName: formData.formerName,
        connectionType: formData.connectionType,
        vesselLine: formData.vesselLine,
        lastDryDock: formData.lastDryDock,
        lastSampling: formData.lastSampling,
        website: formData.website,
        bargeCompany: formData.bargeCompany,
        phone: formData.phone,
        email: formData.email,
        class: formData.class,
        buildYear: formData.buildYear,
        flag: formData.flag,
        lbp: formData.lbp,
        beam: formData.beam,
        draught: formData.draught,
        gross: formData.gross,
        net: formData.net,
        ballast: formData.ballast,
        manifold: formData.manifold,
      }
    };

    try {
      if (data?.id) {
        await updateVessel({ id: data.id, data: payload }).unwrap();
        toast.success("Vessel information updated successfully");
      } else {
        await createVessel(payload).unwrap();
        toast.success("New vessel created successfully");
      }
      console.log("Form Submitted:", payload);
    } catch (err) {
      toast.error("Failed to save vessel information");
      console.error("Save failed:", err);
    }
  };

  // --- Grid Cells for Owners ---
  const OwnerEditableCell = (field: keyof typeof vesselOwnerSchema.shape) => (props: GridCellProps) => {
    const { dataItem, dataIndex } = props;
    
    return (
      <td>
        <Input
          value={dataItem[field]}
          onChange={(e) => {
             const newValue = String(e.value || "");
             setValue(`owners.${dataIndex}.${field}` as any, newValue); 
          }}
        />
      </td>
    );
  };

  const OwnerDateCell = (field: "eff" | "exp") => (props: GridCellProps) => {
    const { dataItem, dataIndex } = props;
    const value = dataItem[field];
    
    return (
      <td>
        <DatePicker
          value={value ? new Date(value) : null}
          placeholder="Choose a date..."
          onChange={(e) => {
            const dateStr = e.value ? e.value.toISOString().split('T')[0] : "";
            setValue(`owners.${dataIndex}.${field}`, dateStr);
          }}
        />
      </td>
    );
  };

  const OwnerDeleteCell = (props: GridCellProps) => {
    return (
      <td className="text-center">
        <Button
          themeColor="primary"
          onClick={() => remove(props.dataIndex)}
        >
          <FontAwesomeIcon icon={faTrash} />
        </Button>
      </td>
    );
  };

  const currentOwners = watch("owners") || [];
  const currentBranch = watch("branch");

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* SECTION 1: GENERAL INFORMATION */}
      <div className="border border-gray-300 my-6 rounded">
        <div
          className="flex justify-between items-center bg-gray-100 px-4 py-2 cursor-pointer"
          onClick={() => toggleSection('general')}
        >
          <h3 className="font-bold text-gray-700">Key Information</h3>
          <FontAwesomeIcon icon={openSections.general ? faChevronUp : faChevronDown} />
        </div>

        {openSections.general && (
          <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <FormField control={control} mode={mode} name="vesselName" label={<span>Vessel Name <span className="text-red-500">*</span></span>} />
            <FormField control={control} mode={mode} name="vesselType" label={<span>Vessel Type <span className="text-red-500">*</span></span>} type="select" options={DROPDOWN_OPTIONS.vesselType} />
            <FormField control={control} mode={mode} name="imo" label="IMO Number" />
            
            <div className={`flex ${mode === "edit" ? "mt-2 items-between gap-4" : "flex-col gap-1"}`}>
               {mode === "edit" ? (
                 <>
                   <FormField control={control} mode={mode} name="active" label="Vessel Status" type="checkbox" placeholder="Active" />
                   <FormField control={control} mode={mode} name="oceanGoing" label="Ocean Going" type="checkbox" placeholder="Yes" />
                   <div className="flex flex-col">
                      <label className="text-sm font-medium">Branch</label>
                      <FontAwesomeIcon
                        icon={faLocationDot}
                        onClick={() => setBranchSelectionOpen(true)}
                        className="text-primary mt-1 cursor-pointer"
                      />
                   </div>
                 </>
               ) : (
                 <>
                   <label className="font-medium text-gray-600">Active</label>
                   <FontAwesomeIcon icon={watch("active") ? faCheck : faXmark} />
                   <div className="flex flex-col">
                      <label className="text-sm font-medium">Branch</label>
                      <div className="flex items-center gap-2">
                        <span>{currentBranch || "-"}</span>
                        <FontAwesomeIcon
                          icon={faLocationDot}
                          onClick={() => setBranchSelectionOpen(true)}
                          className="text-primary cursor-pointer text-sm"
                        />
                      </div>
                   </div>
                 </>
               )}
            </div>

            <FormField control={control} mode={mode} name="formerName" label="Former Name" />
            <FormField control={control} mode={mode} name="volumeUnit" label="Volume Unit" type="select" options={DROPDOWN_OPTIONS.volumeUnit} />
            <FormField control={control} mode={mode} name="gaugeUnit" label="Gauge Unit" type="select" options={DROPDOWN_OPTIONS.gaugeUnit} />
            <FormField control={control} mode={mode} name="draftUnit" label="Draft Unit" type="select" options={DROPDOWN_OPTIONS.draftUnit} />
            <FormField control={control} mode={mode} name="vetUnits" label="VEF Units" type="select" options={DROPDOWN_OPTIONS.vetUnits} />
            <FormField control={control} mode={mode} name="vesselCapacity" label="Vessel Capacity" />
            <FormField control={control} mode={mode} name="connectionType" label="Vessel Connection Type" type="select" options={DROPDOWN_OPTIONS.connectionType} />
            <FormField control={control} mode={mode} name="sandPipe" label="Sand Pipe" type="select" options={DROPDOWN_OPTIONS.sandPipe} />
            <FormField control={control} mode={mode} name="vesselLine" label="Vessel Deck Line Capacity" />
            <FormField control={control} mode={mode} name="lastDryDock" label="Last Dry Dock" type="date" />
            <FormField control={control} mode={mode} name="lastSampling" label="Last Strapping" type="date" />
            <FormField control={control} mode={mode} name="website" label="Vessel Strapping Website" />
          </div>
        )}
      </div>

      {/* SECTION 2: ADDITIONAL INFORMATION */}
      <div className="border border-gray-300 my-6 rounded">
        <div
          className="flex justify-between items-center bg-gray-100 px-4 py-2 cursor-pointer"
          onClick={() => toggleSection('additional')}
        >
          <h3 className="font-bold text-gray-700">Additional Information</h3>
          <FontAwesomeIcon icon={openSections.additional ? faChevronUp : faChevronDown} />
        </div>

        {openSections.additional && (
          <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <FormField control={control} mode={mode} name="bargeCompany" label="Barge Company" type="select" options={DROPDOWN_OPTIONS.bargeCompany} />
            <FormField control={control} mode={mode} name="phone" label="Vessel Phone" />
            <FormField control={control} mode={mode} name="email" label="Vessel Email" />
            <FormField control={control} mode={mode} name="class" label="Vessel Class" />
            <FormField control={control} mode={mode} name="buildYear" label="Build Year" type="date" />
            <FormField control={control} mode={mode} name="flag" label="Flying Flag" />
            <FormField control={control} mode={mode} name="lengthOverall" label="Length Overall" />
            <FormField control={control} mode={mode} name="lbp" label="LBP" />
            <FormField control={control} mode={mode} name="beam" label="Beam" />
            <FormField control={control} mode={mode} name="draught" label="Draught" />
            <FormField control={control} mode={mode} name="gross" label="Gross Reg. Tons" />
            <FormField control={control} mode={mode} name="net" label="Net Reg. Tons" />
            <FormField control={control} mode={mode} name="ballast" label="Ballast" type="select" options={DROPDOWN_OPTIONS.ballast} />
            <FormField control={control} mode={mode} name="manifold" label="Manifold Location" />
          </div>
        )}
      </div>

      {/* SECTION 3: VESSEL OWNERS */}
      <div className="border border-gray-300 my-6 rounded">
        <div
          className="flex justify-between items-center bg-gray-100 px-4 py-2 cursor-pointer"
          onClick={() => toggleSection('owners')}
        >
          <h3 className="font-bold text-gray-700">Vessel Owners</h3>
          <FontAwesomeIcon icon={openSections.owners ? faChevronUp : faChevronDown} />
        </div>

        {openSections.owners && (
          <div className="p-4 space-y-4">
            {mode === "edit" && (
              <Button 
                themeColor="primary" 
                type="button" 
                onClick={() => append({ id: Date.now(), name: "", eff: "", exp: "" })}
              >
                <FontAwesomeIcon icon={faPlus} className="mr-1" /> Add Vessel Owner
              </Button>
            )}

            <div className="border border-gray-300 rounded-lg bg-white mt-4">
              <Grid data={currentOwners}>
                <GridColumn
                  field="name"
                  title="Vessel Owner"
                  cells={{ data: mode === "edit" ? OwnerEditableCell("name") : undefined }}
                />
                <GridColumn
                  field="eff"
                  title="Effective Date"
                  cells={{ data: mode === "edit" ? OwnerDateCell("eff") : undefined }}
                />
                <GridColumn
                  field="exp"
                  title="Expiration Date"
                  cells={{ data: mode === "edit" ? OwnerDateCell("exp") : undefined }}
                />
                {mode === "edit" && (
                  <GridColumn
                    field="action"
                    title="Action"
                    width="100px"
                    cells={{ data: OwnerDeleteCell }}
                  />
                )}
              </Grid>
            </div>
          </div>
        )}
      </div>

      {/* SECTION 4: NOTES */}
      <div className="border border-gray-300 my-6 rounded">
        <div 
          className="bg-gray-100 px-4 py-2 font-bold text-gray-700 cursor-pointer flex justify-between items-center"
          onClick={() => toggleSection('notes')}
        >
          <span>Notes</span>
          <FontAwesomeIcon icon={openSections.notes ? faChevronUp : faChevronDown} />
        </div>
        
        {openSections.notes && (
          <div className="p-4">
            <Controller
              control={control}
              name="notes"
              render={({ field }) => (
                mode === "edit" ? (
                  <textarea
                    {...field}
                    className="w-full border p-3 rounded h-24 border-gray-300"
                    placeholder="Enter Notes"
                  />
                ) : (
                  <ReadonlyField label="Notes" value={field.value ?? ""} />
                )
              )}
            />
          </div>
        )}
      </div>

      {/* ACTION BUTTONS */}
      {mode === "edit" && (
        <div className="flex justify-end gap-4">
          <Button themeColor="primary" className="w-16" disabled={isLoading}>
            {isLoading ? "Saving..." : "Save"}
          </Button>
          <Button type="button" onClick={() => reset()} className="w-16">
            Cancel
          </Button>
        </div>
      )}

      {/* Branch Selection Modal */}
      {branchSelectionOpen && (
        <BranchSelectionModel
          open={branchSelectionOpen}
          onClose={() => setBranchSelectionOpen(false)}
          mode={mode}
          initialData={{
            type: "individual", // Default or you can add a field to schema
            value: currentBranch || null,
            active: true // Or link to active state
          }}
          onSave={handleBranchSave}
        />
      )}
    </form>
  );
}
