// Components/DesignsGallery/DesignsGallery.js (Modified)
import React from 'react';
import DesignCard from '../DesignCard/DesignCard';
import AiImageDisplay from '../AiImageDisplay/AiImageDisplay';
import './style.css';
import { FaMagic } from 'react-icons/fa';

const DesignsGallery = ({
    designs,
    hoveredImageId,
    onSetHoveredImageId,
    onImageDownload,
    onAICreateImage,
    isFiltered,
    aiImageUrl, // Prop for the AI image URL
    isAiLoading, // Prop for the AI loading state
    aiError // Prop for the AI error state
}) => {

    const renderAiButtonAndImage = () => {
        return (
            <React.Fragment>
                <div className="ai-section">
                    <div className="ai-create-button-container">
                        <button className="ai-create-button" onClick={onAICreateImage}>
                            <FaMagic size={20} style={{ marginRight: '5px' }} />
                            Create with AI
                        </button>
                    </div>
                </div>
                <AiImageDisplay
                    imageUrl={aiImageUrl}
                    isLoading={isAiLoading}
                    error={aiError}
                    onImageDownload={onImageDownload}
                />
            </React.Fragment>
        );
    };

    return (
        <div className="image-grid main-grid">
            {isFiltered && renderAiButtonAndImage()}
            {designs.map((design) => {
                const isHovered = hoveredImageId === design.id;
                return (
                    <DesignCard
                        key={design.id}
                        design={design}
                        isHovered={isHovered}
                        onMouseEnter={() => onSetHoveredImageId(design.id)}
                        onMouseLeave={() => onSetHoveredImageId(null)}
                        cardType="gallery"
                        onImageDownload={onImageDownload}
                    />
                );
            })}
        </div>
    );
};

export default DesignsGallery;