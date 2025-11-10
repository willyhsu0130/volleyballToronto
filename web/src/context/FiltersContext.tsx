import { createContext, useContext, useState, ReactNode } from "react"


// Create the context usinng createContext() from react
const FilterContext = createContext<FilterContextType | undefined>(undefined);


export interface FilterState {
  sports: string[];
  age: number | null;
  beginDate: Date | null;
  endDate: Date | null;
  locationId: number | null;
}

interface FilterContextType {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  setBeginDate: (date: Date | null) => void
  setEndDate: (date: Date | null) => void
  setSports: (sports: string[] | []) => void
  setAge: (age: number | null) => void
  setLocationId: (locationId: number | null) => void
  query: string | undefined
}


// Creat the wrapper for the filte 
export const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [filters, setFilters] = useState<FilterState>({
    sports: [],
    age: null,
    beginDate: new Date(),
    endDate: null,
    locationId: null
  });
  const [query] = useState(filters.sports[0] || undefined)

  const setBeginDate = (date: Date | null) => {
    setFilters(prev => ({ ...prev, beginDate: date }));
  };

  const setEndDate = (date: Date | null) => {
    setFilters(prev => ({ ...prev, endDate: date }));
  };

  const setSports = (sports: string[] | []) => {
    setFilters(prev => ({ ...prev, sports: sports }))
  }

  const setAge = (age: number | null) => {
    setFilters(prev => ({ ...prev, age: age }))
  }

  const setLocationId = (locationId: number | null) => {
    setFilters(prev => ({ ...prev, locationId: locationId }))
  }

  const resetFilters = () => {
    setFilters({
      sports: [],
      age: null,
      beginDate: null,
      endDate: null,
      locationId: null,
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