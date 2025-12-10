import { useState } from "react";
import { Dialog, DialogActionsBar } from "@progress/kendo-react-dialogs";
import { RadioGroup } from "@progress/kendo-react-inputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Checkbox } from "@progress/kendo-react-inputs";
import { Button } from "@progress/kendo-react-buttons";

export default function BranchAssignmentDialog({ open, onClose }) {
  const options = [
    { label: "All", value: "all" },
    { label: "Regions", value: "regions" },
    { label: "Individual", value: "individual" },
  ];

  const [type, setType] = useState("individual");
  const [branch, setBranch] = useState(null);
  const [region, setRegion] = useState(null);
  const [active, setActive] = useState(true);

  const branches = ["Houston", "New York", "Texas", "Louisiana"];
  const regions = ["North", "South", "East", "West"];

  return (
    <>
      {open && (
        <Dialog
          width={400}
          title="Branch Assignment Type"
          onClose={onClose}
          className="min-w-[450px]"
        >
          {/* TOP SECTION */}

          <RadioGroup
            data={options}
            value={type}
            onChange={(e) => setType(e.value)}
            layout="horizontal"
            className="flex space-x-6"
          />

          {/* CONDITIONAL SECTION */}
          {(type === "individual" || type === "regions") && (
            <div className="relative mt-4">
              <label className="font-semibold">
                {type === "individual" ? "Branch" : "Region"}
              </label>
              <DropDownList
                data={type === "individual" ? branches : regions}
                value={type === "individual" ? branch : region}
                onChange={(e) =>
                  type === "individual"
                    ? setBranch(e.value)
                    : setRegion(e.value)
                }
                className="w-full !bg-white"
              />
              <div className="flex gap-2 absolute top-0 right-0">
                <Checkbox
                  checked={active}
                  onChange={(e) => setActive(e.value)}
                />
                <label className="font-semibold">Active</label>
              </div>
            </div>
          )}

          {/* ACTION BUTTONS */}
          <DialogActionsBar>
            <Button onClick={onClose} className="basis-3xs m-2">
              Cancel
            </Button>
            <Button themeColor="primary" className="m-2" onClick={onClose}>
              Save
            </Button>
          </DialogActionsBar>
        </Dialog>
      )}
    </>
  );
}
