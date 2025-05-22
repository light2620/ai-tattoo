// src/Pages/Dashbaord/Home/Home.js (or your path)
import React, { useState } from 'react';
import './style.css'; // We'll create this new CSS file
import { useApi } from '../../../Api/apiProvider';
import { getUserDetails } from '../../../Api/getUserDataApi'; // Assuming this is correct
import { useDispatch } from 'react-redux';
import { setImages, setImageLoading } from '../../../Redux/ImagesSlice'; // Assuming this is correct
import OptionSelector from '../../../utils/OptionSelector/OptionSelector'; // Assuming this is a custom component
import Spinner from '../../../utils/Spinner/Spinner'; // Your existing spinner
import { FaDownload, FaImage } from 'react-icons/fa'; // FaImage for reference button
import ReferenceImages from '../../../Components/RefrenceImages/RefrenceImages'; // Assuming path
import toast from 'react-hot-toast';
import { ProgressSpinner } from 'primereact/progressspinner'; // PrimeReact spinner

const Home = () => {
  const [input, setInput] = useState('');
  const [openRefrenceImages, setOpenRefrenceImages] = useState(false);
  const [selectedRefrenceImages, setSelectedRefrenceImages] = useState([]);
  const [quality, setQuality] = useState('simple'); // 'simple' or 'detailed' from OptionSelector
  const [loading, setLoading] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const { post } = useApi();
  const dispatch = useDispatch();

  const handleGenerate = async () => {
    if (!input.trim()) {
      toast.error("Please describe your tattoo idea.");
      return;
    }
    setLoading(true);
    setImageUrl('');
    try {
      const response = await post(
        'https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/generateImage',
        {
          prompt: input,
          referenceImages: selectedRefrenceImages,
          mode: quality,
        }
      );
      if (response.data.type === 'success') {
        setImageUrl(response.data.imageUrl);
        // Optionally, fetch user details and update Redux store if credit/image count changes
        const userData = await getUserDetails(dispatch, post, setImageLoading);
        if (userData && userData.generateImages) {
          dispatch(setImages(userData.generateImages));
        }
      } else {
        toast.error(response.data.message || 'Image generation failed.');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong during generation.');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (url, imageName) => {
    if (!url) return;
    setDownloading(true);
    const encodedUrl = encodeURIComponent(url);
    const apiUrl = `https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/downloadTattooImage?url=${encodedUrl}`;

    try {
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = imageName || 'tattoo-design.png';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      toast.success("Image download started!");
    } catch (err) {
      console.error('Error downloading image:', err);
      toast.error('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="tattoo-ai-page-container">
      <div className="page-header-alt"> {/* Similar to other page headers */}
        <h1>Tattoo AI Generator</h1>
        {/* Optional breadcrumbs or subtitle here */}
      </div>

      <div className="generator-content-area">
        <div className="generator-form-card">
          <div className="form-prompt-input-group">
            <label htmlFor="tattooPrompt" className="form-label">Describe your tattoo idea</label>
            <textarea
              id="tattooPrompt"
              className="prompt-textarea"
              placeholder="e.g., A majestic lion with a crown, geometric style, vibrant colors..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              rows="3"
            />
          </div>

          <div className="form-controls-grid">
            <div className="control-item">
              <label className="form-label">Quality</label>
              <OptionSelector selected={quality} onChange={setQuality} />
            </div>
            <div className="control-item">
              <label className="form-label">Reference</label>
              <button
                className="control-button reference-button"
                onClick={() => setOpenRefrenceImages(true)}
              >
                <FaImage className="button-icon" />
                {selectedRefrenceImages.length > 0
                  ? `${selectedRefrenceImages.length} Selected`
                  : 'Add Images'}
              </button>
            </div>
            <div className="control-item generate-button-wrapper">
              {/* Empty label for alignment or specific styling */}
              <label className="form-label"> </label>
              <button
                className="control-button generate-button"
                onClick={handleGenerate}
                disabled={loading || downloading || !input.trim()}
              >
                {loading ? (
                  <>
                    <Spinner size="small" color="#fff" /> Generating...
                  </>
                ) : (
                  'Generate Image'
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="generator-output-card">
          <div className="output-header">
            <h3 className="output-title">Generated Tattoo</h3>
          </div>
          <div className="output-image-area">
            {loading && (
              <div className="loading-overlay">
                <Spinner size="large" />
                <p>Creating your masterpiece...</p>
              </div>
            )}
            {!loading && imageUrl && (
              <div className="generated-image-container">
                <img src={imageUrl} alt="Generated tattoo design" className="generated-image" />
                <button
                  onClick={() => handleDownload(imageUrl, `tattoo-${input.substring(0,20).replace(/\s+/g, '-')}.png`)}
                  className="download-image-button"
                  disabled={downloading}
                  aria-label="Download image"
                >
                  {downloading ? (
                    <ProgressSpinner style={{ width: '20px', height: '20px' }} strokeWidth="6" animationDuration=".5s" />
                  ) : (
                    <FaDownload />
                  )}
                </button>
              </div>
            )}
            {!loading && !imageUrl && (
              <div className="placeholder-area">
                <FaImage className="placeholder-icon" />
                <p>Your generated image will appear here.</p>
                {selectedRefrenceImages.length > 0 && !input.trim() && (
                    <p className="sub-placeholder">Describe your idea to use the {selectedRefrenceImages.length} reference image(s).</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {openRefrenceImages && (
        <ReferenceImages
          selectedImages={selectedRefrenceImages}
          setSelectedImages={setSelectedRefrenceImages}
          onClose={() => setOpenRefrenceImages(false)}
        />
      )}
    </div>
  );
};

export default Home;