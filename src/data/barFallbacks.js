import barsFallbackImg from "../assets/bars.jpg";

const lisbonBars = [
  {
    id: "lisbon-bar-1",
    name: "Pensão Amor",
    description: "cocktail_bar",
    openingHours: "18:00 - 02:00",
  },
  {
    id: "lisbon-bar-2",
    name: "Park Bar",
    description: "rooftop",
    openingHours: "12:00 - 02:00",
  },
  {
    id: "lisbon-bar-3",
    name: "Red Frog Speakeasy",
    description: "cocktail_bar",
    openingHours: "18:00 - 02:00",
  },
  {
    id: "lisbon-bar-4",
    name: "Cerveteca Lisboa",
    description: "pub",
    openingHours: "16:00 - 00:00",
  },
];

const romeBars = [
  {
    id: "rome-bar-1",
    name: "Jerry Thomas Project",
    description: "cocktail_bar",
    openingHours: "22:00 - 04:00",
  },
  {
    id: "rome-bar-2",
    name: "Bar San Calisto",
    description: "pub",
    openingHours: "10:00 - 02:00",
  },
  {
    id: "rome-bar-3",
    name: "Freni e Frizioni",
    description: "aperitivo",
    openingHours: "18:00 - 02:00",
  },
  {
    id: "rome-bar-4",
    name: "Drink Kong",
    description: "cocktail_bar",
    openingHours: "18:00 - 02:00",
  },
];

export function barFallbacks(cityName) {
  const key = String(cityName || "").toLowerCase();
  const list = key.includes("lisbon") || key.includes("lisboa")
    ? lisbonBars
    : key.includes("rome") || key.includes("roma")
      ? romeBars
      : lisbonBars;

  return list.map((item) => ({
    ...item,
    image: barsFallbackImg,
    city: cityName || "Lisbon",
  }));
}
