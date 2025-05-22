import React, { createContext, useContext, useState } from "react";

const searchContext = createContext();
export const useSearch = () => useContext(searchContext);

export default function SearchProvider({ children }) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <searchContext.Provider value={{ searchTerm, setSearchTerm }}>
      {children}
    </searchContext.Provider>
  );
}
