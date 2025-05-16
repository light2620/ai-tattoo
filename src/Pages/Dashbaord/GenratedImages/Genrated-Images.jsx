import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FiDownload } from 'react-icons/fi';
import './style.css';

const GenratedImages = () => {
  const [images, setImages] = useState([]);
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    setImages(user?.user?.generateImages || []);
    console.log(images);
  }, [user]);

  const handleDownload = (url) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = 'image.jpg';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="images-container">
      {images.length === 0 ? (
        <p className="no-images-text">No images available</p>
      ) : (
        images.map((img, index) => (
          <div key={index} className="image-card">
            <img src={img.url} alt={`Generated ${index}`} className="image" />
            <button className="download-btn" onClick={() => handleDownload(img)}>
              <FiDownload />
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default GenratedImages;
