import { useFavorite } from "../contexts/FavoriteContext";
import { jsPDF } from "jspdf";

const Favorites = () => {
  const { favorites, toggleFavorite } = useFavorite();

  const exportFavoritesAsPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("Your Favorite Places", 10, 10);

    favorites.forEach((fav, index) => {
      const positionY = 20 + index * 30;
      doc.setFontSize(14);
      doc.text(`Name: ${fav.name}`, 10, positionY);
      doc.text(`Type: ${fav.type || "Unknown Type"}`, 10, positionY + 7);
      doc.text(
        `Opening Hours: ${fav.openingHours || "Hours not available"}`,
        10,
        positionY + 14
      );
    });

    doc.save("Favorites.pdf");
  };

  return (
    <div>
      <div className="trv-page-header">
        <div>
          <h1>Favorites</h1>
          <p>Places you saved for your trip</p>
        </div>
        {favorites.length > 0 && (
          <button type="button" className="trv-btn trv-btn-primary" onClick={exportFavoritesAsPDF}>
            Export Favorites as PDF
          </button>
        )}
      </div>

      {favorites.length === 0 ? (
        <div className="trv-empty">
          <h3>No favorites</h3>
          <p>No favorites added yet.</p>
        </div>
      ) : (
        <div className="trv-venue-grid">
          {favorites.map((fav) => (
            <article key={fav.id} className="trv-venue-card">
              <button type="button" className="trv-fav" onClick={() => toggleFavorite(fav)} aria-label="Toggle favorite">
                ❤️
              </button>
              <img src={fav.image} alt={fav.name} className="trv-venue-image" loading="lazy" decoding="async" />
              <div className="trv-venue-body">
                <h3>{fav.name}</h3>
                <p className="trv-venue-meta">
                  <strong>Added to my favorites</strong>
                </p>
                <p className="trv-venue-meta">{fav.openingHours || "Hours not available"}</p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
