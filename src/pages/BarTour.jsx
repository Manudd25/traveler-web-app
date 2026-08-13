import "../styles/virtualTour.css";

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

const BarTour = () => {
  return (
    <div>
      <div className="trv-page-header">
        <div>
          <h1>Explore the Bar</h1>
          <p>Ambiance and interiors for this venue.</p>
        </div>
      </div>
      <div className="photo-album">
        {images.map((image, index) => (
          <img key={image} src={image} alt={`Bar view ${index + 1}`} className="photo" loading="lazy" decoding="async" />
        ))}
      </div>
    </div>
  );
};

export default BarTour;
