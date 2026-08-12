import { useState } from "react";
import { useTrip } from "../../contexts/TripContext";
import { DOCUMENT_TYPES } from "../../data/constants";

export default function DocumentsPage() {
  const { activeTrip, addDocument, removeDocument, updateTrip } = useTrip();
  const [form, setForm] = useState({
    title: "",
    type: DOCUMENT_TYPES[0],
    status: "pending",
    notes: "",
  });

  if (!activeTrip) {
    return (
      <div className="trv-empty">
        <h3>No trip selected</h3>
        <p>Documents are stored with your trip data (UI only — no file upload).</p>
      </div>
    );
  }

  const docs = activeTrip.documents || [];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    addDocument(activeTrip.id, form);
    setForm({ title: "", type: DOCUMENT_TYPES[0], status: "pending", notes: "" });
  };

  const setStatus = (docId, status) => {
    updateTrip(activeTrip.id, (trip) => ({
      ...trip,
      documents: trip.documents.map((d) => (d.id === docId ? { ...d, status } : d)),
    }));
  };

  return (
    <div>
      <div className="trv-page-header">
        <div>
          <h1>Documents</h1>
          <p>Keep track of confirmations and travel papers for {activeTrip.destination}.</p>
        </div>
      </div>

      <form className="trv-card" style={{ marginBottom: "1.25rem" }} onSubmit={handleSubmit}>
        <h3 style={{ marginTop: 0, color: "var(--trv-navy)" }}>Add document record</h3>
        <div className="trv-grid trv-grid-2">
          <div className="trv-field">
            <label htmlFor="doc-title">Title</label>
            <input
              id="doc-title"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              required
            />
          </div>
          <div className="trv-field">
            <label htmlFor="doc-type">Type</label>
            <select
              id="doc-type"
              value={form.type}
              onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
            >
              {DOCUMENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="trv-field" style={{ gridColumn: "1 / -1" }}>
            <label htmlFor="doc-notes">Notes</label>
            <input
              id="doc-notes"
              value={form.notes}
              onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
              placeholder="Confirmation number, where stored…"
            />
          </div>
        </div>
        <button type="submit" className="trv-btn trv-btn-primary" style={{ marginTop: "0.85rem" }}>
          Add document
        </button>
      </form>

      {docs.length === 0 ? (
        <div className="trv-empty">
          <h3>No documents yet</h3>
          <p>Add flight confirmations, hotel reservations, insurance, and tickets.</p>
        </div>
      ) : (
        <div className="trv-list">
          {docs.map((doc) => (
            <article key={doc.id} className="trv-list-item">
              <div>
                <span className="trv-chip">{doc.type}</span>
                <h3 style={{ margin: "0.35rem 0 0", color: "var(--trv-navy)" }}>{doc.title}</h3>
                {doc.notes && (
                  <p style={{ margin: "0.3rem 0 0", color: "var(--trv-muted)", fontSize: "0.85rem" }}>
                    {doc.notes}
                  </p>
                )}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <select
                  value={doc.status}
                  aria-label={`Status for ${doc.title}`}
                  onChange={(e) => setStatus(doc.id, e.target.value)}
                  style={{
                    border: "1px solid var(--trv-border)",
                    borderRadius: "var(--trv-radius-sm)",
                    padding: "0.4rem 0.5rem",
                  }}
                >
                  <option value="pending">pending</option>
                  <option value="ready">ready</option>
                  <option value="archived">archived</option>
                </select>
                <button
                  type="button"
                  className="trv-btn trv-btn-danger"
                  aria-label={`Remove ${doc.title}`}
                  onClick={() => removeDocument(activeTrip.id, doc.id)}
                >
                  <i className="fas fa-trash" aria-hidden="true" />
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
