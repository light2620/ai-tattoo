// PinnedReferencesDisplay.jsx
import React from 'react';
import DesignCard from '../DesignCard/DesignCard';
import './style.css';

const PinnedReferencesDisplay = ({ pinnedReferenceDesigns, onToggleReferenceImage, onImageDownload }) => {
    if (!pinnedReferenceDesigns || pinnedReferenceDesigns.length === 0) {
        return null;
    }

    return (
        <div className="pinned-references-section">
            <h3>Selected Reference Images ({pinnedReferenceDesigns.length}/2)</h3>
            <div className="image-grid reference-grid">
                {pinnedReferenceDesigns.map((design) => (
                    <DesignCard
                        key={`pinned-${design.id}`}
                        design={design}
                        cardType="pinned"
                        onToggleReferenceImage={onToggleReferenceImage}
                        onImageDownload={onImageDownload} // Pass it down
                    />
                ))}
            </div>
        </div>
    );
};

export default PinnedReferencesDisplay;