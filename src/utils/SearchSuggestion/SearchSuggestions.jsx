
import './style.css';

const SearchSuggestions = ({ suggestions, onSelectSuggestion, isVisible }) => {
    if (!isVisible || !suggestions || suggestions.length === 0) {
        return null;
    }

    return (
        <ul className="suggestions-list">
            {suggestions.map((suggestion, index) => (
                <li
                    key={index}
                    className="suggestion-item"
                    // Use onMouseDown to prevent input's onBlur from firing first
                    // and hiding the list before the click is registered.
                    onMouseDown={() => onSelectSuggestion(suggestion)}
                >
                    {suggestion}
                </li>
            ))}
        </ul>
    );
};

export default SearchSuggestions;