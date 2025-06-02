import React, { useState, useEffect, useRef } from 'react';
import { getDesignsFromFirebase } from '../../../utils/firebaseService';
import './style.css';
import { useApi } from '../../../Api/apiProvider';
import Spinner from '../../../utils/Spinner/Spinner';
import { useDispatch } from 'react-redux';
import { setCredits } from '../../../Redux/creditSlice';
import { setImages, setImageLoading } from '../../../Redux/ImagesSlice';
import { getUserDetails } from '../../../Api/getUserDataApi';

import SearchBar from '../../../Components/SearchBar/SearchBar';
import DesignsGallery from '../../../Components/DesignsGallery/DesignsGallery';

const Home = () => {
    const [allDesigns, setAllDesigns] = useState([]);
    const [filteredDesigns, setFilteredDesigns] = useState([]);
    const [currentInput, setCurrentInput] = useState('');
    const [selectedTags, setSelectedTags] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isAutoFiltering, setIsAutoFiltering] = useState(false);
    const [hoveredImageId, setHoveredImageId] = useState(null);
    const [allAvailableKeywords, setAllAvailableKeywords] = useState(new Set());
    const [activeSuggestions, setActiveSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [isDownloadingGlobal, setIsDownloadingGlobal] = useState('');
    const [globalDownloadError, setGlobalDownloadError] = useState('');
    const [aiImageUrl, setAiImageUrl] = useState(null); // State for the generated AI image URL
    const [isAiLoading, setIsAiLoading] = useState(false); // State for loading the AI image
    const [aiError, setAiError] = useState(''); // State for AI image generation errors

    const { post } = useApi();
    const dispatch = useDispatch();

    // REMOVED: Reference image states and refs
    const searchInputRef = useRef(null);
    const searchAreaContainerRef = useRef(null);
    const isFiltered = selectedTags.length > 0;

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

    // --- Effect 3: Click outside suggestions ---
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
        const queryWords = query.split(/\s+/).filter(w => w);  // Fixed whitespace split
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
                      const found = Array.from(allAvailableKeywords).find(ak => ak.toLowerCase() === lastSeg);
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

    // --- AI Image Creation ---
    const handleAICreateImage = async () => {
        // Check if there are filtered images
        if (filteredDesigns.length === 0) {
            setAiError("No filtered images available to use as reference.");
            return;
        }

        // Get a random image from the filtered designs
        const randomIndex = Math.floor(Math.random() * filteredDesigns.length);
        const randomReferenceImage = filteredDesigns[randomIndex];
        console.log("Selected random reference image:", randomReferenceImage);
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
        setIsAiLoading(true); // Set AI loading state to true
        setAiImageUrl(null); // Clear any previous image URL

        console.log("AI Create - Prompt:", combinedPrompt, "Reference Image:", randomReferenceImage.image_link);

        try {
            const response = await post('https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/generateImage', {
                prompt: combinedPrompt,
                referenceImages: [randomReferenceImage.image_link] // Ensure this exists!
            });

            if (response.data.type === 'success' && response.data.imageUrl) {
                // DO NOT CLEAR INPUT AND TAGS!
                // Clear input and tags if they were used in the prompt
               // setCurrentInput('');
                //setSelectedTags([]);

                console.log("AI Generation Success:", response.data.imageUrl);
                setAiImageUrl(response.data.imageUrl); // Set the AI image URL
                setAiError(''); // Clear any previous errors

                const userData = await getUserDetails(dispatch, post, setImageLoading);
                if (userData) {
                    dispatch(setImages(userData.generateImages));
                    dispatch(setCredits(userData.creditScore || 0));
                }
            } else {
                setAiError(response.data.message || 'AI generation failed or returned an unexpected response.');
                setAiImageUrl(null);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || err.message || 'Error calling AI generation service.';
            console.error("AI Generation Error:", err);
            setAiError(errorMessage);
            setAiImageUrl(null);
        } finally {
            setIsAiLoading(false); // Set AI loading state to false
        }
    };

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
                searchInputRef={searchInputRef}
                searchAreaContainerRef={searchAreaContainerRef}
                onInputChange={handleInputChange}
                onInputKeyDown={handleInputKeyDown}
                onInputFocus={handleInputFocus}
                onRemoveTag={removeTag}
                onSuggestionClick={handleSuggestionClick}
                onAICreateImage={handleAICreateImage}
            />

            {/* REMOVE THIS SECTION */}
            {/* {isAICreating && (
                <div className="ai-generating-spinner-container">
                    <Spinner />
                    <p>Generating Tattoo...</p>
                </div>
            )} */}
            {aiError && <p className="error-message ai-error-message">{aiError}</p>}

            {(loading || isAutoFiltering) && (
                <div className="loading-reference-image">
                    <Spinner />
                    <p className="loading-message">Loading designs...</p>
                </div>
            )}

            {!(loading || isAutoFiltering) && (
                <>
                    {filteredDesigns.length === 0 && isFiltered && (
                        <p className="no-results-message">No designs match your current filter.</p>
                    )}
                    {allDesigns.length === 0 && !loading && (
                        <p className="no-results-message">No designs available.</p>
                    )}

                    {filteredDesigns.length > 0 && (
                        <DesignsGallery
                            designs={filteredDesigns}
                            hoveredImageId={hoveredImageId}
                            onSetHoveredImageId={setHoveredImageId}
                            onImageDownload={handleImageDownload}
                            onAICreateImage={handleAICreateImage}
                            isFiltered={isFiltered}
                            aiImageUrl={aiImageUrl} // Pass the AI image URL
                            isAiLoading={isAiLoading} // Pass the AI loading state
                            aiError={aiError} // Pass the AI error state
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default Home;