"use client";

// Page-level composition: keep data selection and module mapping here
// so `DashboardContainer` can focus purely on layout concerns.
import DashboardTabs from "@/components/layout/DashboardTabs";
import DashboardContainer from "@/components/layout/DashboardContainer";
import AddModuleButton from "@/components/layout/AddModuleButton";
import { useAppSelector } from "@/lib/store/hooks";
import { getModuleByType } from "@/modules/registry";
import ModuleWrapper from "@/components/modules/ModuleWrapper";

export default function Home() {
  // Read the active dashboard and all dashboards from Redux
  const { activeDashboardId, dashboards } = useAppSelector((s) => s.dashboards);
  const active = activeDashboardId ? dashboards[activeDashboardId] : null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-800 to-blue-900">
      <div className="py-6">
        {/* dashboard tabs (centered) */}
        <DashboardTabs />
      </div>

      <div className="container mx-auto px-4 pb-24">
        {/*
          Decoupled rendering: the container provides grid/layout only.
          We map module instances here and render their components.
        */}
        <DashboardContainer>
          {active?.modules.map((m) => {
            // Lookup the module definition (component, metadata) by type
            const meta = getModuleByType(m.type);
            if (!meta) return null;
            const ModuleComp = meta.component;
            return (
              // Wrapper handles per-module shell; DnD hooks will live here later
              <ModuleWrapper key={m.id} moduleId={m.id} gridPosition={m.gridPosition}>
                <ModuleComp moduleId={m.id} />
              </ModuleWrapper>
            );
          })}
        </DashboardContainer>
      </div>

      {/* Floating add button (will become a dropdown sourced from the registry) */}
      <AddModuleButton />
    </main>
  );
}