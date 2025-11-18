#!/usr/bin/env node

/**
 * Syncs the version from package.json to lib/constants/version.ts
 * This ensures the version displayed in the app matches package.json
 */

const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(process.cwd(), 'package.json');
const versionFilePath = path.join(process.cwd(), 'lib', 'constants', 'version.ts');

try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const version = packageJson.version;

  const versionFileContent = `/**
 * Application version - generated at build time from package.json
 * This file is updated automatically during the build process
 */
export const APP_VERSION = "${version}";
`;

  fs.writeFileSync(versionFilePath, versionFileContent, 'utf-8');
  console.log(`✓ Synced version ${version} to lib/constants/version.ts`);
} catch (error) {
  console.error('Error syncing version:', error);
  process.exit(1);
}

