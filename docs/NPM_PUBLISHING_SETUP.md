# NPM Auto-Publishing Setup Guide

This guide explains how to set up automated npm publishing for `@sarshay/react-utils` when you push version changes to GitHub.

## How It Works

The GitHub Actions workflow (`.github/workflows/publish.yml`) automatically:

1. **Detects version changes** in `packages/react-utils/package.json`
2. **Builds the package**
3. **Runs tests** (if available)
4. **Publishes to npm**
5. **Creates a GitHub Release** with tag `v{version}`

## Setup Instructions

### 1. Create an NPM Access Token

1. Go to [npmjs.com](https://www.npmjs.com) and log in
2. Click your profile picture → **Access Tokens**
3. Click **Generate New Token** → **Classic Token**
4. Select **Automation** (for CI/CD)
5. Copy the token (you won't see it again!)

### 2. Add NPM Token to GitHub Secrets

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `NPM_TOKEN`
5. Value: Paste your npm access token
6. Click **Add secret**

### 3. Configure Package (Already Done)

The `package.json` should have:
```json
{
  "name": "@sarshay/react-utils",
  "version": "0.1.5",
  "publishConfig": {
    "access": "public"
  }
}
```

✅ Already configured in `packages/react-utils/package.json`

### 4. Test the Workflow

To trigger a publish:

```bash
# 1. Update version
cd packages/react-utils
npm version patch  # or minor, major
# This updates package.json to 0.1.6 (for example)

# 2. Commit and push
git add package.json
git commit -m "chore: bump version to 0.1.6"
git push origin main

# 3. Watch the GitHub Actions workflow
# Go to: https://github.com/sarshay/react-utils/actions
```

## Version Bumping Commands

```bash
cd packages/react-utils

# Patch version (0.1.5 → 0.1.6) - bug fixes
npm version patch

# Minor version (0.1.5 → 0.2.0) - new features
npm version minor

# Major version (0.1.5 → 1.0.0) - breaking changes
npm version major

# Custom version
npm version 1.2.3
```

## What Happens on Push

When you push to `main` branch with a version change:

```
┌─────────────────────────────────────┐
│  Git push to main                   │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│  GitHub Actions detects push        │
└─────────────────┬───────────────────┘
                  │
                  ▼
┌─────────────────────────────────────┐
│  Check if version changed           │
│  (compare HEAD vs HEAD~1)           │
└─────────────────┬───────────────────┘
                  │
        ┌─────────┴─────────┐
        │                   │
   Version changed?    Version same?
        │                   │
        ▼                   ▼
┌──────────────┐     ┌──────────────┐
│ Run publish  │     │ Skip publish │
│ workflow     │     │              │
└──────┬───────┘     └──────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│  1. Setup Node + pnpm               │
│  2. Install dependencies            │
│  3. Build package                   │
│  4. Run tests                       │
│  5. Publish to npm                  │
│  6. Create GitHub Release           │
└─────────────────────────────────────┘
```

## Manual Publishing (Fallback)

If the workflow fails, you can publish manually:

```bash
# Build
pnpm --filter @sarshay/react-utils build

# Test
pnpm --filter @sarshay/react-utils test

# Login to npm (first time only)
npm login

# Publish
cd packages/react-utils
npm publish --access public
```

## Troubleshooting

### "npm ERR! 403 Forbidden"
- Check that your `NPM_TOKEN` secret is set correctly
- Verify the token has publish permissions
- Check if you're logged into the correct npm account

### "npm ERR! 409 Conflict - PUT https://registry.npmjs.org/@sarshay%2freact-utils - You cannot publish over the previously published versions"
- You're trying to publish a version that already exists
- Bump the version in `package.json` first

### Workflow doesn't trigger
- Make sure you're pushing to `main` branch
- Check that `package.json` version actually changed
- Look at GitHub Actions logs: https://github.com/sarshay/react-utils/actions

### Tests fail during publish
- Fix the failing tests locally first
- Run `pnpm --filter @sarshay/react-utils test` to verify
- Push the fixes

## Workflow Configuration

The workflow triggers on:
- Push to `main` branch
- Changes to `packages/react-utils/package.json` or `packages/react-utils/src/**`

To modify the workflow, edit `.github/workflows/publish.yml`

## Best Practices

### 1. Semantic Versioning
Follow [semver](https://semver.org/):
- **Patch** (0.0.x): Bug fixes
- **Minor** (0.x.0): New features (backward compatible)
- **Major** (x.0.0): Breaking changes

### 2. Changelog
Consider maintaining a `CHANGELOG.md`:
```bash
# After bumping version
echo "## [0.1.6] - $(date +%Y-%m-%d)" >> CHANGELOG.md
echo "- Added security protections to useUrlQuery" >> CHANGELOG.md
echo "- Fixed default value merging" >> CHANGELOG.md
```

### 3. Commit Messages
Use conventional commits:
```bash
git commit -m "feat: add replace mode to useUrlQuery"
git commit -m "fix: prevent number overflow in paramsObject"
git commit -m "chore: bump version to 0.1.6"
```

### 4. Test Before Publishing
Always test locally before pushing:
```bash
pnpm --filter @sarshay/react-utils build
pnpm --filter @sarshay/react-utils test
```

## Package Links

- **npm**: https://www.npmjs.com/package/@sarshay/react-utils
- **GitHub**: https://github.com/sarshay/react-utils
- **Docs**: https://sarshay.github.io/react-utils/

## Support

If you encounter issues:
1. Check GitHub Actions logs
2. Review this setup guide
3. Check npm token permissions
4. Verify package.json configuration
