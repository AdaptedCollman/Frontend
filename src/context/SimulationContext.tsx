import React, { createContext, useContext, useState } from "react";

interface SimulationContextType {
  isInSimulation: boolean;
  setIsInSimulation: (value: boolean) => void;
  showNavigationModal: boolean;
  setShowNavigationModal: (value: boolean) => void;
  pendingNavigation: string | null;
  setPendingNavigation: (value: string | null) => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(
  undefined
);

export const SimulationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isInSimulation, setIsInSimulation] = useState(false);
  const [showNavigationModal, setShowNavigationModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(
    null
  );

  return (
    <SimulationContext.Provider
      value={{
        isInSimulation,
        setIsInSimulation,
        showNavigationModal,
        setShowNavigationModal,
        pendingNavigation,
        setPendingNavigation,
      }}
    >
      {children}
    </SimulationContext.Provider>
  );
};

export const useSimulation = () => {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error("useSimulation must be used within a SimulationProvider");
  }
  return context;
};
