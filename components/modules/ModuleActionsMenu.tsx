"use client";

import { useState, type MouseEvent } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { updateModuleConfig, removeModuleConfig } from "@/lib/store/slices/moduleConfigsSlice";
import { removeModule } from "@/lib/store/slices/dashboardsSlice";
import { useClickOutside } from "@/lib/hooks/useClickOutside";
import { getModuleByType } from "@/modules/registry";

type ModuleActionsMenuProps = {
  moduleId: string;
  locked: boolean;
};

export function ModuleActionsMenu({ moduleId, locked }: ModuleActionsMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const dispatch = useAppDispatch();
  // Track the dashboard so removal can target the proper slice entry.
  const { activeDashboardId, dashboards } = useAppSelector((state) => state.dashboards);
  
  // Get module type and config panel
  const active = activeDashboardId ? dashboards[activeDashboardId] : null;
  const moduleInstance = active?.modules.find((m) => m.id === moduleId);
  const moduleMeta = moduleInstance ? getModuleByType(moduleInstance.type) : null;
  const ConfigPanel = moduleMeta?.configPanel;
  const moduleConfig = useAppSelector((state) => state.moduleConfigs.configs[moduleId] ?? {});

  // Close the menu when the user clicks/taps outside of the trigger + menu region.
  const containerRef = useClickOutside<HTMLDivElement>(() => setIsOpen(false), isOpen);
  
  // Close the config modal when clicking outside
  const modalRef = useClickOutside<HTMLDivElement>(() => setShowConfigModal(false), showConfigModal);

  // Shared helper so every handler collapses the dropdown after running.
  const closeMenu = () => setIsOpen(false);

  // Compose a handler that runs `handler` then immediately closes the menu.
  const withMenuClose =
    (handler: (event: MouseEvent<HTMLButtonElement>) => void) =>
    (event: MouseEvent<HTMLButtonElement>) => {
      handler(event);
      closeMenu();
    };

  // Toggle the popover visibility when the trigger button is pressed.
  const handleToggle = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setIsOpen((prev) => !prev);
  };

  const handleConfigure = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (ConfigPanel) {
      setShowConfigModal(true);
    }
  };

  const handleConfigChange = (config: Record<string, any>) => {
    dispatch(updateModuleConfig({ moduleId, config }));
  };

  const handleCloseConfigModal = () => {
    setShowConfigModal(false);
  };

  const handleToggleLock = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    // Flip the persisted lock bit for the module config.
    dispatch(
      updateModuleConfig({
        moduleId,
        config: { locked: !locked },
      }),
    );
  };

  const handleRemove = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    // Locked modules cannot be removed through the menu.
    if (locked) {
      return;
    }
    if (!activeDashboardId) {
      console.warn("Attempted to remove a module, but no dashboard is active.");
      return;
    }

    // Remove the module instance and clear its persisted config.
    dispatch(removeModule({ dashboardId: activeDashboardId, moduleId }));
    dispatch(removeModuleConfig(moduleId));
  };

  return (
    <>
      <div
        ref={containerRef}
        className="absolute top-2 right-2 z-20 module-actions-interactive"
      >
        <button
          type="button"
          className="module-actions-interactive relative z-20 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-500 shadow-sm transition hover:bg-gray-100"
          aria-label="Open module menu"
          aria-haspopup="menu"
          aria-expanded={isOpen}
          onPointerDown={(event) => event.stopPropagation()}
          onClick={handleToggle}
        >
          ⋮
        </button>
        {isOpen ? (
          <div
            role="menu"
            className="module-actions-interactive absolute right-0 mt-2 w-40 overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg z-10"
          >
            <button
              type="button"
              role="menuitem"
              className="w-full px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={withMenuClose(handleConfigure)}
              disabled={!ConfigPanel}
            >
              Configure
            </button>
            <button
              type="button"
              role="menuitem"
              className="w-full px-3 py-2 text-left text-sm text-gray-700 transition hover:bg-gray-100"
              onClick={withMenuClose(handleToggleLock)}
            >
              {locked ? "Unlock" : "Lock"}
            </button>
            <button
              type="button"
              role="menuitem"
              className="w-full px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={withMenuClose(handleRemove)}
              disabled={locked}
              aria-disabled={locked}
            >
              Remove
            </button>
          </div>
        ) : null}
      </div>

      {/* Configuration Modal */}
      {showConfigModal && ConfigPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div ref={modalRef} className="bg-white rounded-lg shadow-lg max-w-md w-full mx-4 max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold">Configure Module</h2>
              <button
                onClick={handleCloseConfigModal}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
                aria-label="Close configuration"
              >
                ×
              </button>
            </div>
            <ConfigPanel
              moduleId={moduleId}
              config={moduleConfig}
              onConfigChange={handleConfigChange}
            />
          </div>
        </div>
      )}
    </>
  );
}

