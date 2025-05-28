import React, { useState, useEffect, useRef } from 'react';
import { getDesignsFromFirebase } from '../../../utils/firebaseService';
// ProgressSpinner is not used, consider removing if not needed elsewhere.
// import { ProgressSpinner } from 'primereact/progressspinner'; 
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
    const [isAICreating, setIsAICreating] = useState(false);
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
        setCurrentInput(''); // <--- MODIFICATION: Clear input after adding a tag
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
                // currentInput will be cleared by addTag
            }
        } else if (e.key === 'Backspace' && !currentInput && selectedTags.length > 0) {
            e.preventDefault();
            removeTag(selectedTags[selectedTags.length - 1]);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        addTag(suggestion);
        // currentInput will be cleared by addTag
    };

    const handleInputFocus = () => {
        if (currentInput.trim() && activeSuggestions.length > 0) {
            setShowSuggestions(true);
        } else if (currentInput.trim()) {
            handleInputChange({ target: { value: currentInput } });
        }
    };

    // --- Reference Image Selection ---
    const handleToggleReferenceImage = (imageUrl) => {
        setSelectedReferenceImageUrls(prev => {
            if (prev.includes(imageUrl)) {
                return prev.filter(url => url !== imageUrl);
            }
            return prev.length < 2 ? [...prev, imageUrl] : prev;
        });
    };

    // --- AI Image Creation ---
    const handleAICreateImage = async () => {
        let combinedPrompt = selectedTags.join(' ');
        // If currentInput was typed but not yet converted to a tag, include it.
        // Since addTag clears currentInput, this will mostly be relevant if the user types
        // and immediately clicks "Create" without pressing Enter or selecting a suggestion.
        if (currentInput.trim()) {
            combinedPrompt = combinedPrompt ? `${combinedPrompt} ${currentInput.trim()}` : currentInput.trim();
        }

        if (!combinedPrompt.trim()) {
            setAiError("Please describe your tattoo by adding tags or typing in the search bar.");
            return;
        }
        setAiError('');
        setIsAICreating(true);
        setGeneratedImageUrl('');

        let referencesForAPI = [...selectedReferenceImageUrls];
        if (referencesForAPI.length === 0 && allDesigns.length > 0) {
            const sourceForRandom = filteredDesigns.length > 0 ? filteredDesigns : allDesigns;
            if (sourceForRandom.length > 0) {
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
                setSelectedReferenceImageUrls([]); // Clear selected references after generation
                // Clear input and tags if they were used in the prompt
                setCurrentInput(''); 
                setSelectedTags([]); 

                const userData = await getUserDetails(dispatch, post, setImageLoading);
                if (userData) {
                    dispatch(setImages(userData.generateImages));
                    dispatch(setCredits(userData.creditScore || 0));
                }
            } else {
                setAiError(response.data.message || 'AI generation failed or returned an unexpected response.');
            }
        } catch (err) {
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
        const encodedUrl = encodeURIComponent(imageUrl);
        const apiUrl = `https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/downloadTattooImage?url=${encodedUrl}`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) throw new Error(`Failed to fetch image for download: ${response.status} ${response.statusText}`);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = imageName || 'tattoo.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
            return true;
        } catch (err) {
            console.error('Error downloading image:', err);
            alert(`Download failed for ${imageName || 'image'}. Error: ${err.message}. Check console for details.`);
            return false;
        }
    };

    return (
        <div className="home-container">
            <h1>TATTOO GENERATOR</h1>

            <SearchBar
                currentInput={currentInput}
                selectedTags={selectedTags}
                activeSuggestions={activeSuggestions}
                showSuggestions={showSuggestions}
                isAICreating={isAICreating}
                loading={loading}
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
                <div className="ai-generating-spinner-container">
                    <Spinner />
                    <p>Generating Tattoo...</p>
                </div>
            )}
            {aiError && <p className="error-message ai-error-message">{aiError}</p>}

            <GeneratedImageView
                generatedImageUrl={generatedImageUrl}
                isAICreating={isAICreating}
                onImageDownload={handleImageDownload}
                isDownloading={isDownloadingGlobal}
                setIsDownloading={setIsDownloadingGlobal}
                downloadError={globalDownloadError}
                setDownloadError={setGlobalDownloadError}
            />

            {!loading && pinnedReferenceDesigns.length > 0 && (
                <PinnedReferencesDisplay
                    pinnedReferenceDesigns={pinnedReferenceDesigns}
                    onToggleReferenceImage={handleToggleReferenceImage}
                />
            )}

            {(loading || (isAutoFiltering && !isAICreating && !generatedImageUrl)) && !isAICreating &&
                <div className="loading-reference-image">
                    <Spinner />
                    <p className="loading-message">Loading designs...</p>
                </div>
            }

            {!(loading || isAutoFiltering || isAICreating) && (
                <>
                    {allDesigns.length > 0 && selectedReferenceImageUrls.length === 0 && pinnedReferenceDesigns.length === 0 && !generatedImageUrl && (
                        <p className="reference-info">Click on an image to select it as a reference for AI creation (max 2).</p>
                    )}
                    {designsForGrid.length === 0 && (selectedTags.length > 0 || currentInput.trim() !== '') && !generatedImageUrl && (
                        <p className="no-results-message">No further designs match your current filter.</p>
                    )}
                    {designsForGrid.length === 0 && selectedTags.length === 0 && currentInput.trim() === '' && allDesigns.length > 0 && pinnedReferenceDesigns.length === allDesigns.length && !generatedImageUrl && (
                        <p className="no-results-message">All available designs are selected as references. Deselect or search to see more.</p>
                    )}
                    {designsForGrid.length === 0 && selectedTags.length === 0 && currentInput.trim() === '' && allDesigns.length > 0 && pinnedReferenceDesigns.length < allDesigns.length && pinnedReferenceDesigns.length > 0 && !generatedImageUrl &&(
                        <p className="no-results-message">All matching designs are shown above as pinned. Deselect or search to see more here.</p>
                    )}
                    {allDesigns.length === 0 && !loading && !generatedImageUrl &&(
                        <p className="no-results-message">No designs available.</p>
                    )}

                    {designsForGrid.length > 0 && !generatedImageUrl && (
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