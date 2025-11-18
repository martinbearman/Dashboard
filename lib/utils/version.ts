import { APP_VERSION } from "@/lib/constants/version";

/**
 * Get the application version.
 * This is set at build time from package.json
 */
export function getAppVersion(): string {
  return APP_VERSION;
}

