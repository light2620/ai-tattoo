import { useEffect, useState } from 'react';
import { FaDownload } from 'react-icons/fa';
import Spinner from '../../../utils/Spinner/Spinner'; // Main page loading spinner
import { ProgressSpinner } from 'primereact/progressspinner'; // For individual download and image loading
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import './style.css'; // Your updated CSS

const GenratedImages = () => {
  const images = useSelector((state) => state.images.images);
  const loading = useSelector((state) => state.images.imagesLoading); // Overall loading for fetching image list
  const [downloadingIndexes, setDownloadingIndexes] = useState([]);
  const [imageLoadState, setImageLoadState] = useState({}); // Tracks { [index]: 'loading' | 'loaded' | 'error' }

  useEffect(() => {
    // Reset image load states when the images array changes or is populated
    if (images && images.length > 0) {
      const newLoadState = {};
      images.forEach((img, index) => {
        // If an image URL exists, mark it for loading.
        // If it was previously loaded, this will re-trigger 'loading' state,
        // which is fine if the image URL itself could have changed.
        if (img && img.url) {
          newLoadState[index] = 'loading';
        } else {
          // No URL or invalid img object, mark as error to show placeholder
          newLoadState[index] = 'error';
        }
      });
      setImageLoadState(newLoadState);
    } else {
      setImageLoadState({}); // Clear states if no images
    }
  }, [images]); // Dependency: images array from Redux

  const handleImageLoaded = (index) => {
    setImageLoadState((prev) => ({ ...prev, [index]: 'loaded' }));
  };

  const handleImageError = (index, imageUrl) => {
    console.warn(`Failed to load image: ${imageUrl} at index ${index}`);
    setImageLoadState((prev) => ({ ...prev, [index]: 'error' }));
    // Optionally, notify user about specific image failure, though a placeholder might be enough
    // toast.error(`Image ${index + 1} could not be displayed.`, { id: `img-err-${index}` });
  };

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

  // Main component loading state (for fetching the list of images)
  if (loading) {
    return (
      <div className="genrated-images-component-wrapper">
        <h1 className="page-title-generated">Generated Image</h1>
        <div className="images-wrapper">
          <Spinner />
        </div>
      </div>
    );
  }

  // No images available state
  if (!images || images.length === 0) {
    return (
      <div className="genrated-images-component-wrapper">
        <h1 className="page-title-generated">Generated Image</h1>
        <div className="images-wrapper">
          <p className="no-images-text">No designs available at the moment.</p>
        </div>
      </div>
    );
  }

  // Display images
  return (
    <div className="genrated-images-component-wrapper">
      <h1 className="page-title-generated">Generated Image</h1>
      <div className="images-container">
        {images.map((img, index) => {
          const currentImageState = imageLoadState[index] || 'loading'; // Default to 'loading' if state not yet set

          return (
            <div key={img.id || `gen-img-${index}`} className="image-card">
              {/* Individual Image Loading Placeholder */}
              {currentImageState === 'loading' && (
                <div className="image-status-overlay image-loading-placeholder">
                  <ProgressSpinner
                    style={{ width: '50px', height: '50px' }}
                    strokeWidth="5"
                    fill="transparent" // Spinner's own background
                    animationDuration="1s"
                  />
                </div>
              )}

              {/* Image Load Error Placeholder */}
              {currentImageState === 'error' && (
                <div className="image-status-overlay image-error-placeholder">
                  <span>Image unavailable</span>
                </div>
              )}

              {/* The Image itself */}
              {/* Render img tag only if we have a URL, to prevent errors with src="" */}
              {img && img.url && (
                <img
                  src={img.url}
                  alt={img.altText || `Generated Design ${index + 1}`}
                  className="image"
                  // Use visibility to maintain layout space while loading
                  style={{ visibility: currentImageState === 'loaded' ? 'visible' : 'hidden' }}
                  onLoad={() => handleImageLoaded(index)}
                  onError={() => handleImageError(index, img.url)}
                />
              )}
              
              {/* Download Actions - show if URL exists, regardless of load error (user might want to try download anyway) */}
              {img && img.url && (
                <div className="image-actions">
                  {downloadingIndexes.includes(index) ? (
                    <div className="loading-icon"> {/* For download spinner */}
                      <ProgressSpinner
                        style={{ width: '24px', height: '24px' }}
                        strokeWidth="7"
                        fill="transparent"
                        animationDuration=".7s"
                      />
                    </div>
                  ) : (
                    <button
                      className="action-btn"
                      onClick={() => handleDownload(img.url, `design-${index + 1}.png`, index)}
                      title="Download Design"
                      aria-label="Download Design"
                      // Optionally disable if image hasn't loaded: disabled={currentImageState !== 'loaded'}
                    >
                      <FaDownload />
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GenratedImages;