import React, { useState, useMemo } from "react";
import {
  DropDownList,
  DropDownListChangeEvent,
} from "@progress/kendo-react-dropdowns";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";
import { Checkbox, Input } from "@progress/kendo-react-inputs";
import { Button, ButtonGroup } from "@progress/kendo-react-buttons";
import { Grid, GridCellProps, GridColumn, GridPageChangeEvent, GridRowProps } from "@progress/kendo-react-grid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import VesselBranches from "@/shared/ui/VesselBranches";
import BranchSelectionModel from "@/shared/ui/BranchSelectionModel";
import { useGetVesselListQuery } from "@/services/api/apiSlice";

const vesselTypes = ["Barge", "Tow", "Ship"];
// const vesselNames = ["EBL-2869", "EBL-2900", "EBL - 2971 & 2972"]; // Kept as reference if needed, but not used for API filter dropdown if dynamic
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
  });

  const [status, setStatus] = useState<"Active" | "Inactive">("Active");

  const [page, setPage] = useState({
    skip: 0,
    take: 10,
  });

  // State for effective search params (used for API call)
  const [activeFilters, setActiveFilters] = useState({ ...filters, status });

  // Calculate API params based on active filters and pagination
  const queryParams = {
    pageIndex: Math.floor(page.skip / page.take),
    pageSize: page.take,
    VesselName: activeFilters.vessel || undefined,
    VesselType: activeFilters.vesselType || undefined,
    ImoNumber: activeFilters.imo || undefined,
    Active: activeFilters.status === "Active",
  };
  
  const { data: apiResponse, isLoading } = useGetVesselListQuery(queryParams);
  const gridData = apiResponse?.data?.items || [];
  const gridTotal = apiResponse?.data?.totalItems || 0;

  const handlePageChange = (e: GridPageChangeEvent) => {
    setPage(e.page);
  };

  const onSearchClick = () => {
    setPage({ skip: 0, take: 10 }); // Reset to first page on new search
    setActiveFilters({ ...filters, status });
  };

  const clearFilters = () => {
    const resetFilters = {
      vessel: "",
      vesselType: "",
      imo: "",
      branch: "",
    };
    setFilters(resetFilters);
    setStatus("Active");
    setActiveFilters({ ...resetFilters, status: "Active" });
    setPage({ skip: 0, take: 10 });
  };

  const ActionCell = (props: GridCellProps) => (
    <td>
      <div className="flex items-center justify-center gap-3 text-lg">
        <button
          type="button"
          title="Edit"
          onClick={(e) => {
            e.stopPropagation(); 
            // Map API item to expected format for onEdit if needed
             // The API item has vesselId, but form might expect id. 
             // We should pass the item as is, but ensure onEdit handles it.
             // Based on previous turn, Information.tsx uses data.id.
             // API list item has vesselId. We might need to normalize.
            onEdit?.({ ...props.dataItem, id: props.dataItem.vesselId });
          }}
          className="text-primary cursor-pointer"
        >
          <FontAwesomeIcon icon={faLocationDot} className="text-primary" />
        </button>
  
        <button
          type="button"
          title="Edit"
          onClick={(e) => {
            e.stopPropagation(); 
            onEdit?.({ ...props.dataItem, id: props.dataItem.vesselId });
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
    const isInactive = !props.dataItem.active;
    const trProps = {
      ...trElement.props,
      className: `${trElement.props.className || ""} ${isInactive ? "!bg-gray-100 !text-gray-400" : ""} cursor-pointer hover:bg-gray-50`,
      onClick: (e: React.MouseEvent) => {
        if (trElement.props.onClick) trElement.props.onClick(e);
        onView?.({ ...props.dataItem, id: props.dataItem.vesselId });
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
             <Input
                value={filters.vessel}
                onChange={(e) => setFilters({ ...filters, vessel: String(e.value || "") })}
                placeholder=" "
              />
          </div>

          <div className="space-y-1">
            <label>Vessel Type</label>
            <DropDownList
              className=" !bg-transparent"
              data={vesselTypes}
              value={filters.vesselType}
              onChange={(e: DropDownListChangeEvent) =>
                setFilters({ ...filters, vesselType: e.value ?? "" })
              }
            />
          </div>

          <Input
            label="IMO Number"
            placeholder=" "
            value={filters.imo}
            onChange={(e) => setFilters({ ...filters, imo: String(e.value || "") })}
          />
          <div className="space-y-1 relative">
            <div className="flex absolute right-1">
              <Checkbox defaultChecked={true} size={"small"} disabled />
              <label className="ml-2 mt-0.5">Active</label>
            </div>

            <label>Branch</label>
            <DropDownList
              className=" !bg-transparent"
              data={[]} // No branch data in list API, making this empty or could use uniqueBranches if we had them
              value={filters.branch}
              onChange={(e: DropDownListChangeEvent) =>
                setFilters({ ...filters, branch: e.value ?? "" })
              }
              disabled={true} // Disable as not supported by API yet
            />
          </div>

          {/* Status */}
          <div className="w-fit h-fit flex flex-col">
            <label htmlFor="" className="font-medium mb-1">
              Vessel Status
            </label>
            <ButtonGroup>
              <Button 
                togglable={true} 
                className="w-16" 
                selected={status === "Active"}
                onClick={() => setStatus("Active")}
              >
                Active
              </Button>

              <Button 
                togglable={true} 
                className="w-16"
                selected={status === "Inactive"}
                onClick={() => setStatus("Inactive")}
              >
                Inactive
              </Button>
            </ButtonGroup>
          </div>

          {/* Buttons */}
          <div className="flex gap-4">
            <Button themeColor="primary" onClick={onSearchClick} disabled={isLoading}>
              {isLoading ? "Searching..." : "Search"}
            </Button>
            <Button onClick={clearFilters}>Clear Filters</Button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="border border-gray-300 rounded-lg mt-4 overflow-auto">
        <Grid
          className="min-w-[700px] w-full"
          data={gridData}
          skip={page.skip}
          take={page.take}
          total={gridTotal}
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
          <GridColumn field="imoNumber" title="IMO Number" />
          <GridColumn 
            field="active" 
            title="Status" 
            cell={(props) => (
              <td>{props.dataItem.active ? "Active" : "Inactive"}</td>
            )}
          />
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
