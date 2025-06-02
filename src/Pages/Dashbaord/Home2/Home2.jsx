import React, { useState, useEffect, useRef, useCallback } from 'react';
import { getDesignsFromFirebase } from '../../../utils/firebaseService';
import './style.css';
import { useApi } from '../../../Api/apiProvider';
import Spinner from '../../../utils/Spinner/Spinner';
import { useDispatch } from 'react-redux';
import { setCredits } from '../../../Redux/creditSlice';
import { setImages, setImageLoading } from '../../../Redux/ImagesSlice';
import { getUserDetails } from '../../../Api/getUserDataApi';
import { useInView } from 'react-intersection-observer';  // Import
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
    const [aiImageUrl, setAiImageUrl] = useState(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [aiError, setAiError] = useState('');

    const { post } = useApi();
    const dispatch = useDispatch();
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
                console.log(designs)

                //Pre-process keywords once
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

    // --- Effect 2: Automatic OR filtering (debounced) ---
    useEffect(() => {
        if (loading) return;

        const filterDesigns = () => {
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
        };

        const timeoutId = setTimeout(filterDesigns, 150); // Debounce delay (adjust as needed)

        return () => clearTimeout(timeoutId); // Clear timeout on unmount or tag change

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

        // Debounce the suggestion generation to avoid excessive calculations
        const timeoutId = setTimeout(() => {
            generateSuggestions(query);
        }, 100); // Adjust the debounce delay as needed

        return () => clearTimeout(timeoutId);

    };

    const generateSuggestions = (query) => {
        const lowerQuery = query.toLowerCase();
        const queryWords = query.split(/\s+/).filter(w => w);
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
        setCurrentInput('');
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

    const handleSuggestionClick = (suggestion) => {
        addTag(suggestion);
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
        if (filteredDesigns.length === 0) {
            setAiError("No filtered images available to use as reference.");
            return;
        }

        const randomIndex = Math.floor(Math.random() * filteredDesigns.length);
        const randomReferenceImage = filteredDesigns[randomIndex];
        console.log("Selected random reference image:", randomReferenceImage);
        let combinedPrompt = selectedTags.join(' ');

        if (currentInput.trim()) {
            combinedPrompt = combinedPrompt ? `${combinedPrompt} ${currentInput.trim()}` : currentInput.trim();
        }

        if (!combinedPrompt.trim()) {
            setAiError("Please describe your tattoo by adding tags or typing in the search bar.");
            return;
        }
        setAiError('');
        setIsAiLoading(true);
        setAiImageUrl(null);

        console.log("AI Create - Prompt:", combinedPrompt, "Reference Image:", randomReferenceImage.image_link);

        try {
            const response = await post('https://us-central1-tattoo-shop-printing-dev.cloudfunctions.net/generateImage', {
                prompt: combinedPrompt,
                referenceImages: [randomReferenceImage.image_link]
            });

            if (response.data.type === 'success' && response.data.imageUrl) {
                console.log("AI Generation Success:", response.data.imageUrl);
                setAiImageUrl(response.data.imageUrl);
                setAiError('');

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
            setIsAiLoading(false);
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

            {loading ? (
                <div className="loading-reference-image">
                    <Spinner />

                </div>
            ) : (
                <>
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
                    {aiError && <p className="error-message ai-error-message">{aiError}</p>}

                    {filteredDesigns.length > 0 && (
                        <DesignsGallery
                            designs={filteredDesigns}
                            hoveredImageId={hoveredImageId}
                            onSetHoveredImageId={setHoveredImageId}
                            onImageDownload={handleImageDownload}
                            onAICreateImage={handleAICreateImage}
                            isFiltered={isFiltered}
                            aiImageUrl={aiImageUrl}
                            isAiLoading={isAiLoading}
                            aiError={aiError}
                        />
                    )}
                    {filteredDesigns.length === 0 && isFiltered && (
                        <p className="no-results-message">No designs match your current filter.</p>
                    )}
                </>
            )}
            {allDesigns.length === 0 && !loading && (
                <p className="no-results-message">No designs available.</p>
            )}
        </div>
    );
};

export default Home;