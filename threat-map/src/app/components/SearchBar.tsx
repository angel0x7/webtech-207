"use client";

import React, { useState } from "react";

const SearchBar: React.FC = () => {
  const [query, setQuery] = useState("");

  return (
    <input
      type="text"
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="IP address..."
      style={{
        width: "200px",
        height: "32px",
        borderRadius: "20px",   
        paddingLeft: "50px",    
        border: "none",
        outline: "none",
        color: "#ffffffff",
        backgroundColor: "#555555",
      }}
    />
  );
};

export default SearchBar;
