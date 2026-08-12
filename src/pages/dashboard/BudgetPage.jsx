import { useState } from "react";
import { useTrip } from "../../contexts/TripContext";
import BudgetSummary from "../../components/budget/BudgetSummary";
import ExpenseItem from "../../components/budget/ExpenseItem";
import { EXPENSE_CATEGORIES } from "../../data/constants";
import {
  expensesByCategory,
  formatCurrencyExact,
  getBudgetSummary,
} from "../../utils/tripHelpers";

export default function BudgetPage() {
  const { activeTrip, addExpense, removeExpense, updateTrip } = useTrip();
  const [form, setForm] = useState({
    title: "",
    category: "food",
    amount: "",
    date: new Date().toISOString().slice(0, 10),
  });

  if (!activeTrip) {
    return (
      <div className="trv-empty">
        <h3>No trip selected</h3>
        <p>Budget tracking is per trip.</p>
      </div>
    );
  }

  const budget = getBudgetSummary(activeTrip);
  const byCategory = expensesByCategory(activeTrip.expenses);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.amount) return;
    addExpense(activeTrip.id, {
      title: form.title,
      category: form.category,
      amount: Number(form.amount),
      date: form.date,
    });
    setForm((p) => ({ ...p, title: "", amount: "" }));
  };

  return (
    <div>
      <div className="trv-page-header">
        <div>
          <h1>Budget</h1>
          <p>Track spending for {activeTrip.destination}.</p>
        </div>
      </div>

      <div className="trv-grid trv-grid-2" style={{ marginBottom: "1.25rem" }}>
        <BudgetSummary {...budget} />
        <div className="trv-card">
          <h3>Total trip budget</h3>
          <div className="trv-field" style={{ marginTop: "0.75rem" }}>
            <label htmlFor="budgetTotal">Update budget ceiling</label>
            <input
              id="budgetTotal"
              type="number"
              min="0"
              value={activeTrip.budgetTotal}
              onChange={(e) =>
                updateTrip(activeTrip.id, { budgetTotal: Number(e.target.value) || 0 })
              }
            />
          </div>
          <div style={{ marginTop: "1rem" }}>
            {EXPENSE_CATEGORIES.map((cat) => (
              <div
                key={cat}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "0.35rem 0",
                  borderBottom: "1px solid var(--trv-border)",
                  fontSize: "0.9rem",
                }}
              >
                <span style={{ textTransform: "capitalize" }}>{cat}</span>
                <strong>{formatCurrencyExact(byCategory[cat] || 0, budget.currency)}</strong>
              </div>
            ))}
          </div>
        </div>
      </div>

      <form className="trv-card" style={{ marginBottom: "1.25rem" }} onSubmit={handleSubmit}>
        <h3 style={{ marginTop: 0, color: "var(--trv-navy)" }}>Add expense</h3>
        <div className="trv-grid trv-grid-2">
          <div className="trv-field">
            <label htmlFor="exp-title">Title</label>
            <input
              id="exp-title"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              required
            />
          </div>
          <div className="trv-field">
            <label htmlFor="exp-cat">Category</label>
            <select
              id="exp-cat"
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
            >
              {EXPENSE_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="trv-field">
            <label htmlFor="exp-amount">Amount</label>
            <input
              id="exp-amount"
              type="number"
              min="0"
              step="0.01"
              value={form.amount}
              onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
              required
            />
          </div>
          <div className="trv-field">
            <label htmlFor="exp-date">Date</label>
            <input
              id="exp-date"
              type="date"
              value={form.date}
              onChange={(e) => setForm((p) => ({ ...p, date: e.target.value }))}
            />
          </div>
        </div>
        <button type="submit" className="trv-btn trv-btn-primary" style={{ marginTop: "0.85rem" }}>
          Add expense
        </button>
      </form>

      {(activeTrip.expenses || []).length === 0 ? (
        <div className="trv-empty">
          <h3>No expenses recorded</h3>
          <p>Add spending manually, or confirm a booking to log one automatically.</p>
        </div>
      ) : (
        <div className="trv-list">
          {activeTrip.expenses.map((expense) => (
            <ExpenseItem
              key={expense.id}
              expense={expense}
              currency={budget.currency}
              onDelete={(id) => removeExpense(activeTrip.id, id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
