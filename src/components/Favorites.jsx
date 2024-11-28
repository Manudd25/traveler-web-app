import { useFavorite } from "../contexts/FavoriteContext";
import { jsPDF } from "jspdf"; // Import jsPDF
import "../styles/Favorites.css";

const Favorites = () => {
  const { favorites, toggleFavorite } = useFavorite(); // Access favorites and toggleFavorite

  // Function to export favorites as a PDF
  const exportFavoritesAsPDF = () => {
    const doc = new jsPDF();

    // Add title
    doc.setFontSize(18);
    doc.text("Your Favorite Places", 10, 10);

    // Add each favorite item to the PDF
    favorites.forEach((fav, index) => {
      const positionY = 20 + index * 30; // Position each favorite 30 units apart
      doc.setFontSize(14);
      doc.text(`Name: ${fav.name}`, 10, positionY);
      doc.text(`Type: ${fav.type || "Unknown Type"}`, 10, positionY + 7); // Default to "Unknown Type"
      doc.text(
        `Opening Hours: ${fav.openingHours || "Hours not available"}`, // Default opening hours
        10,
        positionY + 14
      );
    });

    // Save the PDF
    doc.save("Favorites.pdf");
  };

  return (
    <div className="favorites-container">
      <h2>Your Favorites</h2>
      {favorites.length === 0 ? (
        <p>No favorites added yet.</p>
      ) : (
        <>
      
          <div className="favorites-list">
            {favorites.map((fav) => (
              <div key={fav.id} className="favorite-card">
                <div
                  className="favorite-icon"
                  onClick={() => toggleFavorite(fav)} // Toggle favorite
                >
                  ❤️
                </div>
                <img src={fav.image} alt={fav.name} className="favorite-image" />
                <div className="favorite-info">
                  <h3>{fav.name}</h3>
                  <p>
                    <strong>Added to my favorites</strong>
                  </p>
                  <p>{fav.openingHours || "Hours not available"}</p>
                </div>
              </div>
              
            ))}
          </div>
          <button className="export-btn" onClick={exportFavoritesAsPDF}>
            Export Favorites as PDF
          </button>
        </>
      )}
    </div>
  );
};

export default Favorites;
