// Components/AiImageDisplay/AiImageDisplay.js
import React, { useState } from 'react';
import './style.css';
import { FiDownload, FiEye } from 'react-icons/fi';
import { ProgressSpinner } from 'primereact/progressspinner';
import Spinner from '../../utils/Spinner/Spinner';


const AiImageDisplay = ({ imageUrl, isLoading, error, onImageDownload }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const success = await onImageDownload(imageUrl, 'ai_generated.png'); // Call onImageDownload prop
            if (!success) {
                console.error("Download failed.");
                // Handle download failure case (e.g., set an error state)
            }
        } catch (error) {
            console.error("Error during download:", error);
            // Handle download error case (e.g., set an error state)
        } finally {
            setIsDownloading(false);
        }
    };

    if (error) {
        return <div className="image-box error-message">{error}</div>;
    }

    if (true) {
        return (
            <div className="image-box loading-state">
                <div className="loading-overlay">
                    <Spinner />
                    <p className="loading-text">Generating Tattoo...</p>
                </div>
            </div>
        );
    }

    if (imageUrl) {
        return (
            <div
                className="image-box"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                <img src={imageUrl} alt="AI Generated Tattoo" className="tattoo-image" />
                <div className={`button-overlay ${isHovered ? 'active' : ''}`}>
                     {isDownloading ? (
                        <ProgressSpinner style={{ width: '30px', height: '30px' }} strokeWidth="5" />
                     ) : (
                        <button className="btn-download" onClick={handleDownload} title="Download Design">
                            <FiDownload size={24} />
                        </button>
                    )}
                    <button className="btn-preview" onClick={() => window.open(imageUrl, '_blank')} title="View Full Image">
                        <FiEye size={20} />
                    </button>
                </div>
            </div>
        );
    }

    return null;
};

export default AiImageDisplay;