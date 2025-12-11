import { TabStrip, TabStripTab } from "@progress/kendo-react-layout";
import Vessel from "./Vessel/Vessel";
import VesselInformation from "./Vessel/Information";
import Compartments from "./Vessel/Compartments";
import AuditLog from "./Vessel/AuditLog";

interface VesselTabsProps {
  className?: string;
  selected: number;
  onSelect: (e: any) => void;
  selectedVesselData: any;
  onEditVessel: (vesselData: any) => void;
  onViewVessel: (vesselData: any) => void;
  mode?: "edit" | "view";
}

export default function VesselTabs({ 
  className, 
  selected, 
  onSelect, 
  selectedVesselData,
  onEditVessel,
  onViewVessel,
  mode = "edit"
}: VesselTabsProps) {
  
  return (
    <TabStrip
      selected={selected}
      onSelect={onSelect}
      scrollable={true}
      size="large"
      className={`w-full ${className}`}
    >
      <TabStripTab title="Vessel">
        <Vessel onEdit={onEditVessel} onView={onViewVessel} />
      </TabStripTab>

      <TabStripTab title="Vessel Information">
        <VesselInformation mode={mode} data={selectedVesselData} />
      </TabStripTab>

      <TabStripTab title="Vessel Compartments">
        <Compartments mode={mode} />
      </TabStripTab>

      <TabStripTab title="Audit Log">
        <AuditLog />
      </TabStripTab>
    </TabStrip>
  );
}
