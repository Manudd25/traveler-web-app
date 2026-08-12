/* eslint-disable react/prop-types */
export default function TravelChecklist({
  items = [],
  readiness = 0,
  onToggle,
  onAdd,
  onRemove,
}) {
  const completed = items.filter((i) => i.completed);
  const pending = items.filter((i) => !i.completed);

  return (
    <div>
      <div className="trv-card" style={{ marginBottom: "1rem" }}>
        <h3>Trip readiness</h3>
        <div className="trv-metric">{readiness}%</div>
        <div className="trv-progress" style={{ marginTop: "0.75rem" }}>
          <span style={{ width: `${readiness}%` }} />
        </div>
        <p className="trv-sub">
          {completed.length} of {items.length} tasks complete
        </p>
      </div>

      {typeof onAdd === "function" && (
        <form
          className="trv-card"
          style={{ marginBottom: "1rem", display: "flex", gap: "0.5rem" }}
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const label = String(fd.get("label") || "").trim();
            if (label) {
              onAdd(label);
              e.currentTarget.reset();
            }
          }}
        >
          <input
            name="label"
            placeholder="Add checklist item"
            aria-label="New checklist item"
            style={{
              flex: 1,
              border: "1px solid var(--trv-border)",
              borderRadius: "var(--trv-radius-sm)",
              padding: "0.55rem 0.7rem",
            }}
          />
          <button type="submit" className="trv-btn trv-btn-primary">
            Add
          </button>
        </form>
      )}

      <div className="trv-grid trv-grid-2">
        <section>
          <h3 style={{ color: "var(--trv-navy)", marginTop: 0 }}>Completed</h3>
          {completed.length === 0 ? (
            <div className="trv-empty">
              <p>No completed tasks yet.</p>
            </div>
          ) : (
            <div className="trv-list">
              {completed.map((item) => (
                <div key={item.id} className="trv-check-row done">
                  <input
                    type="checkbox"
                    id={item.id}
                    checked
                    onChange={() => onToggle(item.id)}
                  />
                  <label htmlFor={item.id}>{item.label}</label>
                  {onRemove && (
                    <button
                      type="button"
                      className="trv-btn trv-btn-ghost"
                      aria-label={`Remove ${item.label}`}
                      onClick={() => onRemove(item.id)}
                    >
                      <i className="fas fa-times" aria-hidden="true" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section>
          <h3 style={{ color: "var(--trv-navy)", marginTop: 0 }}>Pending</h3>
          {pending.length === 0 ? (
            <div className="trv-empty">
              <h3>Your trip is ready to start</h3>
              <p>All preparation tasks are complete.</p>
            </div>
          ) : (
            <div className="trv-list">
              {pending.map((item) => (
                <div key={item.id} className="trv-check-row">
                  <input
                    type="checkbox"
                    id={item.id}
                    checked={false}
                    onChange={() => onToggle(item.id)}
                  />
                  <label htmlFor={item.id}>{item.label}</label>
                  {onRemove && (
                    <button
                      type="button"
                      className="trv-btn trv-btn-ghost"
                      aria-label={`Remove ${item.label}`}
                      onClick={() => onRemove(item.id)}
                    >
                      <i className="fas fa-times" aria-hidden="true" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
