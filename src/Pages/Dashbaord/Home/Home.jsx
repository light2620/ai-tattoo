import React, { useEffect, useState } from "react";
import { getDesignsFromFirebase } from "../../../utils/firebaseService";
import { FaSearch, FaTimes, FaDownload, FaEye } from "react-icons/fa";
import { useInView } from "react-intersection-observer";
import DesignCard from "../../../Components/DesignCard/DesignCard";
import "./style.css";

const Home = () => {
  const [allDesigns, setAllDesigns] = useState([]);
  const [filteredDesigns, setFilteredDesigns] = useState([]);
  const [keywordInput, setKeywordInput] = useState("");
  const [allKeywords, setAllKeywords] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const designs = await getDesignsFromFirebase();
      setAllDesigns(designs);
      setFilteredDesigns(designs);

      const keywordSet = new Set();
      designs.forEach((d) => d.keywords.forEach((k) => keywordSet.add(k)));
      setAllKeywords([...keywordSet]);
    };

    fetchData();
  }, []);

  const handleInputChange = (e) => {
    const input = e.target.value.toLowerCase();
    setKeywordInput(input);
    if (input) {
      const filtered = allKeywords.filter(
        (k) => k.includes(input) && !selectedTags.includes(k)
      );
      setSuggestions(filtered.slice(0, 5));
    } else {
      setSuggestions([]);
    }
  };

  const handleAddTag = (tag) => {
    const updatedTags = [...selectedTags, tag];
    setSelectedTags(updatedTags);
    setKeywordInput("");
    setSuggestions([]);

    const filtered = allDesigns.filter((design) =>
      updatedTags.every((tag) => design.keywords.includes(tag))
    );
    setFilteredDesigns(filtered);
  };

  const handleRemoveTag = (tagToRemove) => {
    const updatedTags = selectedTags.filter((tag) => tag !== tagToRemove);
    setSelectedTags(updatedTags);

    if (updatedTags.length === 0) {
      setFilteredDesigns(allDesigns);
    } else {
      const filtered = allDesigns.filter((design) =>
        updatedTags.every((tag) => design.keywords.includes(tag))
      );
      setFilteredDesigns(filtered);
    }
  };

  return (
    <div className="home-container">
      <div className="search-bar">
        <div className="tags">
          {selectedTags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
              <FaTimes onClick={() => handleRemoveTag(tag)} />
            </span>
          ))}
        </div>

        <input
          type="text"
          value={keywordInput}
          onChange={handleInputChange}
          placeholder="Search tattoo keywords..."
        />
        <FaSearch className="search-icon" />

        {suggestions.length > 0 && (
          <ul className="suggestions">
            {suggestions.map((s) => (
              <li key={s} onClick={() => handleAddTag(s)}>
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      {selectedTags.length > 0 && (
        <button className="create-button">Create with AI</button>
      )}

      <div className="image-grid">
        {filteredDesigns.map((design) => (
          <DesignCard key={design.id} design={design} />
        ))}
      </div>
    </div>
  );
};

export default Home;
