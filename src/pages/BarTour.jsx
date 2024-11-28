/* eslint-disable no-unused-vars */
import "../styles/virtualTour.css";
import { useParams } from "react-router-dom";

const BarTour = () => {
  const { barId } = useParams();

  // Example image URLs (replace with actual paths to your images)
  const images = [
    "https://cdn.pixabay.com/photo/2017/08/06/20/01/dark-2595778_640.jpg", 
    "https://cdn.pixabay.com/photo/2019/06/13/11/28/cocktail-4271392_640.jpg", 
    "https://cdn.pixabay.com/photo/2015/03/25/02/35/cafe-688442_640.jpg", 
    "https://cdn.pixabay.com/photo/2017/08/07/07/06/interior-2600879_640.jpg", 
    "https://cdn.pixabay.com/photo/2015/09/05/00/47/bar-923632_640.jpg", 
    "https://cdn.pixabay.com/photo/2017/06/19/12/16/candy-2419138_640.jpg", 
    "https://cdn.pixabay.com/photo/2015/03/30/12/49/stools-698681_640.jpg", 
    "https://cdn.pixabay.com/photo/2015/07/23/19/23/cocktail-857393_640.jpg",
    "https://cdn.pixabay.com/photo/2015/07/20/14/00/bar-852843_640.jpg", 
  ];

  return (
    <div className="photo-album-container">
      <h2>Explore the Bar</h2>
      <p>Take a look at some stunning photos of this bar&apos;s ambiance and interiors:</p>
      <div className="photo-album">
        {images.map((image, index) => (
          <div key={index} className="photo-card">
            <img src={image} alt={`Bar View ${index + 1}`} className="photo" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BarTour;
