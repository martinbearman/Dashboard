"use client";

import { GridPosition } from "@/lib/types/dashboard";
import { useEffect, useRef } from "react";

// TODO: Replace with react-grid-layout for drag-and-drop and proper responsive handling
// For now: modules stack on mobile (parent uses grid-cols-1), positioned on desktop
export default function ModuleWrapper({
  children,
  moduleId,
  gridPosition,
}: {
  children: React.ReactNode;
  moduleId: string;
  gridPosition: GridPosition;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {

    if (!ref.current) return;
    const element = ref.current;

    const updateGridPosition = () => {
      if (window.innerWidth >= 768) {
        // Desktop: apply grid position
        element.style.gridColumn = `${gridPosition.x + 1} / span ${gridPosition.w}`;
      } else {
        // Mobile: full width (already handled by parent grid-cols-1)
        element.style.gridColumn = "";
      }
    };

    updateGridPosition();
    window.addEventListener("resize", updateGridPosition);
    return () => window.removeEventListener("resize", updateGridPosition);
  }, [gridPosition]);

  return (
    <div
      ref={ref}
      className="bg-white rounded-lg shadow-md p-4 text-black"
      // Note: react-grid-layout will replace this with:
      // - Drag and drop functionality
      // - Responsive breakpoints (mobile/tablet/desktop layouts)
      // - Automatic layout persistence per breakpoint
    >
      {children}
    </div>
  );
}

