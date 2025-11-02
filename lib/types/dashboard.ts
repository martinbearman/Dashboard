import { ReactNode } from "react";

/**
 * Grid position for a module on the 12-column grid
 */
export interface GridPosition {
  x: number; // Column start (0-11)
  y: number; // Row start
  w: number; // Width in columns (1-12)
  h: number; // Height in grid units
}

/**
 * A module instance on a dashboard
 */
export interface ModuleInstance {
  id: string;
  type: string;
  gridPosition: GridPosition;
}

/**
 * A dashboard containing multiple modules
 */
export interface Dashboard {
  id: string;
  name: string;
  modules: ModuleInstance[];
}

/**
 * Module metadata and component definition
 */
export interface DashboardModule {
  type: string;
  displayName: string;
  description: string;
  icon?: ReactNode;
  defaultGridSize: { w: number; h: number };
  component: React.ComponentType<ModuleProps>;
  configPanel?: React.ComponentType<ModuleConfigProps>;
}

/**
 * Props passed to each module component
 */
export interface ModuleProps {
  moduleId: string;
  config?: Record<string, any>;
}

/**
 * Props passed to module config panels
 */
export interface ModuleConfigProps {
  moduleId: string;
  config: Record<string, any>;
  onConfigChange: (config: Record<string, any>) => void;
}

