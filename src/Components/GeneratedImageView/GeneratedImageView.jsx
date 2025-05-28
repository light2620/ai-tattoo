// GeneratedImageView.jsx
import React from 'react'; // Removed useState as download state is passed from Home
import { FiDownload } from 'react-icons/fi';
import { ProgressSpinner } from 'primereact/progressspinner';
import './style.css';

const GeneratedImageView = ({
    generatedImageUrl,
    isAICreating,
    onImageDownload, // Passed from Home
    isDownloading,      // Passed from Home (specific to this AI generated image)
    setIsDownloading,   // Passed from Home
    downloadError,      // Passed from Home
    setDownloadError    // Passed from Home
}) => {

    if (!generatedImageUrl || isAICreating) {
        return null;
    }

    const handleInitiateDownload = async () => {
        if (!generatedImageUrl || !onImageDownload) return;
        setIsDownloading(true); // Manage state passed from Home
        setDownloadError('');   // Manage state passed from Home

        const imageName = generatedImageUrl.substring(generatedImageUrl.lastIndexOf('/') + 1) || 'ai-generated-tattoo.png';
        const success = await onImageDownload(generatedImageUrl, imageName);

        if (!success) {
            setDownloadError('Download failed. Please try again.');
        }
        setIsDownloading(false);
    };

    return (
        <div className="generated-image-view-container">
            <div className="ai-image-wrapper">
                <img src={generatedImageUrl} alt="AI Generated Tattoo Design" className="ai-generated-image-display" />
                {!isDownloading && (
                    <button
                        className="download-icon-overlay"
                        onClick={handleInitiateDownload}
                        title="Download Image"
                    >
                        <FiDownload size={24} />
                    </button>
                )}
                {isDownloading && (
                    <div className="download-spinner-overlay"> {/* This class name was used before, reuse it */}
                        <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" />
                    </div>
                )}
            </div>
            {downloadError && <p className="download-error-message">{downloadError}</p>}
        </div>
    );
};

export default GeneratedImageView;