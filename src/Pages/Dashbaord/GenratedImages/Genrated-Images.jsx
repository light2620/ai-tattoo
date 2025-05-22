import { useEffect, useState } from 'react';
import { FaDownload } from 'react-icons/fa';
import Spinner from '../../../utils/Spinner/Spinner'; // Main page loading spinner
import { ProgressSpinner } from 'primereact/progressspinner'; // For individual download
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import './style.css'; // Your updated CSS

const GenratedImages = () => {
  const images = useSelector((state) => state.images.images);
  const loading = useSelector((state) => state.images.imagesLoading);
  const [downloadingIndexes, setDownloadingIndexes] = useState([]);

  useEffect(() => {
    // Side effects on image changes if any
  }, [images]);

  const handleDownload = async (imageUrl, imageName, index) => {
    setDownloadingIndexes((prev) => [...prev, index]);

    const encodedUrl = encodeURIComponent(imageUrl);
    const apiUrl = `https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/downloadTattooImage?url=${encodedUrl}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) {
        const errorText = await response.text().catch(() => "Server error details unavailable.");
        throw new Error(`Download request failed: ${response.status} ${response.statusText}. ${errorText}`);
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = imageName || 'design.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Error downloading image:", err);
      toast.error(err.message || "Download failed. Please try again.");
    } finally {
      setDownloadingIndexes((prev) => prev.filter((i) => i !== index));
    }
  };

  // Main component loading state
  if (loading) {
    return (
      <div className="genrated-images-component-wrapper"> {/* Use new wrapper */}
        <h1 className="page-title-generated">Generated Image</h1>
        <div className="images-wrapper"> {/* Centering for spinner */}
          <Spinner />
        </div>
      </div>
    );
  }

  // No images state
  if (!images || images.length === 0) {
    return (
      <div className="genrated-images-component-wrapper"> {/* Use new wrapper */}
        <h1 className="page-title-generated">Generated Image</h1>
        <div className="images-wrapper"> {/* Centering for text */}
          <p className="no-images-text">No designs available at the moment.</p>
        </div>
      </div>
    );
  }

  // Display images
  return (
    <div className="genrated-images-component-wrapper"> {/* New top-level wrapper */}
      <h1 className="page-title-generated">Generated Image</h1>
      <div className="images-container">
        {images.map((img, index) => (
          <div key={img.id || `gen-img-${index}`} className="image-card">
            <img
              src={img.url}
              alt={img.altText || `Generated Design ${index + 1}`}
              className="image" // Ensure this class is on the <img> tag
              onError={(e) => {
                e.target.onerror = null;
                // Optionally set a placeholder: e.target.src="path/to/placeholder.png";
                console.warn(`Failed to load image: ${img.url}`);
              }}
            />
            <div className="image-actions">
              {downloadingIndexes.includes(index) ? (
                <div className="loading-icon">
                  <ProgressSpinner
                    style={{ width: '24px', height: '24px' }}
                    strokeWidth="7" // A bit thicker for visibility
                    fill="transparent" // Spinner's own background
                    animationDuration=".7s"
                    // Color of the spinner path is typically controlled by PrimeReact theme
                    // or can be overridden with more specific CSS targeting p-progress-spinner-circle
                  />
                </div>
              ) : (
                <button
                  className="action-btn"
                  onClick={() => handleDownload(img.url, `design-${index + 1}.png`, index)}
                  title="Download Design"
                  aria-label="Download Design"
                >
                  <FaDownload />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GenratedImages;