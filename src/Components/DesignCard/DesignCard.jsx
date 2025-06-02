// Components/DesignCard/DesignCard.js (Modified)
import React, { useState, useRef, useEffect } from 'react';
import { FiEye, FiDownload } from 'react-icons/fi';
import { ProgressSpinner } from 'primereact/progressspinner';
import './style.css';
import useIntersectionObserver from '../../utils/useIntersectionObserver';

const DesignCard = ({
    design,
    isHovered,
    onMouseEnter,
    onMouseLeave,
    cardType = "gallery",
    onImageDownload
}) => {
    const [isCardDownloading, setIsCardDownloading] = useState(false);
    const [isLoading, setIsLoading] = useState(true); // Add loading state
    const cardRef = useRef(null);
    const isVisible = useIntersectionObserver(cardRef, {
        root: null,
        rootMargin: '200px 0px',
        threshold: 0.1,
    });

    useEffect(() => {
        if (isVisible) {
            // Start loading the image only when the card is visible
            const img = new Image();
            img.onload = () => setIsLoading(false);  // Set loading to false when the image loads
            img.onerror = () => setIsLoading(false); // Handle error if image fails to load
            img.src = design.image_link;
        }
    }, [isVisible, design.image_link]); // Added design.image_link to the dependency array

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

    const imageUrl = isVisible ? design.image_link : '/placeholder.png';

    return (
        <div
            className={`image-item`}
            onMouseEnter={onMouseEnter}
            onMouseLeave={onMouseLeave}
            ref={cardRef}
        >
            {isLoading ? (
                <Skeleton />  // Render skeleton while loading
            ) : (
                <img src={imageUrl} alt={design.image_description || 'Tattoo design'} loading="lazy" />
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

// Skeleton Component (Create a separate file if needed - e.g., Skeleton.js)
const Skeleton = () => {
    return (
        <div className="skeleton-wrapper">
            <div className="skeleton-image"></div>
        </div>
    );
};

export default DesignCard;