// DesignsGallery.jsx
import React from 'react';
import DesignCard from '../DesignCard/DesignCard';
import './style.css';

const DesignsGallery = ({
    designs,
    selectedReferenceImageUrls,
    hoveredImageId,
    onToggleReferenceImage,
    onSetHoveredImageId,
    canSelectMoreReferences,
    onImageDownload // New prop
}) => {
    return (
        <div className="image-grid main-grid">
            {designs.map((design) => {
                const isSelectedAsReference = selectedReferenceImageUrls.includes(design.image_link);
                const isHovered = hoveredImageId === design.id;
                return (
                    <DesignCard
                        key={design.id}
                        design={design}
                        isSelectedAsReference={isSelectedAsReference}
                        isHovered={isHovered}
                        onToggleReferenceImage={onToggleReferenceImage}
                        onMouseEnter={() => onSetHoveredImageId(design.id)}
                        onMouseLeave={() => onSetHoveredImageId(null)}
                        cardType="gallery"
                        canSelectMoreReferences={canSelectMoreReferences}
                        onImageDownload={onImageDownload} // Pass it down
                    />
                );
            })}
        </div>
    );
};

export default DesignsGallery;