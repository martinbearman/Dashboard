"use client";

import { useRef } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore, RootState } from "./store";
import { loadState } from "./localStorage";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    // Load state from localStorage on client-side only
    const preloadedState = loadState() as Partial<RootState> | undefined;
    storeRef.current = makeStore(preloadedState);
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}

