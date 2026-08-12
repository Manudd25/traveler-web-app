export const parseDate = (value) => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
};

export const formatDateRange = (startDate, endDate) => {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  if (!start || !end) return "Dates TBD";

  const opts = { day: "numeric", month: "long" };
  const startStr = start.toLocaleDateString("en-GB", opts);
  const endStr = end.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  return `${startStr} – ${endStr}`;
};

export const tripDurationDays = (startDate, endDate) => {
  const start = parseDate(startDate);
  const end = parseDate(endDate);
  if (!start || !end) return 0;
  const ms = end.setHours(12, 0, 0, 0) - start.setHours(12, 0, 0, 0);
  return Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)) + 1);
};

export const daysUntilTrip = (startDate) => {
  const start = parseDate(startDate);
  if (!start) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(start);
  target.setHours(0, 0, 0, 0);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
};

export const getTripStatus = (trip, today = new Date()) => {
  const start = parseDate(trip.startDate);
  const end = parseDate(trip.endDate);
  if (!start || !end) return "upcoming";
  const t = new Date(today);
  t.setHours(12, 0, 0, 0);
  const s = new Date(start);
  s.setHours(0, 0, 0, 0);
  const e = new Date(end);
  e.setHours(23, 59, 59, 999);
  if (t < s) return "upcoming";
  if (t > e) return "past";
  return "current";
};

export const getReadiness = (checklist = []) => {
  if (!checklist.length) return 0;
  const done = checklist.filter((item) => item.completed).length;
  return Math.round((done / checklist.length) * 100);
};

export const getBudgetSummary = (trip) => {
  const total = Number(trip.budgetTotal) || 0;
  const spent = (trip.expenses || []).reduce(
    (sum, e) => sum + (Number(e.amount) || 0),
    0
  );
  return {
    total,
    spent,
    remaining: total - spent,
    currency: trip.currency || "EUR",
  };
};

export const groupItineraryByDay = (itinerary = []) => {
  const groups = {};
  itinerary.forEach((item) => {
    const day = item.day || 1;
    if (!groups[day]) {
      groups[day] = {
        day,
        dayLabel: item.dayLabel || `Day ${day}`,
        items: [],
      };
    }
    groups[day].items.push(item);
  });

  return Object.values(groups)
    .map((g) => ({
      ...g,
      items: [...g.items].sort((a, b) => (a.time || "").localeCompare(b.time || "")),
    }))
    .sort((a, b) => a.day - b.day);
};

export const formatCurrency = (amount, currency = "EUR") => {
  try {
    return new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  } catch {
    return `€${Number(amount || 0).toFixed(0)}`;
  }
};

export const formatCurrencyExact = (amount, currency = "EUR") => {
  try {
    return new Intl.NumberFormat("en-IE", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount || 0);
  } catch {
    return `€${Number(amount || 0).toFixed(2)}`;
  }
};

export const expensesByCategory = (expenses = []) => {
  const map = {};
  expenses.forEach((e) => {
    const key = e.category || "other";
    map[key] = (map[key] || 0) + (Number(e.amount) || 0);
  });
  return map;
};

/** Infer itinerary day number from booking date relative to trip start */
export const dayNumberFromDate = (tripStartDate, bookingDate) => {
  const start = parseDate(tripStartDate);
  const date = parseDate(bookingDate);
  if (!start || !date) return 1;
  const diff = Math.round(
    (date.setHours(12, 0, 0, 0) - start.setHours(12, 0, 0, 0)) /
      (1000 * 60 * 60 * 24)
  );
  return Math.max(1, diff + 1);
};
