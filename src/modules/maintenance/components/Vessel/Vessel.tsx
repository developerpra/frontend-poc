import React, { useState, useMemo } from "react";
import {
  DropDownList,
  DropDownListChangeEvent,
} from "@progress/kendo-react-dropdowns";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { Checkbox, Input } from "@progress/kendo-react-inputs";
import { Button, ButtonGroup } from "@progress/kendo-react-buttons";
import { Grid, GridCellProps, GridColumn, GridPageChangeEvent, GridRowProps, GridRowClickEvent } from "@progress/kendo-react-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { vessels } from "../../dummyData/VesselsData";
import VesselBranches from "@/shared/ui/VesselBranches";
import BranchSelectionModel from "@/shared/ui/BranchSelectionModel";

const vesselTypes = ["Barge", "Tow", "Ship"];
const vesselNames = ["EBL-2869", "EBL-2900", "EBL - 2971 & 2972"];
const branches = [
  {
    group: "US - East Coast",
    items: ["Linden", "New Haven"],
  },
  {
    group: "US - Gulf Coast Central",
    items: ["Corpus Christi"],
  },
];

const BranchCell = (props: GridCellProps) => {
  return (
    <td>
      <VesselBranches data={branches} />
    </td>
  );
};

interface VesselPageProps {
  onEdit?: (data: any) => void;
  onView?: (data: any) => void;
}

export default function VesselPage({ onEdit, onView }: VesselPageProps) {
  const [branchSelection, setBranchSelection] = useState(false);

  const [filters, setFilters] = useState({
    vessel: "",
    vesselType: "",
    imo: "",
    branch: "",
    status: "",
  });

  const [status, setStatus] = useState<"Active" | "Inactive">("Active");

  const [data, setData] = useState(vessels);

  const [page, setPage] = useState({
    skip: 0,
    take: 10,
  });

  const uniqueBranches = useMemo(() => Array.from(new Set(vessels.map(v => v.branch))), []);

  const handlePageChange = (e: GridPageChangeEvent) => {
    setPage(e.page);
  };

  const handleSearch = () => {
    let filtered = vessels;

    if (filters.vessel) {
      filtered = filtered.filter((d) =>
        d.vesselName.toLowerCase().includes(filters.vessel.toLowerCase())
      );
    }

    if (filters.vesselType) {
      filtered = filtered.filter((d) => d.vesselType === filters.vesselType);
    }

    if (filters.imo) {
      filtered = filtered.filter((d) => d.id.toString().includes(filters.imo));
    }

    if (filters.branch) {
      filtered = filtered.filter((d) =>
        d.branch.includes(filters.branch)
      );
    }

    if (status) {
      filtered = filtered.filter((d) => d.status === status);
    }

    setData(filtered);
  };

  const clearFilters = () => {
    setFilters({
      vessel: "",
      vesselType: "",
      imo: "",
      branch: "",
      status: "",
    });
    setStatus("Active");
    setData(vessels);
  };

  const ActionCell = (props: GridCellProps) => (
    <td>
      <div className="flex items-center justify-center gap-3 text-lg">
        <button
          type="button"
          title="Edit"
          onClick={(e) => {
            e.stopPropagation(); // Prevent row click
            onEdit?.(props.dataItem);
          }}
          className="text-primary cursor-pointer"
        >
          <FontAwesomeIcon icon={faLocationDot} className="text-primary" />
        </button>
  
        <button
          type="button"
          title="Edit"
          onClick={(e) => {
            e.stopPropagation(); // Prevent row click
            onEdit?.(props.dataItem);
          }}
          className="text-primary cursor-pointer"
        >
          <FontAwesomeIcon icon={faPenToSquare} />
        </button>
        <button
          type="button"
          title="Delete"
          className="text-primary cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </td>
  );

  const rowRender = (trElement: React.ReactElement<HTMLTableRowElement>, props: GridRowProps) => {
    const isInactive = props.dataItem.status === "Inactive";
    const trProps = {
      ...trElement.props,
      className: `${trElement.props.className || ""} ${isInactive ? "!bg-gray-100 !text-gray-400" : ""} cursor-pointer hover:bg-gray-50`,
      onClick: (e: React.MouseEvent) => {
        // @ts-expect-error onClick might not be in the type definition but exists on props
        if (trElement.props.onClick) trElement.props.onClick(e);
        onView?.(props.dataItem);
      }
    };
    return React.cloneElement(trElement, { ...trProps }, trElement.props.children);
  };

  return (
    <>
      {/* Filters Card */}
      <div className="border border-gray-300 rounded-lg p-4 my-6">
        <h3 className="font-bold text-gray-700 pb-4">Filters</h3>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="space-y-1">
            <label>Vessel</label>
            <DropDownList
              className=" !bg-transparent"
              data={vesselNames}
              value={filters?.vessel}
              onChange={(e) =>
                setFilters({ ...filters, vessel: e.value ?? "" })
              }
            />
          </div>

          <div className="space-y-1">
            <label>Vessel Type</label>
            <DropDownList
              className=" !bg-transparent"
              data={vesselTypes}
              value={filters?.vesselType}
              onChange={(e: DropDownListChangeEvent) =>
                setFilters({ ...filters, vesselType: e.value ?? "" })
              }
            />
          </div>

          <Input
            label="IMO Number"
            placeholder=" "
            value={filters?.imo}
            onChange={(e) => setFilters({ ...filters, imo: e.value ?? "" })}
          />
          <div className="space-y-1 relative">
            <div className="flex absolute right-1">
              <Checkbox defaultChecked={true} size={"small"} />
              <label className="ml-2 mt-0.5">Active</label>
            </div>

            <label>Branch</label>
            <DropDownList
              className=" !bg-transparent"
              data={uniqueBranches} // Fix: Used computed unique branches instead of vessels?.branch
              value={filters?.branch}
              onChange={(e: DropDownListChangeEvent) =>
                setFilters({ ...filters, branch: e.value ?? "" })
              }
            />
          </div>

          {/* Status */}
          <div className="w-fit h-fit flex flex-col">
            <label htmlFor="" className="font-medium mb-1">
              Vessel Status
            </label>
            <ButtonGroup>
              <Button togglable={true} className="w-16">
                Active
              </Button>

              <Button togglable={true} className="w-16">
                Inactive
              </Button>
            </ButtonGroup>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <Button themeColor="primary" onClick={handleSearch}>
              Search
            </Button>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-300 rounded-lg mt-4 overflow-auto">
        <Grid
          className="min-w-[700px] w-full"
          data={data?.slice(page.skip, page.skip + page.take)}
          skip={page?.skip}
          take={page?.take}
          total={data?.length}
          pageable={{
            pageSizes: [5, 10, 20, 50],
            buttonCount: 5,
          }}
          onPageChange={handlePageChange}
          // @ts-expect-error rowRender is valid but might be missing in types
          rowRender={rowRender}
        >
          <GridColumn
            className="col-vessel"
            field="vesselName"
            title="Vessel Name"
          />
          <GridColumn field="vesselType" title="Vessel Type" />
          <GridColumn field="id" title="IMO Number" />
          <GridColumn
            field="branch"
            title="Branch"
            cells={{
              data: BranchCell,
            }}
          />

          <GridColumn
            field="action"
            title="Action"
            cells={{
              data: ActionCell,
            }}
          />
        </Grid>
      </div>

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
