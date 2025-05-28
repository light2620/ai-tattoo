import { FiX, FiZap } from 'react-icons/fi';
// Assuming SearchSuggestions.js is in ../../../utils/SearchSuggestion/ relative to Home.jsx
// If SearchBar.jsx is in the same dir as Home.jsx, this path remains valid.
import SearchSuggestions from '../../utils/SearchSuggestion/SearchSuggestions';
import "./style.css"
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
                        placeholder="Search for tattoo designs..."
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
            <button onClick={onAICreateImage} className="ai-create-button-inline" disabled={isAICreating || loading}>
                {isAICreating ? 'Creating...' : <><FiZap size={16} /> Create with AI</>}
            </button>
        </div>
    );
};

export default SearchBar;