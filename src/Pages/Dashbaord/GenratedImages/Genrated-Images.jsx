// src/Pages/Dashbaord/GenratedImages/Genrated-Images.jsx (or your path)
import { useEffect, useState, useMemo } from 'react'; // Added useMemo
import { FaDownload } from 'react-icons/fa';
import Spinner from '../../../utils/Spinner/Spinner';
import { ProgressSpinner } from 'primereact/progressspinner';
import { useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import './style.css';

const GenratedImages = () => {
  const originalImages = useSelector((state) => state.images.images);
  const loading = useSelector((state) => state.images.imagesLoading);
  const [downloadingIndexes, setDownloadingIndexes] = useState([]); // This will refer to original indexes
  const [imageLoadState, setImageLoadState] = useState({});

  // Memoize the reversed array to prevent re-reversals on every render
  // unless originalImages itself changes.
  const reversedImages = useMemo(() => {
    if (!originalImages) return [];
    return [...originalImages].reverse(); // Create a new reversed array
  }, [originalImages]);

  useEffect(() => {
    if (originalImages && originalImages.length > 0) {
      const newLoadState = {};
      // We iterate over originalImages to map original indexes to load states
      originalImages.forEach((img, originalIndex) => {
        if (img && img.url) {
          newLoadState[originalIndex] = 'loading';
        } else {
          newLoadState[originalIndex] = 'error';
        }
      });
      setImageLoadState(newLoadState);
    } else {
      setImageLoadState({});
    }
  }, [originalImages]); // Still depends on originalImages for consistency

  // Handler functions now need to work with ORIGINAL indexes because that's what
  // imageLoadState and downloadingIndexes are based on.
  const handleImageLoaded = (originalIndex) => {
    setImageLoadState((prev) => ({ ...prev, [originalIndex]: 'loaded' }));
  };

  const handleImageError = (originalIndex, imageUrl) => {
    console.warn(`Failed to load image: ${imageUrl} at original index ${originalIndex}`);
    setImageLoadState((prev) => ({ ...prev, [originalIndex]: 'error' }));
  };

  const handleDownload = async (imageUrl, imageName, originalIndex) => {
    setDownloadingIndexes((prev) => [...prev, originalIndex]);
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
      setDownloadingIndexes((prev) => prev.filter((i) => i !== originalIndex));
    }
  };

  if (loading) {
    return (
      <div className="genrated-images-component-wrapper">
        <h1 className="page-title-generated">Generated Images</h1> {/* Pluralized title */}
        <div className="images-wrapper loading-state"> {/* Added class for styling */}
          <Spinner />
        </div>
      </div>
    );
  }

  if (!originalImages || originalImages.length === 0) {
    return (
      <div className="genrated-images-component-wrapper">
        <h1 className="page-title-generated">Generated Images</h1>
        <div className="images-wrapper no-images-state"> {/* Added class for styling */}
          <p className="no-images-text">No designs available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="genrated-images-component-wrapper">
      <h1 className="page-title-generated">Generated Images</h1>
      <div className="images-container">
        {/* Map over the reversedImages array */}
        {reversedImages.map((img, reversedIndex) => {
          // IMPORTANT: We need to find the ORIGINAL index of this image
          // to correctly access imageLoadState and downloadingIndexes.
          // If `img.id` is unique and stable, that's the best way.
          // If not, we can calculate it, assuming `img` objects are stable references.
          // The most robust way if IDs are not perfectly reliable for this mapping is to
          // map based on the object reference or calculate from lengths.

          // Calculate originalIndex based on the reversedIndex
          // originalImages.length = 5, reversedImages.length = 5
          // reversedIndex = 0 (last original) -> originalIndex = 4
          // reversedIndex = 1 (second to last original) -> originalIndex = 3
          // ...
          // reversedIndex = 4 (first original) -> originalIndex = 0
          const originalIndex = originalImages.length - 1 - reversedIndex;

          // Fallback: If img.id is unique and available on all image objects
          // const originalIndex = originalImages.findIndex(originalImg => originalImg.id === img.id);
          // This findIndex approach is safer if the array content itself can change beyond just reversing.
          // However, for a simple reversal, the calculation is more direct.

          const currentImageState = imageLoadState[originalIndex] || 'loading';

          return (
            <div key={img.id || `gen-img-orig-${originalIndex}`} className="image-card">
              {currentImageState === 'loading' && (
                <div className="image-status-overlay image-loading-placeholder">
                  <ProgressSpinner
                    style={{ width: '50px', height: '50px' }}
                    strokeWidth="5"
                    fill="transparent"
                    animationDuration="1s"
                  />
                </div>
              )}

              {currentImageState === 'error' && (
                <div className="image-status-overlay image-error-placeholder">
                  <span>Image unavailable</span>
                </div>
              )}

              {img && img.url && (
                <img
                  src={img.url}
                  alt={img.altText || `Generated Design ${originalImages.length - originalIndex}`} // Display user-friendly number
                  className="image"
                  style={{ visibility: currentImageState === 'loaded' ? 'visible' : 'hidden' }}
                  onLoad={() => handleImageLoaded(originalIndex)}
                  onError={() => handleImageError(originalIndex, img.url)}
                />
              )}

              {img && img.url && (
                <div className="image-actions">
                  {downloadingIndexes.includes(originalIndex) ? (
                    <div className="loading-icon">
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
                      onClick={() => handleDownload(img.url, `design-${originalImages.length - originalIndex}.png`, originalIndex)}
                      title="Download Design"
                      aria-label="Download Design"
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