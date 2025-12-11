import { useState } from "react";
import VesselTabs from "../components/VesselInformation";
import PageTitle from "../../../shared/components/PageTitle";
import { vessel } from "../dummyData/VesselInformation";

export default function Maintenance() {
  const [selected, setSelected] = useState(0);
  const [selectedVesselData, setSelectedVesselData] = useState<any>(vessel); 
  const [mode, setMode] = useState<"edit" | "view">("view");

  const handleSelect = (e: any) => {
    setSelected(e.selected);
  };

  const handleEditVessel = (vesselData: any) => {
    setSelectedVesselData(vesselData);
    setMode("edit");
    setSelected(1); // Switch to "Vessel Information" tab
  };

  const handleAddVessel = () => {
    setSelectedVesselData(null); // Clear selected data for new entry
    setMode("edit");
    setSelected(1); // Switch to "Vessel Information" tab
  };

  const handleViewVessel = (vesselData: any) => {
    setSelectedVesselData(vesselData);
    setMode("view");
    setSelected(1);
  };

  return (
    <>
      <PageTitle text="Vessel Information" onAdd={handleAddVessel} />
      <VesselTabs 
        className="p-4" 
        selected={selected}
        onSelect={handleSelect}
        selectedVesselData={selectedVesselData}
        onEditVessel={handleEditVessel}
        onViewVessel={handleViewVessel}
        mode={mode}
      />
    </>
  );
}
