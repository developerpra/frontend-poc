import { useState, useEffect } from "react";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { RadioGroup, RadioGroupChangeEvent } from "@progress/kendo-react-inputs";
import { DropDownList, DropDownListChangeEvent } from "@progress/kendo-react-dropdowns";
import { Checkbox, CheckboxChangeEvent } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";
import ReadonlyField from "@/shared/ui/ReadOnly";

export interface BranchData {
  type: string;
  value: string | null; // Stores either branch name or region name
  active: boolean;
}

interface BranchSelectionModelProps {
  open: boolean;
  onClose: () => void;
  onSave?: (data: BranchData) => void;
  initialData?: BranchData;
  mode?: "edit" | "view";
}

export default function BranchSelectionModel({ 
  open, 
  onClose, 
  onSave, 
  initialData, 
  mode = "edit" 
}: BranchSelectionModelProps) {
  const options = [
    { label: "All", value: "all" },
    { label: "Regions", value: "regions" },
    { label: "Individual", value: "individual" },
  ];

  const [type, setType] = useState("individual");
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [active, setActive] = useState(true);

  // Initialize state from props
  useEffect(() => {
    if (initialData) {
      setType(initialData.type || "individual");
      setSelectedValue(initialData.value);
      setActive(initialData.active ?? true);
    }
  }, [initialData, open]);

  const branches = ["Houston", "New York", "Texas", "Louisiana"];
  const regions = ["North", "South", "East", "West"];

  const handleSave = () => {
    if (onSave) {
      onSave({
        type,
        value: selectedValue,
        active
      });
    }
    onClose();
  };

  return (
    <>
      {open && (
        <Dialog
          width={400}
          title={mode === "view" ? "Branch Assignment Details" : "Branch Assignment Type"}
          onClose={onClose}
          className="min-w-[450px]"
        >
          {/* TOP SECTION */}
          {mode === "edit" ? (
            <RadioGroup
              data={options}
              value={type}
              onChange={(e: RadioGroupChangeEvent) => {
                setType(String(e.value));
                setSelectedValue(null); // Reset selection when type changes
              }}
              layout="horizontal"
              className="flex space-x-6"
            />
          ) : (
            <div className="mb-4">
              <label className="font-semibold block mb-1">Assignment Type</label>
              <div>{options.find(o => o.value === type)?.label || type}</div>
            </div>
          )}

          {/* CONDITIONAL SECTION */}
          {(type === "individual" || type === "regions") && (
            <div className="relative mt-4">
              {mode === "edit" ? (
                <>
                  <label className="font-semibold block mb-1">
                    {type === "individual" ? "Branch" : "Region"}
                  </label>
                  <DropDownList
                    data={type === "individual" ? branches : regions}
                    value={selectedValue}
                    onChange={(e: DropDownListChangeEvent) => setSelectedValue(e.value)}
                    className="w-full !bg-white"
                  />
                  <div className="flex gap-2 mt-4 items-center">
                    <Checkbox
                      checked={active}
                      onChange={(e: CheckboxChangeEvent) => setActive(Boolean(e.value))}
                      label="Active"
                    />
                  </div>
                </>
              ) : (
                <>
                  <ReadonlyField 
                    label={type === "individual" ? "Branch" : "Region"} 
                    value={selectedValue || "-"} 
                  />
                  <div className="mt-2">
                    <label className="font-medium text-gray-600 block">Status</label>
                    <div>{active ? "Active" : "Inactive"}</div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ACTION BUTTONS */}
          <DialogActionsBar>
            {mode === "edit" ? (
              <>
                <Button onClick={onClose} className="basis-3xs m-2">
                  Cancel
                </Button>
                <Button themeColor="primary" className="m-2" onClick={handleSave}>
                  Save
                </Button>
              </>
            ) : (
              <Button onClick={onClose} className="m-2">
                Close
              </Button>
            )}
          </DialogActionsBar>
        </Dialog>
      )}
    </>
  );
}
