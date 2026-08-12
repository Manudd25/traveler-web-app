import restaurantFallbackImg from "../assets/restaurant.jpg";

const lisbonRestaurants = [
  {
    id: "lisbon-rest-1",
    name: "Time Out Market Lisboa",
    description: "food_court",
    openingHours: "10:00 - 00:00",
  },
  {
    id: "lisbon-rest-2",
    name: "Cervejaria Ramiro",
    description: "seafood",
    openingHours: "12:00 - 00:30",
  },
  {
    id: "lisbon-rest-3",
    name: "A Cevicheria",
    description: "peruvian;seafood",
    openingHours: "12:00 - 00:00",
  },
  {
    id: "lisbon-rest-4",
    name: "Taberna da Rua das Flores",
    description: "portuguese",
    openingHours: "12:00 - 23:00",
  },
  {
    id: "lisbon-rest-5",
    name: "Prado",
    description: "portuguese;farm_to_table",
    openingHours: "19:00 - 23:00",
  },
  {
    id: "lisbon-rest-6",
    name: "Belcanto",
    description: "fine_dining",
    openingHours: "12:30 - 23:00",
  },
];

const romeRestaurants = [
  {
    id: "rome-rest-1",
    name: "Trattoria Da Enzo al 29",
    description: "italian;trattoria",
    openingHours: "12:00 - 23:00",
  },
  {
    id: "rome-rest-2",
    name: "Roscioli",
    description: "italian;deli",
    openingHours: "12:00 - 23:30",
  },
  {
    id: "rome-rest-3",
    name: "Pizzarium Bonci",
    description: "pizza",
    openingHours: "11:00 - 22:00",
  },
  {
    id: "rome-rest-4",
    name: "Armando al Pantheon",
    description: "roman",
    openingHours: "12:30 - 22:30",
  },
  {
    id: "rome-rest-5",
    name: "Da Felice a Testaccio",
    description: "roman;trattoria",
    openingHours: "12:00 - 23:00",
  },
  {
    id: "rome-rest-6",
    name: "Salumeria Roscioli",
    description: "italian;wine_bar",
    openingHours: "12:00 - 00:00",
  },
];

export function restaurantFallbacks(cityName) {
  const key = String(cityName || "").toLowerCase();
  const list = key.includes("lisbon") || key.includes("lisboa")
    ? lisbonRestaurants
    : key.includes("rome") || key.includes("roma")
      ? romeRestaurants
      : lisbonRestaurants;

  return list.map((item) => ({
    ...item,
    image: restaurantFallbackImg,
    city: cityName || "Lisbon",
  }));
}
