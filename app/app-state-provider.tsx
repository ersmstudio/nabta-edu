"use client";

import { createContext, useContext, useEffect, useState } from "react";

type AppState = {
  courseQuery: string;
  setCourseQuery: (query: string) => void;
};

const AppStateContext = createContext<AppState | null>(null);
const courseQueryStorageKey = "nabta-course-query";

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [courseQuery, setCourseQuery] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setCourseQuery(window.localStorage.getItem(courseQueryStorageKey) ?? "");
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(courseQueryStorageKey, courseQuery);
  }, [courseQuery, ready]);

  return (
    <AppStateContext.Provider value={{ courseQuery, setCourseQuery }}>
      {children}
    </AppStateContext.Provider>
  );
}

export function useAppState() {
  const value = useContext(AppStateContext);
  if (!value) throw new Error("useAppState must be used inside AppStateProvider");
  return value;
}
