"use client";

import { useEffect, useRef, useState } from "react";
import { Provider } from "react-redux";
import { makeStore, AppStore, RootState } from "./store";
import { loadState } from "./localStorage";
import { DashboardSkeleton } from "@/components/ui/Skeleton";

export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore>();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!storeRef.current) {
      // Create the store on the client with preloaded state to avoid SSR/CSR mismatches
      const preloaded = loadState() || undefined;
      storeRef.current = makeStore(preloaded);
    }
    setReady(true);
  }, []);

  if (!ready || !storeRef.current) return <DashboardSkeleton />;

  return <Provider store={storeRef.current}>{children}</Provider>;
}

