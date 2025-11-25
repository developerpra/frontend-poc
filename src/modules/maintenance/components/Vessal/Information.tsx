import { useState } from "react";
import { Input } from "@progress/kendo-react-inputs";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { Button } from "@progress/kendo-react-buttons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronDown,
  faChevronUp,
  faLocationDot,
  faPlus,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

export default function Information() {
  const [open1, setOpen1] = useState(true);
  const [open2, setOpen2] = useState(true);
  const [open3, setOpen3] = useState(true);
  const [owners, setOwners] = useState([
    {
      id: 1,
      name: "VESSEL MANAGEMENT",
      eff: "01-Aug-2023",
      exp: "30-Jul-2026",
    },
    { id: 2, name: "Victory Spirit", eff: "01-Aug-2022", exp: "31-Dec-2024" },
    { id: 3, name: "African Spirit", eff: "10-May-2022", exp: "30-Dec-2026" },
  ]);

  const addOwner = () => {
    setOwners([...owners, { id: Date.now(), name: "", eff: "", exp: "" }]);
  };

  const updateOwner = (id, field, value) => {
    setOwners(owners.map((o) => (o.id === id ? { ...o, [field]: value } : o)));
  };

  const removeOwner = (id) => {
    setOwners(owners.filter((o) => o.id !== id));
  };

  return (
    <>
      {/* GENERAL INFORMATION */}
      <div className="border border-gray-300 my-6 rounded">
        <div
          className="flex justify-between items-center bg-gray-100 px-4 py-2 cursor-pointer"
          onClick={() => setOpen1(!open1)}
        >
          <h3 className="font-semibold text-gray-700">General Information</h3>
          <FontAwesomeIcon icon={open1 ? faChevronUp : faChevronDown} />
        </div>

        {open1 && (
          <div className="p-4 grid grid-cols-4 gap-4">
            <Input label="Vessel Name" />
            <DropDownList label="Vessel Type" data={["Barge", "Tow", "Ship"]} />
            <Input label="IMO Number" />
            <Input label="Active" />

            <div className="flex flex-col">
              <label className="text-sm font-medium">Branch</label>
              <div className="flex items-center gap-2 border rounded px-3 py-2">
                <FontAwesomeIcon
                  icon={faLocationDot}
                  className="text-blue-600"
                />
                <input className="flex-1 outline-none" placeholder="Branch" />
              </div>
            </div>

            <Input label="VET Units" />
            <Input label="Draft Unit" />
            <Input label="Gauge Unit" />
            <Input label="Volume Unit" />
            <Input label="Vessel Capacity" />
            <Input label="Compartments" />
            <Input label="Sand Pipe" />
            <Input label="Length Overall" />
          </div>
        )}
      </div>

      {/* ADDITIONAL INFORMATION */}
      <div className="border border-gray-300 my-6 rounded">
        <div
          className="flex justify-between items-center bg-gray-100 px-4 py-2 cursor-pointer"
          onClick={() => setOpen2(!open2)}
        >
          <h3 className="font-semibold text-gray-700">
            Additional Information
          </h3>
          <FontAwesomeIcon icon={open2 ? faChevronUp : faChevronDown} />
        </div>

        {open2 && (
          <div className="p-4 grid-cols-4 gap-4 grid">
            <Input label="Beam" />
            <Input label="Draught" />
            <Input label="Vessel Line Capacity" />
            <Input label="Vessel Connection Type" />
            <Input label="Ballast" />
            <Input label="Manifold Location" />
            <Input label="LOP" />
            <Input label="Flying Flag" />
            <Input label="Build Year" />
            <Input label="Last Sampling" />
            <Input label="Last Dry Dock" />
            <Input label="Former Name" />
            <Input label="Barge Company" />
            <Input label="Vessel Phone" />
            <Input label="Vessel Email" />
            <Input label="Vessel Shipping Website" />
            <Input label="Gross Reg. Tons" />
            <Input label="Net Reg. Tons" />
            <Input label="Vessel Class" />
            <Input label="Ocean Going Barge" />
          </div>
        )}
      </div>

      {/* VESSEL OWNERS */}
      <div className="border border-gray-300 my-6 rounded">
        <div
          className="flex justify-between items-center bg-gray-100 px-4 py-2 cursor-pointer"
          onClick={() => setOpen3(!open3)}
        >
          <h3 className="font-semibold text-gray-700">Vessel Owners</h3>
          <FontAwesomeIcon icon={open3 ? faChevronUp : faChevronDown} />
        </div>

        {open3 && (
          <div className="p-4 space-y-4">
            <Button themeColor="primary" onClick={addOwner}>
              <FontAwesomeIcon icon={faPlus} className="mr-2" /> Add
            </Button>

            {owners.map((o) => (
              <div key={o.id} className=" items-center border p-3 rounded">
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

                <Button themeColor="error" onClick={() => removeOwner(o.id)}>
                  <FontAwesomeIcon icon={faTrash} />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* NOTES */}
      <div className="border border-gray-300 my-6 rounded">
        <div className="bg-gray-100 px-4 py-2 font-semibold text-gray-700">
          Notes
        </div>
        <div className="p-4">
          <textarea
            className="w-full border border-gray-300 rounded p-3 h-24"
            placeholder="Enter notes..."
          />
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-end gap-4 pt-4">
        <Button themeColor="primary">Save</Button>
        <Button>Cancel</Button>
      </div>
    </>
  );
}
