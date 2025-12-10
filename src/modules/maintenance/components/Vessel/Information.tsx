import { useState, useEffect } from "react";
import { Checkbox, Input } from "@progress/kendo-react-inputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Button } from "@progress/kendo-react-buttons";
import { DatePicker } from "@progress/kendo-react-dateinputs";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
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
import BranchAssignmentDialog from "@/shared/components/BranchSelector";

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
  const [branchSelector, setBranchSelector] = useState(true);
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
    setBranchSelector(!branchSelector);
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
    // simple revert to original data prop (if any)
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
          <h3 className="font-bold text-gray-700">General Information</h3>
          <FontAwesomeIcon icon={open1 ? faChevronUp : faChevronDown} />
        </div>

        {open1 && (
          <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {mode === "edit" ? (
              <Input
                label="Vessel Name"
                labelClassName="font-medium"
                value={vesselName}
                placeholder=" "
                onChange={(e) => setVesselName(e.value)}
              />
            ) : (
              <ReadonlyField label="Vessel Name" value={vesselName} />
            )}

            {mode === "edit" ? (
              <div className="space-y-1">
                <label className="font-medium">Vessel Type</label>
                <DropDownList
                  className="!bg-transparent"
                  placeholder="Select Vessel Type"
                  data={vesselTypeOptions}
                  value={vesselType}
                  onChange={(e) => setVesselType(e.value)}
                />
              </div>
            ) : (
              <ReadonlyField label="Vessel Type" value={vesselType} />
            )}

            {mode === "edit" ? (
              <Input
                label="IMO Number"
                labelClassName="font-medium"
                value={imo}
                placeholder=" "
                onChange={(e) => setImo(e.value)}
              />
            ) : (
              <ReadonlyField label="IMO Number" value={imo} />
            )}

            {/* Active + Branch */}
            <div
              className={`flex ${mode === "edit" ? "mt-2 items-center gap-4" : "flex-col gap-1"}`}
            >
              {mode === "edit" ? (
                <>
                  <Checkbox
                    checked={active}
                    label="Active"
                    onChange={(e) => setActive(Boolean((e as any).value))}
                  />
                  <div className="flex items-center gap-1">
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      onClick={toggleDialog}
                      className="text-primary"
                    />
                    <label className="text-sm font-medium">Branch</label>
                  </div>
                </>
              ) : (
                <>
                  <label className="font-medium text-gray-600">Active</label>
                  <FontAwesomeIcon icon={active ? faCheck : faXmark} />
                  {/* <ReadonlyField label="Active" value={active ? "Yes" : "No"} /> */}
                  {/* <ReadonlyField label="Branch" value={branch} /> */}
                </>
              )}
            </div>

            {mode === "edit" ? (
              <Input
                label="VET Units"
                labelClassName="font-medium"
                value={vetUnits}
                placeholder=" "
                onChange={(e) => setVetUnits(e.value)}
              />
            ) : (
              <ReadonlyField label="VET Units" value={vetUnits} />
            )}

            {mode === "edit" ? (
              <Input
                label="Draft Unit"
                labelClassName="font-medium"
                value={draftUnit}
                placeholder=" "
                onChange={(e) => setDraftUnit(e.value)}
              />
            ) : (
              <ReadonlyField label="Draft Unit" value={draftUnit} />
            )}

            {mode === "edit" ? (
              <Input
                label="Gauge Unit"
                labelClassName="font-medium"
                value={gaugeUnit}
                placeholder=" "
                onChange={(e) => setGaugeUnit(e.value)}
              />
            ) : (
              <ReadonlyField label="Gauge Unit" value={gaugeUnit} />
            )}

            {mode === "edit" ? (
              <Input
                label="Volume Unit"
                labelClassName="font-medium"
                value={volumeUnit}
                placeholder=" "
                onChange={(e) => setVolumeUnit(e.value)}
              />
            ) : (
              <ReadonlyField label="Volume Unit" value={volumeUnit} />
            )}

            {mode === "edit" ? (
              <Input
                label="Vessel Capacity"
                labelClassName="font-medium"
                value={vesselCapacity}
                placeholder=" "
                onChange={(e) => setVesselCapacity(e.value)}
              />
            ) : (
              <ReadonlyField label="Vessel Capacity" value={vesselCapacity} />
            )}

            {mode === "edit" ? (
              <Input
                label="Compartments"
                labelClassName="font-medium"
                value={compartments}
                placeholder=" "
                onChange={(e) => setCompartments(e.value)}
              />
            ) : (
              <ReadonlyField label="Compartments" value={compartments} />
            )}

            {mode === "edit" ? (
              <Input
                label="Sand Pipe"
                labelClassName="font-medium"
                value={sandPipe}
                placeholder=" "
                onChange={(e) => setSandPipe(e.value)}
              />
            ) : (
              <ReadonlyField label="Sand Pipe" value={sandPipe} />
            )}

            {mode === "edit" ? (
              <Input
                label="Length Overall"
                labelClassName="font-medium"
                value={lengthOverall}
                placeholder=" "
                onChange={(e) => setLengthOverall(e.value)}
              />
            ) : (
              <ReadonlyField label="Length Overall" value={lengthOverall} />
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
          <div className="p-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5  gap-4">
            {mode === "edit" ? (
              <Input
                label="Beam"
                labelClassName="font-medium"
                value={additional["beam"] ?? ""}
                onChange={(e) =>
                  setAdditional((p) => ({ ...p, beam: e.value }))
                }
              />
            ) : (
              <ReadonlyField label="Beam" value={additional["beam"] ?? ""} />
            )}

            {mode === "edit" ? (
              <Input
                label="Draught"
                labelClassName="font-medium"
                placeholder=" "
                value={additional["draught"] ?? ""}
                onChange={(e) =>
                  setAdditional((p) => ({ ...p, draught: e.value }))
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
                label="Vessel Line Capacity"
                labelClassName="font-medium"
                placeholder=" "
                value={additional["vesselLine"] ?? ""}
                onChange={(e) =>
                  setAdditional((p) => ({ ...p, vesselLine: e.value }))
                }
              />
            ) : (
              <ReadonlyField
                label="Vessel Line Capacity"
                value={additional["vesselLine"] ?? ""}
              />
            )}

            {mode === "edit" ? (
              <Input
                label="Vessel Connection Type"
                labelClassName="font-medium"
                placeholder=" "
                value={additional["connectionType"] ?? ""}
                onChange={(e) =>
                  setAdditional((p) => ({ ...p, connectionType: e.value }))
                }
              />
            ) : (
              <ReadonlyField
                label="Vessel Connection Type"
                value={additional["connectionType"] ?? ""}
              />
            )}

            {mode === "edit" ? (
              <Input
                label="Ballast"
                labelClassName="font-medium"
                placeholder=" "
                value={additional["ballast"] ?? ""}
                onChange={(e) =>
                  setAdditional((p) => ({ ...p, ballast: e.value }))
                }
              />
            ) : (
              <ReadonlyField
                label="Ballast"
                value={additional["ballast"] ?? ""}
              />
            )}

            {mode === "edit" ? (
              <Input
                label="Manifold Location"
                labelClassName="font-medium"
                placeholder=" "
                value={additional["manifold"] ?? ""}
                onChange={(e) =>
                  setAdditional((p) => ({ ...p, manifold: e.value }))
                }
              />
            ) : (
              <ReadonlyField
                label="Manifold Location"
                value={additional["manifold"] ?? ""}
              />
            )}

            {mode === "edit" ? (
              <Input
                label="LOP"
                labelClassName="font-medium"
                placeholder=" "
                value={additional["lop"] ?? ""}
                onChange={(e) => setAdditional((p) => ({ ...p, lop: e.value }))}
              />
            ) : (
              <ReadonlyField label="LOP" value={additional["lop"] ?? ""} />
            )}

            {mode === "edit" ? (
              <Input
                label="Flying Flag"
                labelClassName="font-medium"
                placeholder=" "
                value={additional["flag"] ?? ""}
                onChange={(e) =>
                  setAdditional((p) => ({ ...p, flag: e.value }))
                }
              />
            ) : (
              <ReadonlyField
                label="Flying Flag"
                value={additional["flag"] ?? ""}
              />
            )}

            {mode === "edit" ? (
              <DatePicker
                placeholder="Choose a date..."
                label="Build Year"
                labelClassName="font-medium"
              />
            ) : (
              <ReadonlyField
                label="Build Year"
                value={additional["buildYear"] ?? ""}
              />
            )}

            {mode === "edit" ? (
              <Input
                label="Last Strapping"
                labelClassName="font-medium"
                placeholder=" "
                value={additional["lastSampling"] ?? ""}
                onChange={(e) =>
                  setAdditional((p) => ({ ...p, lastSampling: e.value }))
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
                label="Last Dry Dock"
                labelClassName="font-medium"
                placeholder=" "
                value={additional["lastDryDock"] ?? ""}
                onChange={(e) =>
                  setAdditional((p) => ({ ...p, lastDryDock: e.value }))
                }
              />
            ) : (
              <ReadonlyField
                label="Last Dry Dock"
                value={additional["lastDryDock"] ?? ""}
              />
            )}

            {mode === "edit" ? (
              <Input
                label="Former Name"
                labelClassName="font-medium"
                placeholder=" "
                value={additional["formerName"] ?? ""}
                onChange={(e) =>
                  setAdditional((p) => ({ ...p, formerName: e.value }))
                }
              />
            ) : (
              <ReadonlyField
                label="Former Name"
                value={additional["formerName"] ?? ""}
              />
            )}

            {mode === "edit" ? (
              <Input
                label="Barge Company"
                labelClassName="font-medium"
                placeholder=" "
                value={additional["bargeCompany"] ?? ""}
                onChange={(e) =>
                  setAdditional((p) => ({ ...p, bargeCompany: e.value }))
                }
              />
            ) : (
              <ReadonlyField
                label="Barge Company"
                value={additional["bargeCompany"] ?? ""}
              />
            )}

            {mode === "edit" ? (
              <Input
                label="Vessel Phone"
                labelClassName="font-medium"
                placeholder=" "
                value={additional["phone"] ?? ""}
                onChange={(e) =>
                  setAdditional((p) => ({ ...p, phone: e.value }))
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
                labelClassName="font-medium"
                placeholder=" "
                value={additional["email"] ?? ""}
                onChange={(e) =>
                  setAdditional((p) => ({ ...p, email: e.value }))
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
                label="Vessel Shipping Website"
                labelClassName="font-medium"
                placeholder=" "
                value={additional["website"] ?? ""}
                onChange={(e) =>
                  setAdditional((p) => ({ ...p, website: e.value }))
                }
              />
            ) : (
              <ReadonlyField
                label="Vessel Shipping Website"
                value={additional["website"] ?? ""}
              />
            )}

            {mode === "edit" ? (
              <Input
                label="Gross Reg. Tons"
                labelClassName="font-medium"
                placeholder=" "
                value={additional["gross"] ?? ""}
                onChange={(e) =>
                  setAdditional((p) => ({ ...p, gross: e.value }))
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
                labelClassName="font-medium"
                placeholder=" "
                value={additional["net"] ?? ""}
                onChange={(e) => setAdditional((p) => ({ ...p, net: e.value }))}
              />
            ) : (
              <ReadonlyField
                label="Net Reg. Tons"
                value={additional["net"] ?? ""}
              />
            )}

            {mode === "edit" ? (
              <Input
                label="Vessel Class"
                labelClassName="font-medium"
                placeholder=" "
                value={additional["class"] ?? ""}
                onChange={(e) =>
                  setAdditional((p) => ({ ...p, class: e.value }))
                }
              />
            ) : (
              <ReadonlyField
                label="Vessel Class"
                value={additional["class"] ?? ""}
              />
            )}

            {mode === "edit" ? (
              <Input
                label="Ocean Going Barge"
                labelClassName="font-medium"
                placeholder=" "
                value={additional["oceanGoing"] ?? ""}
                onChange={(e) =>
                  setAdditional((p) => ({ ...p, oceanGoing: e.value }))
                }
              />
            ) : (
              <ReadonlyField
                label="Ocean Going Barge"
                value={additional["oceanGoing"] ?? ""}
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
                <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add
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
                    onChange={(e) => updateOwner(o.id, "name", e.value)}
                  />
                  <Input
                    label="Effective Date"
                    value={o.eff}
                    onChange={(e) => updateOwner(o.id, "eff", e.value)}
                  />
                  <Input
                    label="Expiration Date"
                    value={o.exp}
                    onChange={(e) => updateOwner(o.id, "exp", e.value)}
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
      {branchSelector && (
        <BranchAssignmentDialog
          open={branchSelector}
          onClose={() => setBranchSelector(false)}
        />
      )}
    </>
  );
}
