import React from "react";
import "./index.css";

function SearchInput(props) {
  const { placeholder, value, onChange } = props;
  return (
    <div className="search-input-container">
      <input
        type="search"
        placeholder={placeholder}
        className="search-input"
        value={value}
        onChange={onChange}
      />
    </div>
  );
}

export default SearchInput;
