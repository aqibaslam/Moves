// Metro config for a pnpm monorepo.
//
// Two things are non-obvious and both are required:
//  1. watchFolders must include the repo root, or edits to packages/* won't
//     trigger a reload.
//  2. nodeModulesPaths must list BOTH the app's and the root's node_modules.
//     pnpm's symlinked store means the default single-path resolution misses
//     hoisted dependencies.
const { getDefaultConfig } = require('expo/metro-config');
const path = require('node:path');

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [workspaceRoot];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
];

// pnpm uses symlinks throughout; Metro must follow them.
config.resolver.unstable_enableSymlinks = true;
config.resolver.disableHierarchicalLookup = true;

module.exports = config;
