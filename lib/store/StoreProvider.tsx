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
    // Important: create the store with a consistent initial state
    // on both server and client to avoid hydration mismatches.
    // Persisted localStorage state will be reconciled by middleware/effects after mount.
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}

