import { useTrip } from "../../contexts/TripContext";
import TravelChecklist from "../../components/checklist/TravelChecklist";
import { getReadiness } from "../../utils/tripHelpers";

export default function ChecklistPage() {
  const {
    activeTrip,
    toggleChecklistItem,
    addChecklistItem,
    removeChecklistItem,
  } = useTrip();

  if (!activeTrip) {
    return (
      <div className="trv-empty">
        <h3>No trip selected</h3>
        <p>Checklist readiness is calculated per trip.</p>
      </div>
    );
  }

  const readiness = getReadiness(activeTrip.checklist);

  return (
    <div>
      <div className="trv-page-header">
        <div>
          <h1>Travel Checklist</h1>
          <p>Preparation tasks for {activeTrip.destination}.</p>
        </div>
      </div>

      <TravelChecklist
        items={activeTrip.checklist || []}
        readiness={readiness}
        onToggle={(id) => toggleChecklistItem(activeTrip.id, id)}
        onAdd={(label) => addChecklistItem(activeTrip.id, label)}
        onRemove={(id) => removeChecklistItem(activeTrip.id, id)}
      />
    </div>
  );
}
