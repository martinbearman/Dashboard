"use client";

import { getAppVersion } from "@/lib/utils/version";

/**
 * Displays the application version in an unobtrusive footer.
 * Useful for tracking which version is deployed in production.
 */
export default function AppVersion() {
  const version = getAppVersion();

  return (
    <div className="fixed bottom-2 right-2 text-xs text-gray-500 hover:text-gray-600 transition-colors z-50 pointer-events-none">
      <span className="font-mono">v{version}</span>
    </div>
  );
}

