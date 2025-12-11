import { useState } from "react";
import {map,isArray,isObject} from "lodash-es";

export interface BranchGroup {
  group: string;
  items: string[];
}

interface VesselBranchesProps {
  data?: BranchGroup[];
}

export default function VesselBranches({ data = [] }: VesselBranchesProps) {
  const [open, setOpen] = useState(false);

  // Validate incoming structure
  const safeData: BranchGroup[] = isArray(data)
    ? data.filter(
        (g) =>
          isObject(g) &&
          typeof g.group === "string" &&
          isArray(g.items)
      )
    : [];

  return (
    <div className="text-sm">
      {/* Toggle Link */}
      <button
        className="text-primary underline cursor-pointer"
        onClick={() => setOpen((prev) => !prev)}
      >
        {open ? "Hide Branches" : "Show Branches"}
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out 
          ${open ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
      >
        <div className="mt-2 pl-1">

        {map<BranchGroup>(safeData, (group: BranchGroup, idx: number) => (
          <div key={idx} className="mb-2">
            <div className="font-semibold">{group.group}</div>

            <ul className="pl-3">
              {map<string>(group.items, (item:string, i:number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
          {safeData.length === 0 && (
            <div className="text-gray-500 italic">
              No branches available
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
