import React from 'react'; // Added React import for JSX
import { FiX, FiZap } from 'react-icons/fi';
import SearchSuggestions from '../../utils/SearchSuggestion/SearchSuggestions';
import "./style.css";

const SearchBar = ({
    currentInput,
    selectedTags,
    activeSuggestions,
    showSuggestions,
    isAICreating,
    loading, // General loading state for disabling button
    searchInputRef,
    searchAreaContainerRef,
    onInputChange,
    onInputKeyDown,
    onInputFocus,
    onRemoveTag,
    onSuggestionClick,
    onAICreateImage
}) => {
    // Determine if the prompt is empty (no tags and no text in input)
    const isPromptEmpty = selectedTags.length === 0 && currentInput.trim() === '';

    return (
        <div className="search-area-inline" ref={searchAreaContainerRef}>
            <div className="prompt-style-input-container" onClick={() => searchInputRef.current?.focus()}>
                {selectedTags.map(tag => (
                    <div key={tag} className="selected-tag-in-prompt">
                        {tag}
                        <button onClick={(e) => { e.stopPropagation(); onRemoveTag(tag); }} className="remove-tag-btn-in-prompt"><FiX size={14} /></button>
                    </div>
                ))}
                <div className="actual-input-wrapper">
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder={selectedTags.length > 0 ? "Add more..." : "Generate Tattoo"} // Dynamic placeholder
                        value={currentInput}
                        onChange={onInputChange}
                        onKeyDown={onInputKeyDown}
                        onFocus={onInputFocus}
                        autoComplete="off"
                    />
                    <SearchSuggestions
                        suggestions={activeSuggestions}
                        onSelectSuggestion={onSuggestionClick}
                        isVisible={showSuggestions}
                    />
                </div>
            </div>
            <button
                onClick={onAICreateImage}
                className="ai-create-button-inline"
                disabled={isAICreating || loading || isPromptEmpty} // <--- MODIFIED THIS LINE
            >
                {isAICreating ? 'Creating...' : <><FiZap size={16} /> Create with AI</>}
            </button>
        </div>
    );
};

export default SearchBar;