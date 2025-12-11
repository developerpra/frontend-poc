import { useState, useEffect } from "react";
import { Checkbox, Input, CheckboxChangeEvent } from "@progress/kendo-react-inputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Button } from "@progress/kendo-react-buttons";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faChevronDown,
  faChevronUp,
  faLocationDot,
  faPlus,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { toast } from "sonner";
import ReadonlyField from "@/shared/ui/ReadOnly";
import { Grid, GridColumn } from "@progress/kendo-react-grid";
import BranchSelectionModel from "@/shared/ui/BranchSelectionModel";

type VesselOwner = {
  id: number;
  name: string;
  eff: string;
  exp: string;
};

type VesselData = {
  vesselName?: string;
  vesselType?: string;
  imo?: string;
  active?: boolean;
  branch?: string;
  vetUnits?: string;
  draftUnit?: string;
  gaugeUnit?: string;
  volumeUnit?: string;
  vesselCapacity?: string;
  compartments?: string;
  sandPipe?: string;
  lengthOverall?: string;
  additional?: Record<string, string>;
  owners?: VesselOwner[];
  notes?: string;
};

export default function VesselInformation({
  mode = "edit",
  data,
}: {
  mode?: "edit" | "view";
  data?: VesselData;
}) {
  // Accordion state
  const [open1, setOpen1] = useState(true);
  const [open2, setOpen2] = useState(true);
  const [open3, setOpen3] = useState(true);

  // Initialize form state from passed data (or defaults)
  const [branchSelection, setBranchSelection] = useState(false); // Default to false? Original was true.
  // Original was true for branchSelection: const [branchSelection, setBranchSelection] = useState(true);
  // I will keep it as is, but usually dialogs start closed? 
  // Wait, looking at the code: <BranchSelectionModel open={branchSelection} ... />
  // If it's true, it opens on load. I'll stick to original behavior unless it looks like a bug.
  
  const [vesselName, setVesselName] = useState<string>(data?.vesselName ?? "");
  const [vesselType, setVesselType] = useState<string>(data?.vesselType ?? "");
  const [imo, setImo] = useState<string>(data?.imo ?? "");
  const [active, setActive] = useState<boolean>(data?.active ?? true);
  const [branch, setBranch] = useState<string>(data?.branch ?? "");
  const [vetUnits, setVetUnits] = useState<string>(data?.vetUnits ?? "");
  const [draftUnit, setDraftUnit] = useState<string>(data?.draftUnit ?? "");
  const [gaugeUnit, setGaugeUnit] = useState<string>(data?.gaugeUnit ?? "");
  const [volumeUnit, setVolumeUnit] = useState<string>(data?.volumeUnit ?? "");
  const [vesselCapacity, setVesselCapacity] = useState<string>(
    data?.vesselCapacity ?? ""
  );
  const [compartments, setCompartments] = useState<string>(
    data?.compartments ?? ""
  );
  const [sandPipe, setSandPipe] = useState<string>(data?.sandPipe ?? "");
  const [lengthOverall, setLengthOverall] = useState<string>(
    data?.lengthOverall ?? ""
  );
  const [additional, setAdditional] = useState<Record<string, string>>(
    data?.additional ?? {}
  );
  const [owners, setOwners] = useState<VesselOwner[]>(
    data?.owners ?? [
      {
        id: 1,
        name: "VESSEL MANAGEMENT",
        eff: "01-Aug-2023",
        exp: "30-Jul-2026",
      },
      { id: 2, name: "Victory Spirit", eff: "01-Aug-2022", exp: "31-Dec-2024" },
      { id: 3, name: "African Spirit", eff: "10-May-2022", exp: "30-Dec-2026" },
    ]
  );
  const [notes, setNotes] = useState<string>(data?.notes ?? "");

  const toggleDialog = () => {
    setBranchSelection(!branchSelection);
  };

  // Keep local state in sync if parent data changes
  useEffect(() => {
    if (data) {
      setVesselName(data.vesselName ?? "");
      setVesselType(data.vesselType ?? "");
      setImo(data.imo ?? "");
      setActive(data.active ?? true);
      setBranch(data.branch ?? "");
      setVetUnits(data.vetUnits ?? "");
      setDraftUnit(data.draftUnit ?? "");
      setGaugeUnit(data.gaugeUnit ?? "");
      setVolumeUnit(data.volumeUnit ?? "");
      setVesselCapacity(data.vesselCapacity ?? "");
      setCompartments(data.compartments ?? "");
      setSandPipe(data.sandPipe ?? "");
      setLengthOverall(data.lengthOverall ?? "");
      setAdditional(data.additional ?? {});
      setOwners(data.owners ?? owners);
      setNotes(data.notes ?? "");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const vesselTypeOptions = ["Barge", "Tow", "Ship"];
  const volumeUnitOptions = ["BBL", "USG", "Liters", "Cubic Meters", "Barrels"];
  const gaugeUnitOptions = ["IN", "CM", "MM", "FT"];
  const draftUnitOptions = ["FT", "M", "CM"];
  const vetUnitsOptions = ["USG", "BBL", "Liters", "Cubic Meters"];
  const connectionTypeOptions = ["Flange", "Quick Connect", "Threaded", "Welded", "Other"];
  const sandPipeOptions = ["Yes", "No"];
  const bargeCompanyOptions = ["Marine LLC", "Ocean Transport Co", "Harbor Services", "Coastal Shipping", "Other"];
  const ballastOptions = ["Yes", "No"];

  // OWNERS HANDLERS
  const addOwner = () => {
    const newOwner: VesselOwner = {
      id: Date.now(),
      name: "",
      eff: "",
      exp: "",
    };
    setOwners((prev) => [...prev, newOwner]);
  };

  const updateOwner = (id: number, field: keyof VesselOwner, value: string) => {
    setOwners((prev) =>
      prev.map((o) => (o.id === id ? { ...o, [field]: value } : o))
    );
  };

  const removeOwner = (id: number) => {
    setOwners((prev) => prev.filter((o) => o.id !== id));
  };

  const handleSave = () => {
    const payload: VesselData = {
      vesselName,
      vesselType,
      imo,
      active,
      branch,
      vetUnits,
      draftUnit,
      gaugeUnit,
      volumeUnit,
      vesselCapacity,
      compartments,
      sandPipe,
      lengthOverall,
      additional,
      owners,
      notes,
    };

    // Replace this with actual API call if needed
    toast.success("Information saved", {
      description: (
        <div className="text-left text-xs leading-relaxed">
          <p className="font-semibold text-gray-900">Saved</p>
          <p className="text-gray-700">Owners: {owners.length}</p>
        </div>
      ),
    });

    // option: console.log(payload);
    // send payload to server...
  };

  const handleCancel = () => {
    if (data) {
      setVesselName(data.vesselName ?? "");
      setVesselType(data.vesselType ?? "");
      setImo(data.imo ?? "");
      setActive(data.active ?? true);
      setBranch(data.branch ?? "");
      setVetUnits(data.vetUnits ?? "");
      setDraftUnit(data.draftUnit ?? "");
      setGaugeUnit(data.gaugeUnit ?? "");
      setVolumeUnit(data.volumeUnit ?? "");
      setVesselCapacity(data.vesselCapacity ?? "");
      setCompartments(data.compartments ?? "");
      setSandPipe(data.sandPipe ?? "");
      setLengthOverall(data.lengthOverall ?? "");
      setAdditional(data.additional ?? {});
      setOwners(data.owners ?? []);
      setNotes(data.notes ?? "");
    }
  };

  return (
    <>
      {/* GENERAL INFORMATION */}
      <div className="border border-gray-300 my-6 rounded">
        <div
          className="flex justify-between items-center bg-gray-100 px-4 py-2 cursor-pointer"
          onClick={() => setOpen1((s) => !s)}
        >
          <h3 className="font-bold text-gray-700">Key Information</h3>
          <FontAwesomeIcon icon={open1 ? faChevronUp : faChevronDown} />
        </div>

        {open1 && (
          <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mode === "edit" ? (
              <Input
                label={<span>Vessel Name <span className="text-red-500">*</span></span>}
                value={vesselName}
                placeholder=" "
                onChange={(e) => setVesselName(String(e.value || ""))}
              />
            ) : (
              <ReadonlyField label="Vessel Name" value={vesselName} />
            )}

            {mode === "edit" ? (
              <div className="space-y-1">
                <label>Vessel Type <span className="text-red-500">*</span></label>
                <DropDownList
                  className="!bg-transparent"
                  placeholder="Select Vessel Type"
                  data={vesselTypeOptions}
                  value={vesselType}
                  onChange={(e) => setVesselType(String(e.value || ""))}
                />
              </div>
            ) : (
              <ReadonlyField label="Vessel Type" value={vesselType} />
            )}

            {mode === "edit" ? (
              <Input
                label="IMO Number"  
                value={imo}
                placeholder=" "
                onChange={(e) => setImo(String(e.value || ""))}
              />
            ) : (
              <ReadonlyField label="IMO Number" value={imo} />
            )}

            {/* Active + Branch */}
            <div
              className={`flex ${mode === "edit" ? "mt-2 items-between gap-4" : "flex-col gap-1"}`}
            >
              {mode === "edit" ? (
                <>
                  <div>
                    <label htmlFor="">Vessel Status</label>
                    <Checkbox
                      checked={active}
                      label="Active"
                      onChange={(e: CheckboxChangeEvent) => setActive(Boolean(e.value))}
                      />
                  </div>
                  <div>
                    <label htmlFor="">Ocean Going</label>
                    <Checkbox
                      checked={active}
                      label="Yes"
                      onChange={(e: CheckboxChangeEvent) => setActive(Boolean(e.value))}
                      />
                  </div>
                  <div className="flex flex-col">
                    <label className="text-sm font-medium">Branch</label>
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      onClick={toggleDialog}
                      className="text-primary mt-1"
                    />
                  </div>
                </>
              ) : (
                <>
                  <label className="font-medium text-gray-600">Active</label>
                  <FontAwesomeIcon icon={active ? faCheck : faXmark} />
                </>
              )}
            </div>

              {mode === "edit" ? (
              <Input
                label="Former Name"
                
                placeholder=" "
                value={additional["formerName"] ?? ""}
                onChange={(e) =>
                  setAdditional((p) => ({ ...p, formerName: String(e.value || "") }))
                }
              />
            ) : (
              <ReadonlyField
                label="Former Name"
                value={additional["formerName"] ?? ""}
              />
            )}

            {mode === "edit" ? (
              <div className="space-y-1">
                <label>Volume Unit</label>
                <DropDownList
                  className="!bg-transparent"
                  value={volumeUnit}
                  placeholder="Select Volume Unit"
                  data={volumeUnitOptions}
                  onChange={(e) => setVolumeUnit(String(e.value || ""))}
                />
              </div>
            ) : (
              <ReadonlyField label="Volume Unit" value={volumeUnit} />
            )}

            {mode === "edit" ? (
              <div className="space-y-1">
                <label>Gauge Unit</label>
                <DropDownList
                  className="!bg-transparent"
                  placeholder="Select Gauge Unit"
                  data={gaugeUnitOptions}
                  value={gaugeUnit}
                  onChange={(e) => setGaugeUnit(String(e.value || ""))}
                />
              </div>
            ) : (
              <ReadonlyField label="Gauge Unit" value={gaugeUnit} />
            )}

            {mode === "edit" ? (
              <div className="space-y-1">
                <label>Draft Unit</label>
                <DropDownList
                  className="!bg-transparent"
                  placeholder="Select Draft Unit"
                  data={draftUnitOptions}
                  value={draftUnit}
                  onChange={(e) => setDraftUnit(String(e.value || ""))}
                />
              </div>
            ) : (
              <ReadonlyField label="Draft Unit" value={draftUnit} />
            )}

            {/* VEF Units */}
            {mode === "edit" ? (
              <div className="space-y-1">
                <label>VEF Units</label>
                <DropDownList
                  className="!bg-transparent"
                  placeholder="Select VEF Units"
                  data={vetUnitsOptions}
                  value={vetUnits}
                  onChange={(e) => setVetUnits(String(e.value || ""))}
                />
              </div>
            ) : (
              <ReadonlyField label="VEF Units" value={vetUnits} />
            )}

            {mode === "edit" ? (
              <Input
                label="Vessel Capacity"
                value={vesselCapacity}
                placeholder=" "
                onChange={(e) => setVesselCapacity(String(e.value || ""))}
              />
            ) : (
              <ReadonlyField label="Vessel Capacity" value={vesselCapacity} />
            )}

            {mode === "edit" ? (
              <div className="space-y-1">
                <label>Vessel Connection Type</label>
                <DropDownList
                  className="!bg-transparent"
                  placeholder="Select Connection Type"
                  data={connectionTypeOptions}
                  value={additional["connectionType"] ?? ""}
                  onChange={(e) =>
                    setAdditional((p) => ({ ...p, connectionType: String(e.value || "") }))
                  }
                />
              </div>
            ) : (
              <ReadonlyField
                label="Vessel Connection Type"
                value={additional["connectionType"] ?? ""}
              />
            )}

            {mode === "edit" ? (
              <div className="space-y-1">
                <label>Sand Pipe</label>
                <DropDownList
                  className="!bg-transparent"
                  placeholder="Select Sand Pipe"
                  data={sandPipeOptions}
                  value={sandPipe}
                  onChange={(e) => setSandPipe(String(e.value || ""))}
                />
              </div>
            ) : (
              <ReadonlyField label="Sand Pipe" value={sandPipe} />
            )}

            {mode === "edit" ? (
              <Input
                label="Vessel Deck Line Capacity"
                
                placeholder=" "
                value={additional["vesselLine"] ?? ""}
                onChange={(e) =>
                  setAdditional((p) => ({ ...p, vesselLine: String(e.value || "") }))
                }
              />
            ) : (
              <ReadonlyField
                label="Vessel Deck Line Capacity"
                value={additional["vesselLine"] ?? ""}
              />
            )}

            {mode === "edit" ? (
              <DatePicker
                label="Last Dry Dock"
                placeholder="Choose a date..."
                value={additional["lastDryDock"] ? new Date(additional["lastDryDock"]) : null}
                onChange={(e) =>
                  setAdditional((p) => ({ 
                    ...p, 
                    lastDryDock: e.value ? e.value.toISOString().split('T')[0] : "" 
                  }))
                }
              />
            ) : (
              <ReadonlyField
                label="Last Dry Dock"
                value={additional["lastDryDock"] ?? ""}
              />
            )}

            {mode === "edit" ? (
              <DatePicker
                label="Last Strapping"
                placeholder="Choose a date..."
                value={additional["lastSampling"] ? new Date(additional["lastSampling"]) : null}
                onChange={(e) =>
                  setAdditional((p) => ({ 
                    ...p, 
                    lastSampling: e.value ? e.value.toISOString().split('T')[0] : "" 
                  }))
                }
              />
            ) : (
              <ReadonlyField
                label="Last Strapping"
                value={additional["lastSampling"] ?? ""}
              />
            )}

            {mode === "edit" ? (
              <Input
                label="Vessel Strapping Website"
                
                placeholder=" "
                value={additional["website"] ?? ""}
                onChange={(e) =>
                  setAdditional((p) => ({ ...p, website: String(e.value || "") }))
                }
              />
            ) : (
              <ReadonlyField
                label="Vessel Strapping Website"
                value={additional["website"] ?? ""}
              />
            )}
          
          </div>
        )}
      </div>

      {/* ADDITIONAL INFORMATION */}
      <div className="border border-gray-300 my-6 rounded">
        <div
          className="flex justify-between items-center bg-gray-100 px-4 py-2 cursor-pointer"
          onClick={() => setOpen2((s) => !s)}
        >
          <h3 className="font-bold text-gray-700">Additional Information</h3>
          <FontAwesomeIcon icon={open2 ? faChevronUp : faChevronDown} />
        </div>

        {open2 && (
          <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {mode === "edit" ? (
              <div className="space-y-1">
                <label>Barge Company</label>
                <DropDownList
                  className="!bg-transparent"
                  placeholder="Select Barge Company"
                  data={bargeCompanyOptions}
                  value={additional["bargeCompany"] ?? ""}
                  onChange={(e) =>
                    setAdditional((p) => ({ ...p, bargeCompany: String(e.value || "") }))
                  }
                />
              </div>
            ) : (
              <ReadonlyField
                label="Barge Company"
                value={additional["bargeCompany"] ?? ""}
              />
            )}

             {mode === "edit" ? (
              <Input
                label="Vessel Phone"
                
                placeholder=" "
                value={additional["phone"] ?? ""}
                onChange={(e) =>
                  setAdditional((p) => ({ ...p, phone: String(e.value || "") }))
                }
              />
            ) : (
              <ReadonlyField
                label="Vessel Phone"
                value={additional["phone"] ?? ""}
              />
            )}

            {mode === "edit" ? (
              <Input
                label="Vessel Email"
                
                placeholder=" "
                value={additional["email"] ?? ""}
                onChange={(e) =>
                  setAdditional((p) => ({ ...p, email: String(e.value || "") }))
                }
              />
            ) : (
              <ReadonlyField
                label="Vessel Email"
                value={additional["email"] ?? ""}
              />
            )}
            
            {mode === "edit" ? (
              <Input
                label="Vessel Class"
                
                placeholder=" "
                value={additional["class"] ?? ""}
                onChange={(e) =>
                  setAdditional((p) => ({ ...p, class: String(e.value || "") }))
                }
              />
            ) : (
              <ReadonlyField
                label="Vessel Class"
                value={additional["class"] ?? ""}
              />
            )}

             {mode === "edit" ? (
              <DatePicker
                placeholder="Choose a date..."
                label="Build Year"
                
              />
            ) : (
              <ReadonlyField
                label="Build Year"
                value={additional["buildYear"] ?? ""}
              />
            )}

            {mode === "edit" ? (
              <Input
                label="Flying Flag"
                
                placeholder=" "
                value={additional["flag"] ?? ""}
                onChange={(e) =>
                  setAdditional((p) => ({ ...p, flag: String(e.value || "") }))
                }
              />
            ) : (
              <ReadonlyField
                label="Flying Flag"
                value={additional["flag"] ?? ""}
              />
            )}

            {mode === "edit" ? (
              <Input
                label="Length Overall"
                value={lengthOverall}
                placeholder=" "
                onChange={(e) => setLengthOverall(String(e.value || ""))}
              />
            ) : (
              <ReadonlyField label="Length Overall" value={lengthOverall} />
            )}

              {mode === "edit" ? (
              <Input
                label="LBP"
                placeholder=" "
                value={additional["lbp"] ?? ""}
                onChange={(e) =>
                  setAdditional((p) => ({ ...p, lbp: String(e.value || "") }))
                }
              />
            ) : (
              <ReadonlyField label="LBP" value={additional["lbp"] ?? ""} />
            )}

            {mode === "edit" ? (
              <Input
                label="Beam"
                value={additional["beam"] ?? ""}
                onChange={(e) =>
                  setAdditional((p) => ({ ...p, beam: String(e.value || "") }))
                }
              />
            ) : (
              <ReadonlyField label="Beam" value={additional["beam"] ?? ""} />
            )}

            {mode === "edit" ? (
              <Input
                label="Draught"
                placeholder=" "
                value={additional["draught"] ?? ""}
                onChange={(e) =>
                  setAdditional((p) => ({ ...p, draught: String(e.value || "") }))
                }
              />
            ) : (
              <ReadonlyField
                label="Draught"
                value={additional["draught"] ?? ""}
              />
            )}
            
             {mode === "edit" ? (
              <Input
                label="Gross Reg. Tons"
                
                placeholder=" "
                value={additional["gross"] ?? ""}
                onChange={(e) =>
                  setAdditional((p) => ({ ...p, gross: String(e.value || "") }))
                }
              />
            ) : (
              <ReadonlyField
                label="Gross Reg. Tons"
                value={additional["gross"] ?? ""}
              />
            )}

            {mode === "edit" ? (
              <Input
                label="Net Reg. Tons"
                
                placeholder=" "
                value={additional["net"] ?? ""}
                onChange={(e) => setAdditional((p) => ({ ...p, net: String(e.value || "") }))}
              />
            ) : (
              <ReadonlyField
                label="Net Reg. Tons"
                value={additional["net"] ?? ""}
              />
            )}

            {mode === "edit" ? (
              <div className="space-y-1">
                <label>Ballast</label>
                <DropDownList
                  className="!bg-transparent"
                  placeholder="Select Ballast"
                  data={ballastOptions}
                  value={additional["ballast"] ?? ""}
                  onChange={(e) =>
                    setAdditional((p) => ({ ...p, ballast: String(e.value || "") }))
                  }
                />
              </div>
            ) : (
              <ReadonlyField
                label="Ballast"
                value={additional["ballast"] ?? ""}
              />
            )}

            {mode === "edit" ? (
              <Input
                label="Manifold Location"
                
                placeholder=" "
                value={additional["manifold"] ?? ""}
                onChange={(e) =>
                  setAdditional((p) => ({ ...p, manifold: String(e.value || "") }))
                }
              />
            ) : (
              <ReadonlyField
                label="Manifold Location"
                value={additional["manifold"] ?? ""}
              />
            )}

          </div>
        )}
      </div>

      {/* VESSEL OWNERS */}
      <div className="border border-gray-300 my-6 rounded">
        <div
          className="flex justify-between items-center bg-gray-100 px-4 py-2 cursor-pointer"
          onClick={() => setOpen3((s) => !s)}
        >
          <h3 className="font-bold text-gray-700">Vessel Owners</h3>
          <FontAwesomeIcon icon={open3 ? faChevronUp : faChevronDown} />
        </div>

        {open3 && (
          <div className="p-4 space-y-4">
            {mode === "edit" && (
              <Button themeColor="primary" onClick={addOwner}>
                <FontAwesomeIcon icon={faPlus} className="mr-1" /> Add Vessel Owner
              </Button>
            )}

            {mode === "edit" &&
              owners.map((o) => (
                <div
                  key={o.id}
                  className="flex flex-wrap gap-4 items-center border border-gray-300 p-3 rounded"
                >
                  <Input
                    label="Vessel Owner"
                    value={o.name}
                    onChange={(e) => updateOwner(o.id, "name", String(e.value || ""))}
                  />
                  <Input
                    label="Effective Date"
                    value={o.eff}
                    onChange={(e) => updateOwner(o.id, "eff", String(e.value || ""))}
                  />
                  <Input
                    label="Expiration Date"
                    value={o.exp}
                    onChange={(e) => updateOwner(o.id, "exp", String(e.value || ""))}
                  />

                  <Button
                    themeColor="primary"
                    className="mt-6"
                    onClick={() => removeOwner(o.id)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </Button>
                </div>
              ))}

            {/* VIEW MODE → GRID */}
            {mode === "view" && (
              <Grid data={owners}>
                <GridColumn field="name" title="Vessel Owner" />
                <GridColumn field="eff" title="Effective Date" />
                <GridColumn field="exp" title="Expiration Date" />
              </Grid>
            )}
          </div>
        )}
      </div>

      {/* NOTES */}
      <div className="border border-gray-300 my-6 rounded">
        <div className="bg-gray-100 px-4 py-2 font-bold text-gray-700">
          Notes
        </div>
        <div className="p-4">
          {mode === "edit" ? (
            <textarea
              className="w-full border p-3 rounded h-24 border-gray-300"
              placeholder="Enter Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          ) : (
            <ReadonlyField label="Notes" value={notes} />
          )}
        </div>
      </div>

      {/* ACTION BUTTONS */}
      {mode === "edit" && (
        <div className="flex justify-end gap-4">
          <Button themeColor="primary" onClick={handleSave} className="w-16">
            Save
          </Button>
          <Button onClick={handleCancel} className="w-16">
            Cancel
          </Button>
        </div>
      )}

      {/* Model */}
      {branchSelection && (
        <BranchSelectionModel
          open={branchSelection}
          onClose={() => setBranchSelection(false)}
        />
      )}
    </>
  );
}
