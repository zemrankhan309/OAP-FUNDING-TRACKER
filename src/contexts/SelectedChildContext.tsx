import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import type { Child } from "../types/child";

interface SelectedChildContextType {
  selectedChild: Child | null;

  setSelectedChild: (
    child: Child | null
  ) => void;
}

const SelectedChildContext =
  createContext<SelectedChildContextType>({
    selectedChild: null,

    setSelectedChild: () => {},
  });

export function SelectedChildProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedChild, setSelectedChild] =
    useState<Child | null>(() => {
      const saved = localStorage.getItem(
        "selectedChild"
      );

      return saved
        ? JSON.parse(saved)
        : null;
    });

  useEffect(() => {
    if (selectedChild) {
      localStorage.setItem(
        "selectedChild",
        JSON.stringify(selectedChild)
      );
    } else {
      localStorage.removeItem(
        "selectedChild"
      );
    }
  }, [selectedChild]);

  return (
    <SelectedChildContext.Provider
      value={{
        selectedChild,
        setSelectedChild,
      }}
    >
      {children}
    </SelectedChildContext.Provider>
  );
}

export function useSelectedChild() {
  return useContext(
    SelectedChildContext
  );
}