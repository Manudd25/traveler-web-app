import { useEffect, useMemo, useState } from "react";
import { useTrip } from "../../contexts/TripContext";
import { ITINERARY_CATEGORIES } from "../../data/constants";
import { resolveTripCover } from "../../utils/tripCovers";
import {
  groupItineraryByDay,
  parseDate,
  tripDurationDays,
} from "../../utils/tripHelpers";

const blankItem = {
  day: 1,
  dayLabel: "",
  time: "10:00",
  title: "",
  category: "activity",
  location: "",
  notes: "",
  price: 0,
  bookingStatus: "planned",
};

const CATEGORY_ICON = {
  flight: "fa-plane",
  accommodation: "fa-bed",
  restaurant: "fa-utensils",
  cinema: "fa-film",
  attraction: "fa-landmark",
  transport: "fa-subway",
  activity: "fa-walking",
};

const weekday = (date) =>
  date.toLocaleDateString("en-GB", { weekday: "short" });

export default function ItineraryPage() {
  const {
    activeTrip,
    addItineraryItem,
    updateItineraryItem,
    removeItineraryItem,
    updateTrip,
  } = useTrip();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(blankItem);
  const [selectedDay, setSelectedDay] = useState(1);
  const [dailyNote, setDailyNote] = useState("");

  const groups = useMemo(
    () => groupItineraryByDay(activeTrip?.itinerary || []),
    [activeTrip?.itinerary]
  );

  useEffect(() => {
    if (!activeTrip) return;
    setDailyNote(activeTrip.notesByDay?.[`dayNote_${selectedDay}`] || "");
  }, [activeTrip, selectedDay]);

  const dayChips = useMemo(() => {
    if (!activeTrip) return [];
    const total = tripDurationDays(activeTrip.startDate, activeTrip.endDate) || Math.max(groups.length, 1);
    const start = parseDate(activeTrip.startDate);
    return Array.from({ length: total }, (_, i) => {
      const dayNum = i + 1;
      const date = start ? new Date(start) : null;
      if (date) date.setDate(date.getDate() + i);
      const group = groups.find((g) => g.day === dayNum);
      return {
        day: dayNum,
        label: group?.dayLabel || `Day ${dayNum}`,
        date,
        weekday: date ? weekday(date) : `D${dayNum}`,
        dateNum: date ? date.getDate() : dayNum,
      };
    });
  }, [activeTrip, groups]);

  if (!activeTrip) {
    return (
      <div className="trv-empty">
        <h3>Select a trip first</h3>
        <p>Itinerary items belong to the active trip.</p>
      </div>
    );
  }

  const activeGroup = groups.find((g) => g.day === selectedDay);
  const items = activeGroup?.items || [];
  const noteKey = `dayNote_${selectedDay}`;

  const openCreate = () => {
    setEditingId(null);
    setForm({ ...blankItem, day: selectedDay });
    setShowForm(true);
  };

  const openEdit = (item) => {
    setEditingId(item.id);
    setForm({
      day: item.day || 1,
      dayLabel: item.dayLabel || "",
      time: item.time || "",
      title: item.title || "",
      category: item.category || "activity",
      location: item.location || "",
      notes: item.notes || "",
      price: item.price || 0,
      bookingStatus: item.bookingStatus || "planned",
    });
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      day: Number(form.day) || selectedDay,
      price: Number(form.price) || 0,
      dayLabel: form.dayLabel || `Day ${form.day || selectedDay}`,
    };
    if (editingId) {
      updateItineraryItem(activeTrip.id, editingId, payload);
    } else {
      addItineraryItem(activeTrip.id, payload);
    }
    setShowForm(false);
    setEditingId(null);
  };

  const saveDailyNote = () => {
    updateTrip(activeTrip.id, (trip) => ({
      ...trip,
      notesByDay: { ...(trip.notesByDay || {}), [noteKey]: dailyNote },
    }));
  };

  return (
    <div>
      <div className="trv-page-header">
        <div>
          <h1>Itinerary</h1>
          <p>Day-by-day plan for {activeTrip.destination}.</p>
        </div>
        <button type="button" className="trv-btn trv-btn-primary" onClick={openCreate}>
          Add item
        </button>
      </div>

      <div className="itin-days" role="tablist" aria-label="Trip days">
        {dayChips.map((chip) => (
          <button
            key={chip.day}
            type="button"
            role="tab"
            aria-selected={selectedDay === chip.day}
            className={`itin-day-chip ${selectedDay === chip.day ? "active" : ""}`}
            onClick={() => setSelectedDay(chip.day)}
          >
            <span>{chip.weekday}</span>
            <strong>{chip.dateNum}</strong>
          </button>
        ))}
      </div>

      {showForm && (
        <form className="trv-card" style={{ marginBottom: "1.25rem" }} onSubmit={handleSubmit}>
          <h3 style={{ marginTop: 0, color: "var(--trv-navy)" }}>
            {editingId ? "Edit itinerary item" : "New itinerary item"}
          </h3>
          <div className="trv-grid trv-grid-2">
            <div className="trv-field">
              <label htmlFor="day">Day number</label>
              <input
                id="day"
                type="number"
                min="1"
                value={form.day}
                onChange={(e) => setForm((p) => ({ ...p, day: e.target.value }))}
                required
              />
            </div>
            <div className="trv-field">
              <label htmlFor="dayLabel">Day label</label>
              <input
                id="dayLabel"
                value={form.dayLabel}
                placeholder="Arrival"
                onChange={(e) => setForm((p) => ({ ...p, dayLabel: e.target.value }))}
              />
            </div>
            <div className="trv-field">
              <label htmlFor="time">Time</label>
              <input
                id="time"
                type="time"
                value={form.time}
                onChange={(e) => setForm((p) => ({ ...p, time: e.target.value }))}
              />
            </div>
            <div className="trv-field">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={form.category}
                onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              >
                {ITINERARY_CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="trv-field">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                value={form.title}
                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                required
              />
            </div>
            <div className="trv-field">
              <label htmlFor="location">Location</label>
              <input
                id="location"
                value={form.location}
                onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))}
              />
            </div>
            <div className="trv-field">
              <label htmlFor="price">Price</label>
              <input
                id="price"
                type="number"
                min="0"
                step="0.01"
                value={form.price}
                onChange={(e) => setForm((p) => ({ ...p, price: e.target.value }))}
              />
            </div>
            <div className="trv-field">
              <label htmlFor="bookingStatus">Booking status</label>
              <select
                id="bookingStatus"
                value={form.bookingStatus}
                onChange={(e) => setForm((p) => ({ ...p, bookingStatus: e.target.value }))}
              >
                <option value="planned">planned</option>
                <option value="confirmed">confirmed</option>
                <option value="cancelled">cancelled</option>
              </select>
            </div>
            <div className="trv-field" style={{ gridColumn: "1 / -1" }}>
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                rows={2}
                value={form.notes}
                onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
              />
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
            <button type="submit" className="trv-btn trv-btn-primary">
              Save
            </button>
            <button type="button" className="trv-btn trv-btn-secondary" onClick={() => setShowForm(false)}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="itin-page">
        <section>
          <h2 style={{ margin: "0 0 1rem", fontSize: "1.1rem", color: "#0d1b2a" }}>
            Day {selectedDay}
            {activeGroup?.dayLabel ? ` — ${activeGroup.dayLabel}` : ""}
          </h2>

          {items.length === 0 ? (
            <div className="trv-empty">
              <h3>Add your first itinerary item</h3>
              <p>No events for this day yet.</p>
              <button type="button" className="trv-btn trv-btn-primary" onClick={openCreate}>
                Add item
              </button>
            </div>
          ) : (
            <div className="itin-timeline">
              {items.map((item) => (
                <article key={item.id} className="itin-event">
                  <span className="itin-event-dot" aria-hidden="true">
                    <i className={`fas ${CATEGORY_ICON[item.category] || "fa-circle"}`} />
                  </span>
                  <div className="itin-event-top">
                    <div>
                      <div className="itin-event-time">{item.time || "--:--"}</div>
                      <h3>{item.title}</h3>
                      <p>
                        {[item.location, item.notes].filter(Boolean).join(" · ") ||
                          item.category}
                      </p>
                    </div>
                    <span
                      className={`dash-badge dash-badge--${
                        item.bookingStatus === "confirmed" ? "confirmed" : "planned"
                      }`}
                    >
                      {item.bookingStatus === "confirmed" ? "Confirmed" : "Suggested"}
                    </span>
                  </div>
                  <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.75rem" }}>
                    <button type="button" className="trv-btn trv-btn-secondary" onClick={() => openEdit(item)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className="trv-btn trv-btn-danger"
                      aria-label={`Remove ${item.title}`}
                      onClick={() => removeItineraryItem(activeTrip.id, item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <aside>
          <div className="itin-side-photo">
            <img src={resolveTripCover(activeTrip)} alt={activeTrip.destination} />
          </div>
          <div className="dash-panel itin-notes">
            <div className="dash-panel-head">
              <h2>Daily notes</h2>
            </div>
            <textarea
              aria-label={`Notes for day ${selectedDay}`}
              value={dailyNote}
              onChange={(e) => setDailyNote(e.target.value)}
              placeholder="Ideas, reminders, meeting points…"
            />
            <button
              type="button"
              className="trv-btn trv-btn-primary"
              style={{ marginTop: "0.75rem", width: "100%" }}
              onClick={saveDailyNote}
            >
              Save note
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
