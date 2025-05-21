import React, { useEffect } from 'react'; // Removed useState as it's not used
import { FiDownload, FiEye } from 'react-icons/fi'; // Added FiEye
import Spinner from '../../../utils/Spinner/Spinner';
import './style.css';
import { useSelector } from 'react-redux';

const GenratedImages = () => {
  const images = useSelector((state) => state.images.images);
  const loading = useSelector((state) => state.images.imagesLoading);
  useEffect(() => {

  }, [images]);

const handleDownload = (imageUrl, imageName) => {
  const link = document.createElement('a');
  link.href = imageUrl;
  link.setAttribute('download', imageName || 'generated-image.png');
  link.setAttribute('target', '_blank'); 
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

  if (loading) {
    return (
      <div className="images-wrapper">
        <Spinner />
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="images-wrapper">
        <p className="no-images-text">No images available</p>
      </div>
    );
  }

  return (
    <div className="images-container">
      {images.map((img, index) => (
        <div key={img.id || index} className="image-card">
          <img src={img.url} alt={`Generated ${index + 1}`} className="image" />
          <div className="image-actions">
            <button
              className="action-btn download-btn"
              onClick={() => handleDownload(img.url, `tattoo-design-${index + 1}.png`)}
              title="Download Image"
            >
              <FiDownload />
            </button>

          </div>
        </div>
      ))}
    </div>
  );
};

export default GenratedImages;