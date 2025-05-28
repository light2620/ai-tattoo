import React, { useState, useEffect, useRef } from 'react';
import { getDesignsFromFirebase } from '../../../utils/firebaseService';
import { ProgressSpinner } from 'primereact/progressspinner';
import './style.css';
import { useApi } from '../../../Api/apiProvider';
import Spinner from '../../../utils/Spinner/Spinner';
import { useDispatch } from 'react-redux';
import { setCredits } from '../../../Redux/creditSlice';
import { setImages, setImageLoading } from '../../../Redux/ImagesSlice';
import { getUserDetails } from '../../../Api/getUserDataApi';

import SearchBar from '../../../Components/SearchBar/SearchBar';
import GeneratedImageView from '../../../Components/GeneratedImageView/GeneratedImageView';
import PinnedReferencesDisplay from '../../../Components/PinnedReferencesDisplay/PinnedReferencesDisplay';
import DesignsGallery from '../../../Components/DesignsGallery/DesignsGallery';

const Home = () => {
    // ... (all existing state variables)
    const [allDesigns, setAllDesigns] = useState([]);
    const [filteredDesigns, setFilteredDesigns] = useState([]);
    const [currentInput, setCurrentInput] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [loading, setLoading] = useState(true); // For initial data loading
    const [isAutoFiltering, setIsAutoFiltering] = useState(false);
    const [hoveredImageId, setHoveredImageId] = useState(null);
    const [allAvailableKeywords, setAllAvailableKeywords] = useState(new Set());
    const [activeSuggestions, setActiveSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isDownloadingGlobal, setIsDownloadingGlobal] = useState(false);
     const [globalDownloadError, setGlobalDownloadError] = useState('');

    const { post } = useApi();
      const dispatch = useDispatch();

    const [selectedReferenceImageUrls, setSelectedReferenceImageUrls] = useState([]);
    const [pinnedReferenceDesigns, setPinnedReferenceDesigns] = useState([]);
    const [generatedImageUrl, setGeneratedImageUrl] = useState('');
    const [isAICreating, setIsAICreating] = useState(false); // For AI image generation process
    const [aiError, setAiError] = useState('');

    const searchInputRef = useRef(null);
    const searchAreaContainerRef = useRef(null);

    // ... (all existing useEffect hooks and handler functions remain the same)
   
    // --- Effect 1: Fetch initial data ---
    useEffect(() => {
        const fetchDesignsAndKeywords = async () => {
            setLoading(true);
            try {
                const designs = await getDesignsFromFirebase();
                setAllDesigns(designs);
                const keywordsMasterSet = new Set();
                designs.forEach(design => {
                    design.keywords?.forEach(kw => {
                        if (typeof kw === 'string' && kw.trim()) keywordsMasterSet.add(kw.trim());
                    });
                });
                setAllAvailableKeywords(keywordsMasterSet);
            } catch (error) {
                console.error("Failed to fetch designs:", error);
                setAiError("Error loading designs. Please refresh.");
            } finally {
                setLoading(false);
            }
        };
        fetchDesignsAndKeywords();
    }, []);

    // --- Effect 2: Automatic OR filtering ---
    useEffect(() => {
        if (loading) return; // Don't filter if initial data isn't loaded
        setIsAutoFiltering(true);
        if (selectedTags.length === 0) {
            setFilteredDesigns(allDesigns);
        } else {
            const lowerCaseTags = selectedTags.map(tag => tag.toLowerCase());
            const results = allDesigns.filter(design =>
                lowerCaseTags.some(tag =>
                    (design.image_description?.toLowerCase().includes(tag)) ||
                    (design.keywords?.some(kw => String(kw).toLowerCase().includes(tag)))
                )
            );
            setFilteredDesigns(results);
        }
        setIsAutoFiltering(false);
    }, [selectedTags, allDesigns, loading]);

    // --- Effect 3: Update pinnedReferenceDesigns ---
    useEffect(() => {
        if (allDesigns.length > 0) { 
            const pinned = selectedReferenceImageUrls
                .map(url => allDesigns.find(design => design.image_link === url))
                .filter(Boolean);
            setPinnedReferenceDesigns(pinned);
        } else {
            setPinnedReferenceDesigns([]);
        }
    }, [selectedReferenceImageUrls, allDesigns]);

    // --- Effect 4: Click outside suggestions ---
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchAreaContainerRef.current && !searchAreaContainerRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // --- Input and Tag Management ---

    const handleInputChange = (e) => {
        const query = e.target.value;
        setCurrentInput(query);
        if (!query.trim()) {
            setActiveSuggestions([]);
            setShowSuggestions(false);
            return;
        }
        const lowerQuery = query.toLowerCase();
        const queryWords = lowerQuery.split(/\s+/).filter(w => w);
        let potential = new Set();
        queryWords.forEach(qw => {
            const found = Array.from(allAvailableKeywords).find(ak => ak.toLowerCase() === qw);
            if (found && !selectedTags.map(t => t.toLowerCase()).includes(found.toLowerCase())) {
                potential.add(found);
            }
        });
        if (query.slice(-1) !== ' ') {
            const lastSeg = queryWords.length > 0 ? queryWords[queryWords.length - 1] : "";
            if (lastSeg) {
                Array.from(allAvailableKeywords).forEach(ak => {
                    if (ak.toLowerCase().startsWith(lastSeg) && !selectedTags.map(t => t.toLowerCase()).includes(ak.toLowerCase())) {
                        potential.add(ak);
                    }
                });
            }
        }
        const sorted = Array.from(potential).sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
        setActiveSuggestions(sorted.slice(0, 7));
        setShowSuggestions(sorted.length > 0);
    };

    const addTag = (tag) => {
        const trimTag = tag.trim();
        if (trimTag && !selectedTags.map(t => t.toLowerCase()).includes(trimTag.toLowerCase())) {
            setSelectedTags(prev => [...prev, trimTag]);
        }
        setActiveSuggestions([]);
        setShowSuggestions(false);
        searchInputRef.current?.focus();
    };

    const removeTag = (tagToRemove) => {
        setSelectedTags(prev => prev.filter(t => t.toLowerCase() !== tagToRemove.toLowerCase()));
        searchInputRef.current?.focus();
    };

    const handleInputKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (currentInput.trim()) {
                const exactMatchInSuggestions = activeSuggestions.find(s => s.toLowerCase() === currentInput.trim().toLowerCase());
                addTag(exactMatchInSuggestions || currentInput.trim());
            }
        } else if (e.key === 'Backspace' && !currentInput && selectedTags.length > 0) {
            e.preventDefault();
            removeTag(selectedTags[selectedTags.length - 1]);
        }
    };

    const handleSuggestionClick = (suggestion) => addTag(suggestion);

    const handleInputFocus = () => {
        if (currentInput.trim() && activeSuggestions.length > 0) {
            setShowSuggestions(true);
        } else if (currentInput.trim()) {
            // Trigger suggestion generation even if list is empty but input has text
            handleInputChange({ target: { value: currentInput } });
        }
    };
    
    // --- Reference Image Selection ---
    const handleToggleReferenceImage = (imageUrl) => {
        setSelectedReferenceImageUrls(prev => {
            if (prev.includes(imageUrl)) {
                return prev.filter(url => url !== imageUrl);
            }
            // Allow selecting up to 2 images
            return prev.length < 2 ? [...prev, imageUrl] : prev;
        });
    };

    // --- AI Image Creation ---
    const handleAICreateImage = async () => {
        let combinedPrompt = selectedTags.join(' ');
        if (currentInput.trim()) {
            combinedPrompt = combinedPrompt ? `${combinedPrompt} ${currentInput.trim()}` : currentInput.trim();
        }
        if (!combinedPrompt.trim()) {
            setAiError("Please describe your tattoo or add tags to the prompt.");
            return;
        }
        setAiError('');
        setIsAICreating(true);
        setGeneratedImageUrl(''); // Clear previous image

        let referencesForAPI = [...selectedReferenceImageUrls];
        // If no references are selected, pick up to 2 random ones from filtered or all designs
        if (referencesForAPI.length === 0 && allDesigns.length > 0) {
            const sourceForRandom = filteredDesigns.length > 0 ? filteredDesigns : allDesigns;
            if (sourceForRandom.length > 0) {
                // Shuffle and pick
                referencesForAPI = [...sourceForRandom].sort(() => 0.5 - Math.random()).slice(0, Math.min(2, sourceForRandom.length)).map(img => img.image_link);
            }
        }
        console.log("AI Create - Prompt:", combinedPrompt, "References:", referencesForAPI);

        try {
            const response = await post('https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/generateImage', {
                prompt: combinedPrompt,
                referenceImages: referencesForAPI,
            });

            if (response.data.type === 'success' && response.data.imageUrl) {
                setGeneratedImageUrl(response.data.imageUrl);
                setSelectedReferenceImageUrls([]);
                        const userData = await getUserDetails(dispatch, post, setImageLoading);
                        if (userData) {
                          dispatch(setImages(userData.generateImages));
                          dispatch(setCredits(userData.creditScore || 0)); 
                        }
            } else {
                setAiError(response.data.message || 'AI generation failed or returned an unexpected response.');
            }
        } catch (err) {
            // More robust error handling
            const errorMessage = err.response?.data?.message || err.message || 'Error calling AI generation service.';
            console.error("AI Generation Error:", err);
            setAiError(errorMessage);
        } finally {
            setIsAICreating(false);
        }
    };

    const designsForGrid = filteredDesigns.filter(
        design => !pinnedReferenceDesigns.find(pinned => pinned.id === design.id)
    );
    
    const canSelectMoreReferences = selectedReferenceImageUrls.length < 2;

    const handleImageDownload = async (imageUrl, imageName) => {
        // If this function is only for a single image at a time, 
        // setIsDownloadingGlobal could be used. If multiple can download,
        // then individual cards need their own state (which we added in DesignCard)
        // For now, this global state can be for the AI generated image download.
        // The card-specific downloads will use their own state within DesignCard.

        const encodedUrl = encodeURIComponent(imageUrl);
        // Ensure your Cloud Function URL is correct
        const apiUrl = `https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/downloadTattooImage?url=${encodedUrl}`;

        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`Failed to fetch image for download: ${response.status} ${response.statusText}`);

            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = imageName || 'tattoo.png'; // Default filename
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            window.URL.revokeObjectURL(blobUrl);
            return true; // Indicate success
        } catch (err) {
            console.error('Error downloading image:', err);
            alert(`Download failed for ${imageName || 'image'}. Error: ${err.message}. Check console for details.`);
            return false; // Indicate failure
        }
    };


    return (
        <div className="home-container">
            <h1>Tattoo Generator</h1>
            
            <SearchBar
                currentInput={currentInput}
                selectedTags={selectedTags}
                activeSuggestions={activeSuggestions}
                showSuggestions={showSuggestions}
                isAICreating={isAICreating}
                loading={loading} // Pass main loading state
                searchInputRef={searchInputRef}
                searchAreaContainerRef={searchAreaContainerRef}
                onInputChange={handleInputChange}
                onInputKeyDown={handleInputKeyDown}
                onInputFocus={handleInputFocus}
                onRemoveTag={removeTag}
                onSuggestionClick={handleSuggestionClick}
                onAICreateImage={handleAICreateImage}
            />

            {isAICreating && (
                <div className="ai-generating-spinner-container"> {/* New container for styling */}
                    <Spinner /> {/* Your custom spinner */}
                    <p>Generating Tattoo...</p>
                </div>
            )}
            {aiError && <p className="error-message ai-error-message">{aiError}</p>}
            
            <GeneratedImageView
                generatedImageUrl={generatedImageUrl}
                isAICreating={isAICreating} // Pass this to ensure it doesn't show while creating
                onImageDownload={handleImageDownload}
                isDownloading={isDownloadingGlobal}
                setIsDownloading={setIsDownloadingGlobal}
                downloadError={globalDownloadError}
                setDownloadError={setGlobalDownloadError}
            />
            
            {!loading && pinnedReferenceDesigns.length > 0 && ( // Show pinned only if not initial loading and there are pinned items
                <PinnedReferencesDisplay
                    pinnedReferenceDesigns={pinnedReferenceDesigns}
                    onToggleReferenceImage={handleToggleReferenceImage}

                />
                
            )}

        

            {/* Show gallery loading message only if initial data loading OR auto-filtering
                AND not AI creating AND no generated image is currently shown */}
            {(loading || (isAutoFiltering && !isAICreating && !generatedImageUrl)) && !isAICreating &&

              <div className="loading-reference-image">
                  <Spinner />
                  <p className="loading-message">Loading designs...</p>
              </div>
            }

            {/* Main gallery section */}
            {!(loading || isAutoFiltering || isAICreating) && (
                <>
                    {/* Informational messages */}
                    {allDesigns.length > 0 && selectedReferenceImageUrls.length === 0 && pinnedReferenceDesigns.length === 0 && (
                        <p className="reference-info">Click on an image to select it as a reference for AI creation (max 2).</p>
                    )}
                    {designsForGrid.length === 0 && (selectedTags.length > 0 || currentInput.trim() !== '') && (
                        <p className="no-results-message">No further designs match your current filter.</p>
                    )}
                    {/* Message if grid is empty but designs exist (e.g., all are pinned) */}
                    {designsForGrid.length === 0 && selectedTags.length === 0 && currentInput.trim() === '' && allDesigns.length > 0 && pinnedReferenceDesigns.length === allDesigns.length && (
                         <p className="no-results-message">All available designs are selected as references. Deselect or search to see more.</p>
                    )}
                    {/* Message if grid is empty, no filters, and not all designs are pinned */}
                    {designsForGrid.length === 0 && selectedTags.length === 0 && currentInput.trim() === '' && allDesigns.length > 0 && pinnedReferenceDesigns.length < allDesigns.length && pinnedReferenceDesigns.length > 0 && (
                        <p className="no-results-message">All matching designs are shown above as pinned. Deselect or search to see more here.</p>
                    )}
                    {allDesigns.length === 0 && !loading && ( // No designs loaded at all
                        <p className="no-results-message">No designs available.</p>
                    )}

                    {/* Render the gallery if there are designs for the grid */}
                    {designsForGrid.length > 0 && (
                        <DesignsGallery
                            designs={designsForGrid}
                            selectedReferenceImageUrls={selectedReferenceImageUrls}
                            hoveredImageId={hoveredImageId}
                            onToggleReferenceImage={handleToggleReferenceImage}
                            onSetHoveredImageId={setHoveredImageId}
                            canSelectMoreReferences={canSelectMoreReferences}
                            onImageDownload={handleImageDownload}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default Home;