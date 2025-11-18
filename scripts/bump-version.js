#!/usr/bin/env node

/**
 * Bumps the version in package.json following semantic versioning (semver)
 * Usage:
 *   node scripts/bump-version.js patch   (0.1.0 -> 0.1.1)
 *   node scripts/bump-version.js minor   (0.1.0 -> 0.2.0)
 *   node scripts/bump-version.js major   (0.1.0 -> 1.0.0)
 */

const fs = require('fs');
const path = require('path');

const packageJsonPath = path.join(process.cwd(), 'package.json');
const bumpType = process.argv[2]?.toLowerCase();

if (!bumpType || !['patch', 'minor', 'major'].includes(bumpType)) {
  console.error('Usage: node scripts/bump-version.js <patch|minor|major>');
  console.error('\nExamples:');
  console.error('  node scripts/bump-version.js patch   # 0.1.0 -> 0.1.1');
  console.error('  node scripts/bump-version.js minor   # 0.1.0 -> 0.2.0');
  console.error('  node scripts/bump-version.js major   # 0.1.0 -> 1.0.0');
  process.exit(1);
}

try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
  const currentVersion = packageJson.version;
  
  // Parse version (e.g., "0.1.0" -> [0, 1, 0])
  const versionParts = currentVersion.split('.').map(Number);
  if (versionParts.length !== 3 || versionParts.some(isNaN)) {
    throw new Error(`Invalid version format: ${currentVersion}`);
  }
  
  let [major, minor, patch] = versionParts;
  
  // Bump according to type
  switch (bumpType) {
    case 'patch':
      patch += 1;
      break;
    case 'minor':
      minor += 1;
      patch = 0;
      break;
    case 'major':
      major += 1;
      minor = 0;
      patch = 0;
      break;
  }
  
  const newVersion = `${major}.${minor}.${patch}`;
  
  // Update package.json
  packageJson.version = newVersion;
  fs.writeFileSync(
    packageJsonPath,
    JSON.stringify(packageJson, null, 2) + '\n',
    'utf-8'
  );
  
  console.log(`✓ Bumped version: ${currentVersion} -> ${newVersion}`);
  console.log(`  Run 'pnpm sync-version' to update lib/constants/version.ts`);
  
} catch (error) {
  console.error('Error bumping version:', error.message);
  process.exit(1);
}

