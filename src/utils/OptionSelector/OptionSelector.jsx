import React, { useState, useRef, useEffect } from 'react';
import './style.css';

const options = ['simple', 'medium', 'high'];

const OptionSelector = ({ selected, onChange }) => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="custom-select" ref={dropdownRef}>
      <div className="select-box" onClick={() => setOpen(!open)}>
        <span>{selected.charAt(0).toUpperCase() + selected.slice(1)}</span>
        <span className="arrow">&#9662;</span>
      </div>
      {open && (
        <div className="select-menu">
          {options.map((option) => (
            <div
              key={option}
              className={`select-option ${selected === option ? 'active' : ''}`}
              onClick={() => {
                onChange(option);
                setOpen(false);
              }}
            >
              {option.charAt(0).toUpperCase() + option.slice(1)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OptionSelector;
