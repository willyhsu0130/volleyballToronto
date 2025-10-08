import React, { createContext, useContext, useState, ReactNode } from "react";

// types in the fiter
interface FilterState {
  sports: string[];
  age: string;
  beginDate: string;
  endDate: string;
  locationId: number | undefined;
}

// types in the filter Context (includes helper funcs and types)
interface FilterContextType {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
}

// Create the context usinng createContext() from react
const FilterContext = createContext<FilterContextType | undefined>(undefined);

// Creat the wrapper for the filte 
export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<FilterState>({
    sports: ["Volleyball"],
    age: "",
    beginDate: "",
    endDate: "",
    locationId: undefined
  });

  const resetFilters = () => {
    setFilters({
      sports: [],
      age: "",
      beginDate: "",
      endDate: "",
      locationId: undefined
    });
  };

  return (
    <FilterContext.Provider value={{ filters, setFilters, resetFilters }}>
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