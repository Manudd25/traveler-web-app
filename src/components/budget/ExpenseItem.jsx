/* eslint-disable react/prop-types */
import { formatCurrencyExact } from "../../utils/tripHelpers";

export default function ExpenseItem({ expense, currency = "EUR", onDelete }) {
  return (
    <div className="trv-list-item">
      <div>
        <span className="trv-chip" style={{ marginBottom: "0.35rem" }}>
          {expense.category}
        </span>
        <h3 style={{ margin: 0, color: "var(--trv-navy)", fontSize: "0.95rem" }}>{expense.title}</h3>
        <p style={{ margin: "0.25rem 0 0", color: "var(--trv-muted)", fontSize: "0.8rem" }}>
          {expense.date}
        </p>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <strong>{formatCurrencyExact(expense.amount, currency)}</strong>
        {onDelete && (
          <button
            type="button"
            className="trv-btn trv-btn-danger"
            aria-label={`Delete expense ${expense.title}`}
            onClick={() => onDelete(expense.id)}
          >
            <i className="fas fa-trash" aria-hidden="true" />
          </button>
        )}
      </div>
    </div>
  );
}
