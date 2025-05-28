// DesignCard.jsx
import React, { useState } from 'react';
import { FiEye, FiCheckSquare, FiSquare, FiDownload } from 'react-icons/fi';
import { ProgressSpinner } from 'primereact/progressspinner';
import './style.css';

const DesignCard = ({
    design,
    isSelectedAsReference,
    isHovered,
    onToggleReferenceImage,
    onMouseEnter,
    onMouseLeave,
    cardType = "gallery",
    canSelectMoreReferences,
    // New prop for the download function
    onImageDownload // Pass the global handleDownload function here
}) => {
    const [isCardDownloading, setIsCardDownloading] = useState(false); // State for this specific card's download

    if (!design) return null;

    const handleToggle = (e) => {
        e.stopPropagation();
        onToggleReferenceImage(design.image_link);
    };

    const initiateDownload = async (e) => {
        e.stopPropagation(); // Prevent other card actions
        if (onImageDownload) {
            setIsCardDownloading(true);
            // Suggest a filename based on description or a default
            const imageName = design.image_description?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || `tattoo_design_${design.id}`;
            await onImageDownload(design.image_link, `${imageName}.png`);
            setIsCardDownloading(false);
        }
    };


    if (cardType === "pinned") {
        return (
            <div className="image-item reference-selected pinned-reference-item">
                <img src={design.image_link} alt={design.image_description || 'Reference Tattoo Design'} />
                {isCardDownloading && (
                    <div className="card-download-spinner-overlay">
                        <ProgressSpinner style={{width: '40px', height: '40px'}} strokeWidth="6" />
                    </div>
                )}
                {!isCardDownloading && (
                    <div className="image-overlay always-visible">
                        <button
                            className="card-download-btn pinned-download-btn"
                            onClick={initiateDownload}
                            title="Download this reference"
                        >
                            <FiDownload size={16} />
                        </button>
                        <div className="overlay-keywords-container short">
                            {design.keywords?.slice(0, 2).map((kw, i) => <span key={i} className="keyword-tag small-tag">{kw}</span>)}
                            {design.keywords?.length > 2 && <span className="keyword-tag small-tag">...</span>}
                        </div>
                        <div className="overlay-footer short">
                            <span className="overlay-description small-desc">
                                {design.image_description?.substring(0, 15) || 'Ref'}
                                {design.image_description && design.image_description.length > 15 ? '...' : ''}
                            </span>
                            <button
                                className="select-reference-btn selected"
                                onClick={handleToggle}
                                title="Deselect Reference"
                            >
                                <FiCheckSquare size={18} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // Default to gallery type
    return (
        <div
            className={`image-item ${isSelectedAsReference ? 'reference-selected' : ''}`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
        >
            <img src={design.image_link} alt={design.image_description || 'Tattoo design'} />
            {isCardDownloading && (
                <div className="card-download-spinner-overlay">
                    <ProgressSpinner style={{width: '50px', height: '50px'}} strokeWidth="8" />
                </div>
            )}
            {!isCardDownloading && (isHovered || isSelectedAsReference) && (
                <div className="image-overlay">
                     <button
                        className="card-download-btn gallery-download-btn"
                        onClick={initiateDownload}
                        title="Download Design"
                    >
                        <FiDownload size={20} />
                    </button>
                    <div className="overlay-keywords-container">
                        {design.keywords?.slice(0, 5).map((kw, i) => <span key={i} className="keyword-tag">{kw}</span>)}
                        {design.keywords?.length > 5 && <span className="keyword-tag">...</span>}
                    </div>
                    <div className="overlay-footer">
                        <span className="overlay-description">
                            {design.image_description?.substring(0, 30) || 'Design'}
                            {design.image_description && design.image_description.length > 30 ? '...' : ''}
                        </span>
                        <div className="overlay-actions">
                            <button className="overlay-view-btn" onClick={() => window.open(design.image_link, '_blank')} title="View full image"><FiEye /></button>
                            <button
                                className={`select-reference-btn ${isSelectedAsReference ? 'selected' : ''}`}
                                onClick={handleToggle}
                                title={isSelectedAsReference ? "Deselect Reference" : "Select as Reference (Max 2)"}
                                disabled={!isSelectedAsReference && !canSelectMoreReferences}
                            >
                                {isSelectedAsReference ? <FiCheckSquare size={20} /> : <FiSquare size={20} />}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DesignCard;