"use client";

import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setActiveDashboard } from "@/lib/store/slices/dashboardsSlice";
import { clsx } from "clsx";

export default function DashboardTabs() {

  const dashboards = useAppSelector((s) => s.dashboards.dashboards);
  const activeDashboardId = useAppSelector((s) => s.dashboards.activeDashboardId);
  const dispatch = useAppDispatch();

  const tabClass = (isActive: boolean) =>
    clsx(
      "px-4 py-2 rounded-full text-sm transition",
      isActive
        ? "bg-white/90 text-slate-900 shadow"
        : "bg-white/20 text-white/70 hover:bg-white/40 hover:text-white"
    );

  return (
    <>
     <div className="w-full flex justify-center">
        <div className="glassmorphic backdrop-blur rounded-full px-2 py-2 flex gap-2">
          {Object.values(dashboards).map((dash) => (
            <button
              key={dash.id}
              className={tabClass(dash.id === activeDashboardId)}
              onClick={() => dispatch(setActiveDashboard(dash.id))}
            >
              {dash.name}
            </button>
          ))}
        </div>
    </div>
    </>
  );
}

