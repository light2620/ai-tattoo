import { useEffect, useState } from 'react';
import { FiDownload } from 'react-icons/fi';
import Spinner from '../../../utils/Spinner/Spinner';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useSelector } from 'react-redux';
import './style.css';

const GenratedImages = () => {
  const images = useSelector((state) => state.images.images);
  const loading = useSelector((state) => state.images.imagesLoading);

  const [downloadingIndexes, setDownloadingIndexes] = useState([]); // <-- Array for multiple loaders

  useEffect(() => {}, [images]);

  const handleDownload = async (imageUrl, imageName, index) => {
    setDownloadingIndexes((prev) => [...prev, index]); // Add index to array

    const encodedUrl = encodeURIComponent(imageUrl);
    const apiUrl = `https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/downloadTattooImage?url=${encodedUrl}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`Failed to fetch: ${response.status}`);

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = imageName || 'tattoo.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Error downloading image:", err);
      alert("Download failed. Check console for details.");
    } finally {
      // Remove index from downloading array
      setDownloadingIndexes((prev) => prev.filter((i) => i !== index));
    }
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
            {downloadingIndexes.includes(index) ? (
              <div className="loading-icon">
                <ProgressSpinner
                style={{ width: '25px', height: '25px' }}
                strokeWidth="8"
                animationDuration=".5s"
              />
              </div>
              
            ) : (
              <button
                className="action-btn download-btn"
                onClick={() => handleDownload(img.url, `tattoo-design-${index + 1}.png`, index)}
                title="Download Image"
              >
                <FiDownload />
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default GenratedImages;
