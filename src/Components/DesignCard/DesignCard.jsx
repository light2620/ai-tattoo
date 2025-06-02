import React, { useState, useRef } from 'react';
import { FiEye, FiDownload } from 'react-icons/fi';
import { ProgressSpinner } from 'primereact/progressspinner';
import './style.css';
import { useInView } from 'react-intersection-observer';

const DesignCard = ({
    design,
    isHovered,
    onMouseEnter,
    onMouseLeave,
    cardType = "gallery",
    onImageDownload
}) => {
    const [isCardDownloading, setIsCardDownloading] = useState(false);
    const cardRef = useRef(null);
    const { ref, inView } = useInView({
        triggerOnce: true, // Only load once when it comes into view
        threshold: 0.2,    // Load when 20% of the image is visible
    });

    if (!design) return null;

    const initiateDownload = async (e) => {
        e.stopPropagation();
        if (onImageDownload) {
            setIsCardDownloading(true);
            const imageName = design.image_description?.replace(/[^a-z0-9]/gi, '_').toLowerCase() || `tattoo_design_${design.id}`;
            try {
                await onImageDownload(design.image_link, `${imageName}.png`);
            } catch (error) {
                console.error("Download error in DesignCard:", error);
            } finally {
                setIsCardDownloading(false);
            }
        }
    };

    const imageUrl = design.image_link;

    return (
        <div
            className={`image-item`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            ref={(node) => {
                ref(node);  // Attach intersection observer ref
                cardRef.current = node; // Keep your cardRef
            }}
        >
            {inView ? (
                <img src={imageUrl} alt={design.image_description || 'Tattoo design'} loading="lazy" />
            ) : (
                <div className="image-placeholder">Loading...</div> // Or a placeholder image
            )}

            {isCardDownloading && (
                <div className="card-download-spinner-overlay">
                    <ProgressSpinner style={{ width: '50px', height: '50px' }} strokeWidth="8" />
                </div>
            )}

            {!isCardDownloading && (isHovered) && (
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
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DesignCard;