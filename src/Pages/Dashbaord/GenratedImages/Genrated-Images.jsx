import React, { useEffect, useState } from 'react';
import { FiDownload } from 'react-icons/fi';
import Spinner from '../../../utils/Spinner/Spinner';
import './style.css';
import { useSelector } from 'react-redux';
const GenratedImages = () => {

   const images = useSelector((state) => state.images.images);
   const loading = useSelector((state) => state.images.imagesLoading);
   useEffect(() => {},[images]);
  if (loading) {
    return (
      <div className="images-wrapper">
        <Spinner />
      </div>
    );
  }

  // If not loading and no images
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
        <div key={index} className="image-card">
          <img src={img.url} alt={`Generated ${index}`} className="image" />
          <button className="download-btn">
            <FiDownload />
          </button>
        </div>
      ))}
    </div>
  );
};

export default GenratedImages;
