"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

const ComparisonContext = createContext();

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context) {
    throw new Error("useComparison must be used within ComparisonProvider");
  }
  return context;
};

export const ComparisonProvider = ({ children }) => {
  const [comparisonCars, setComparisonCars] = useState([]);

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("comparisonCars");
    if (saved) {
      setComparisonCars(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage when cars change
  useEffect(() => {
    localStorage.setItem("comparisonCars", JSON.stringify(comparisonCars));
  }, [comparisonCars]);

  const addToComparison = (car) => {
    if (comparisonCars.length >= 3) {
      toast.error("You can compare up to 3 cars only");
      return false;
    }

    if (comparisonCars.find(c => c.id === car.id)) {
      toast.error("Car is already in comparison");
      return false;
    }

    setComparisonCars(prev => [...prev, car]);
    toast.success(`${car.make} ${car.model} added to comparison`);
    return true;
  };

  const removeFromComparison = (carId) => {
    setComparisonCars(prev => prev.filter(car => car.id !== carId));
    toast.success("Car removed from comparison");
  };

  const clearComparison = () => {
    setComparisonCars([]);
    toast.success("Comparison cleared");
  };

  const isInComparison = (carId) => {
    return comparisonCars.some(car => car.id === carId);
  };

  return (
    <ComparisonContext.Provider
      value={{
        comparisonCars,
        addToComparison,
        removeFromComparison,
        clearComparison,
        isInComparison,
      }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};