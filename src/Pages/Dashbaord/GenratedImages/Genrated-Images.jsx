// components/GeneratedImages.jsx
import { useEffect, useState } from 'react';
import { FaDownload } from 'react-icons/fa';
import { useUser } from '../../../Context/userContext';
import toast from 'react-hot-toast';
import './style.css';

const GeneratedImages = () => {
  const { user } = useUser();
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState([]);
  const [downloadingIndexes, setDownloadingIndexes] = useState([]);
  const [imgLoadStatus, setImgLoadStatus] = useState({}); // Tracks image load

  useEffect(() => {
    setTimeout(() => {
      setImages(user?.generateImages || []);
      setLoading(false);
    }, 1000); // Simulate network loading
  }, [user]);

  const handleDownload = async (imageUrl, imageName, index) => {
    setDownloadingIndexes((prev) => [...prev, index]);

    const encodedUrl = encodeURIComponent(imageUrl);
    const apiUrl = `https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/downloadTattooImage?url=${encodedUrl}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error('Download failed');

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = imageName || `design-${index + 1}.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      toast.error(err.message || 'Download failed');
    } finally {
      setDownloadingIndexes((prev) => prev.filter((i) => i !== index));
    }
  };

  if (loading) {
    return (
      <div className="generated-wrapper">
        <h1 className="generated-title">Generated Designs</h1>
        <div className="generated-grid">
          {[...Array(6)].map((_, i) => (
            <div className="image-card skeleton" key={i}></div>
          ))}
        </div>
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="generated-wrapper">
        <h1 className="generated-title">Generated Designs</h1>
        <p className="no-images">No images found.</p>
      </div>
    );
  }

  return (
    <div className="generated-wrapper">
      <h1 className="generated-title">Generated Designs</h1>
      <div className="generated-grid">
        {images.map((img, index) => (
          <div className="image-card" key={img.id || index}>
            {!imgLoadStatus[index] && <div className="img-placeholder"></div>}
            <img
              src={img.url}
              alt={`Generated ${index + 1}`}
              className="image-content"
              onLoad={() =>
                setImgLoadStatus((prev) => ({ ...prev, [index]: true }))
              }
              onError={(e) => {
                e.target.style.display = 'none';
              }}
              style={{ display: imgLoadStatus[index] ? 'block' : 'none' }}
            />
            <button
              className="download-btn"
              onClick={() =>
                handleDownload(img.url, `design-${index + 1}.png`, index)
              }
              disabled={downloadingIndexes.includes(index)}
              title="Download"
            >
              {downloadingIndexes.includes(index) ? (
                <span className="loader"></span>
              ) : (
                <FaDownload />
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GeneratedImages;
