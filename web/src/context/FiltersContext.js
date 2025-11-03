import { createContext, useContext, useState } from "react"


// Create the context usinng createContext() from react
const FilterContext = createContext(undefined);

// Creat the wrapper for the filte 
export const FilterProvider = ({ children }) => {
  const [filters, setFilters] = useState({
    sports: [],
    age: null,
    beginDate: new Date(),
    endDate: null,
    locationId: undefined
  });
  const [query, setQuery] = useState(filters.sports[0] || undefined)

  const setBeginDate = (date) => {
    setFilters(prev => ({ ...prev, beginDate: date }));
  };

  const setEndDate = (date) => {
    setFilters(prev => ({ ...prev, endDate: date }));
  };

  const setSports = (sports) => {
    setFilters(prev => ({ ...prev, sports: sports }))
  }

  const setAge = (age) => {
    setFilters(prev => ({ ...prev, age: age }))
  }

  const setLocationId = (locationId) => {
    setFilters(prev => ({ ...prev, locationId: locationId }))
  }

  const resetFilters = () => {
    setFilters({
      sports: [],
      age: null,
      beginDate: null,
      endDate: null,
      locationId: undefined,
    });
  };

  return (
    <FilterContext.Provider value={{
      filters,
      setFilters,
      setBeginDate,
      setEndDate,
      setSports,
      resetFilters,
      setAge,
      setLocationId,
      query
    }}>
      {children}
    </FilterContext.Provider>
  );
};

export const useFilters = () => {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error("useFilters must be used within a FilterProvider");
  }
  return context;
};