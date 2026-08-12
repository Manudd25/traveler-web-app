/* eslint-disable react/prop-types */
import { formatCurrencyExact } from "../../utils/tripHelpers";

export default function BudgetSummary({ total, spent, remaining, currency = "EUR" }) {
  const pct = total > 0 ? Math.min(100, Math.round((spent / total) * 100)) : 0;

  return (
    <div className="trv-card">
      <h3>Trip budget</h3>
      <div className="trv-metric">
        {formatCurrencyExact(spent, currency)}{" "}
        <span style={{ fontSize: "1rem", color: "var(--trv-muted)", fontWeight: 500 }}>
          / {formatCurrencyExact(total, currency)}
        </span>
      </div>
      <div className="trv-progress" style={{ margin: "0.85rem 0" }}>
        <span style={{ width: `${pct}%` }} />
      </div>
      <p className="trv-sub">
        Remaining:{" "}
        <strong style={{ color: remaining >= 0 ? "var(--trv-success)" : "var(--trv-danger)" }}>
          {formatCurrencyExact(remaining, currency)}
        </strong>
      </p>
    </div>
  );
}
