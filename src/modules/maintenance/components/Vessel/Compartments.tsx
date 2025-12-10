import { useState } from "react";
import { Button, ButtonGroup } from "@progress/kendo-react-buttons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFile,
  faPlus,
  faTrash,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { Input } from "@progress/kendo-react-inputs";
import { Grid, GridColumn, GridCellProps } from "@progress/kendo-react-grid";

export default function Compartments({
  mode = "edit",
}: {
  mode?: "edit" | "view";
}) {
  const [page, setPage] = useState({
    skip: 0,
    take: 10,
  });

  const [rows, setRows] = useState([
    {
      id: 1,
      compt: "01P",
      refHeight: "21.84",
      gauge: "A",
      capacity: "70.640",
      vol: "0.000",
      selected: false,
    },
    {
      id: 2,
      compt: "01S",
      refHeight: "21.84",
      gauge: "A",
      capacity: "70.640",
      vol: "0.000",
      selected: false,
    },
    {
      id: 3,
      compt: "02P",
      refHeight: "21.84",
      gauge: "A",
      capacity: "70.640",
      vol: "0.000",
      selected: false,
    },
  ]);

  const handlePageChange = (e: any) => {
    setPage(e.page);
  };

  const handleAddRow = () => {
    setRows((prev) => [
      ...prev,
      {
        id: Date.now(),
        compt: "",
        refHeight: "",
        gauge: "",
        capacity: "",
        vol: "",
        selected: false,
      },
    ]);
  };

  const handleDelete = () => {
    setRows(rows.filter((r) => !r.selected));
  };

  const SelectionCell = (props: GridCellProps) => {
    if (mode === "view") return <td></td>;
    const item = props.dataItem;

    return (
      <td>
        <input
          type="checkbox"
          checked={item.selected}
          onChange={(e) => {
            const updated = rows.map((r) =>
              r.id === item.id ? { ...r, selected: e.target.checked } : r
            );
            setRows(updated);
          }}
        />
      </td>
    );
  };

  const EditableCell =
    (field: keyof (typeof rows)[0]) => (props: GridCellProps) => {
      const item = props.dataItem;

      // VIEW MODE → Only show text
      if (mode === "view") {
        return <td className="px-2">{item[field]}</td>;
      }

      // EDIT MODE → Input
      return (
        <td>
          <Input
            value={item[field] ?? ""}
            onChange={(e) => {
              const updated = rows.map((r) =>
                r.id === item.id ? { ...r, [field]: e.value } : r
              );
              setRows(updated);
            }}
          />
        </td>
      );
    };

  const DeleteCell = (props: GridCellProps) => {
    if (mode === "view") return <td></td>;

    return (
      <td className="text-center">
        <FontAwesomeIcon
          icon={faTrash}
          className="text-primary cursor-pointer"
          onClick={() =>
            setRows(rows.filter((r) => r.id !== props.dataItem.id))
          }
        />
      </td>
    );
  };

  function handleSave() {}
  function handleCancel() {}

  return (
    <>
      {/* TOP FILTER SECTION */}
      {mode === "edit" && (
        <div className="flex justify-between border border-gray-300 rounded-lg p-4 my-6">
          <div>
            <h3 className="font-bold text-gray-700">Compartment Type</h3>
            <ButtonGroup>
              <Button togglable selected className="w-22">
                Blank
              </Button>
              <Button togglable className="w-22">
                P,S Series
              </Button>
              <Button togglable className="w-22">
                P,S,C Series
              </Button>
            </ButtonGroup>
          </div>

          <Input
            label="Number of Compt."
            labelClassName="font-medium"
            placeholder=" "
            className=""
          />
          <Input
            label="Starting Compt. #"
            labelClassName="font-medium"
            placeholder=" "
            className=""
          />

          <div>
            <h3 className="font-bold text-gray-700">Include Slops Compt.</h3>
            <ButtonGroup>
              <Button togglable selected className="w-16">
                Yes
              </Button>
              <Button togglable className="w-16">
                No
              </Button>
            </ButtonGroup>
          </div>

          <div className="flex gap-4 mt-4">
            <Button
              themeColor="primary"
              className="w-20"
              onClick={handleAddRow}
            >
              <FontAwesomeIcon icon={faPlus} className="mr-1" /> Add
            </Button>
            <Button className="w-20" onClick={handleDelete}>
              <FontAwesomeIcon icon={faTrash} className="mr-1" /> Delete
            </Button>
          </div>
        </div>
      )}

      {/* GRID TABLE */}
      <div className="border border-gray-300 rounded-lg bg-white mt-4">
        <Grid
          data={rows.slice(page.skip, page.skip + page.take)}
          skip={page.skip}
          take={page.take}
          total={rows.length}
          pageable={{
            pageSizes: [5, 10, 20, 50],
            buttonCount: 5,
          }}
          onPageChange={handlePageChange}
        >
          {mode === "edit" && (
            <GridColumn
              field="Selected"
              width="60px"
              title=""
              cells={{
                data: SelectionCell,
              }}
            />
          )}

          <GridColumn
            field="compt"
            title="Compt."
            cells={{
              data: EditableCell("compt"),
            }}
          />

          <GridColumn
            field="refHeight"
            title="Ref. Height"
            cells={{
              data: EditableCell("refHeight"),
            }}
          />

          <GridColumn
            field="gauge"
            title="Gauge Location"
            cells={{
              data: EditableCell("gauge"),
            }}
          />

          <GridColumn
            field="capacity"
            title="Capacity"
            cells={{
              data: EditableCell("capacity"),
            }}
          />

          <GridColumn
            field="vol"
            title="+-1/8” or 3mm Vol."
            cells={{
              data: EditableCell("vol"),
            }}
          />

          {/* ---- Delete Icon Column (EDIT MODE ONLY) ---- */}
          {mode === "edit" && (
            <GridColumn
              field="action"
              title="Action"
              width="90px"
              cells={{
                data: DeleteCell,
              }}
            />
          )}
        </Grid>
      </div>

      {/* SAVE/CANCEL */}
      {mode === "edit" && (
        <div className="flex justify-end gap-4 my-6">
          <Button themeColor="primary" onClick={handleSave}>
            <FontAwesomeIcon icon={faFile} className="mr-1" /> Save
          </Button>
          <Button onClick={handleCancel}>
            <FontAwesomeIcon icon={faXmark} className="mr-1" /> Cancel
          </Button>
        </div>
      )}
    </>
  );
}
