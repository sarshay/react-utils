# useUrlQuery v2.0 Upgrade Summary

## 🎉 What Was Done

Your `useUrlQuery` hook has been upgraded from a basic implementation to a production-ready npm package with security hardening, better UX, and automated publishing.

---

## 📦 Files Changed/Created

### Core Hook (Updated)
- ✅ `/packages/react-utils/src/hooks/useUrlQuery.ts` (renamed from `useQuery.ts`)
  - Added security protections (overflow prevention, input validation)
  - Fixed default value merging (merge instead of replace)
  - Added replace mode option
  - Fixed parseInt radix bug
  - Enhanced TypeScript types and documentation

### Documentation (Created/Updated)
- ✅ `/packages/react-utils/src/hooks/useUrlQuery.README.md` - Comprehensive package README
- ✅ `/packages/react-utils/src/hooks/useUrlQuery.test.tsx` - Full test suite with examples
- ✅ `/apps/docs/hooks/use-url-query.md` - Updated user-facing documentation
- ✅ `/docs/NPM_PUBLISHING_SETUP.md` - Setup guide for automated publishing

### CI/CD (Created)
- ✅ `/.github/workflows/publish.yml` - Automated npm publishing workflow

---

## 🔒 Security Improvements

### 1. **Input Length Validation**
```typescript
// Prevents DoS attacks via huge query parameters
if (value.length > 1000) {
  return value; // Don't process, return as-is
}
```

### 2. **Number Overflow Protection**
```typescript
// Only convert safe integers to numbers
if (Number.isSafeInteger(num)) {
  return num;
}
return trimmed; // Keep as string if too large
```

### 3. **Array Index Overflow Prevention**
```typescript
// Prevent memory exhaustion via huge array indices
if (idx >= 0 && idx < 10000) {
  current[idx] = convertValue(value);
}
// Silently ignore indices > 9999
```

### 4. **parseInt Radix Specification**
```typescript
// BEFORE: parseInt(finalKey)        ❌ Potential octal interpretation
// AFTER:  parseInt(finalKey, 10)     ✅ Always base 10
```

---

## 🎯 Feature Improvements

### 1. **Default Value Merging** (Breaking Change!)

**Before:**
```tsx
const [query] = useUrlQuery({ page: 1, limit: 10 });
// URL: ?page=5
// Result: { page: 5 }  ❌ Lost default 'limit'!
```

**After:**
```tsx
const [query] = useUrlQuery({ page: 1, limit: 10 });
// URL: ?page=5
// Result: { page: 5, limit: 10 }  ✅ Defaults preserved!
```

### 2. **Replace Mode**

**New feature** - avoid polluting browser history:

```tsx
// Push to history (default)
setQuery({ page: 2 });

// Replace current entry (no history pollution)
setQuery({ page: 2 }, { replace: true });
```

**Use cases:**
- Tab navigation (don't add each tab switch to history)
- Form field changes (don't spam history with every keystroke)
- Temporary UI state

---

## 📚 Documentation Examples

### Before & After Comparison

| Aspect | Before | After |
|--------|--------|-------|
| Security | None | 4 protection layers |
| Default handling | Replace | Merge |
| Replace mode | ❌ No | ✅ Yes |
| parseInt radix | ❌ Missing | ✅ Fixed |
| Documentation | Basic | Comprehensive |
| Tests | None | 30+ test cases |
| Auto-publish | ❌ Manual | ✅ Automated |

---

## 🚀 Publishing Setup

### Automated NPM Publishing

When you push a version change to `main` branch:
1. GitHub Actions detects the version bump
2. Builds the package
3. Runs tests
4. Publishes to npm
5. Creates a GitHub Release

### Quick Start

```bash
# 1. Set up npm token (one-time)
# - Go to npmjs.com → Access Tokens → Generate Classic Token (Automation)
# - Add to GitHub: Settings → Secrets → New secret: NPM_TOKEN

# 2. Bump version
cd packages/react-utils
npm version patch  # or minor, major

# 3. Commit and push
git add package.json
git commit -m "chore: bump version to 0.1.6"
git push origin main

# 4. Watch it publish automatically! 🎉
# Check: https://github.com/sarshay/react-utils/actions
```

**See `docs/NPM_PUBLISHING_SETUP.md` for detailed instructions.**

---

## 🧪 Testing

A comprehensive test suite has been created in `useUrlQuery.test.tsx` covering:

- ✅ Basic functionality
- ✅ Default value merging
- ✅ Type conversion (number, boolean, null, undefined)
- ✅ Nested objects and arrays
- ✅ Replace mode
- ✅ Security protections
- ✅ SSR safety
- ✅ TypeScript support
- ✅ Real-world use cases

Run tests:
```bash
pnpm --filter @sarshay/react-utils test
```

---

## 📋 Migration Guide for Users

If users are upgrading from v1.x to v2.0:

### Breaking Changes

#### 1. Default Value Behavior Changed

**v1.x behavior:**
```tsx
const [query] = useUrlQuery({ page: 1, limit: 10 });
// URL: ?page=5
// Result: { page: 5 }  // Lost defaults
```

**v2.0 behavior:**
```tsx
const [query] = useUrlQuery({ page: 1, limit: 10 });
// URL: ?page=5
// Result: { page: 5, limit: 10 }  // Defaults merged ✅
```

**Migration:**
- Most cases: No change needed (improvement!)
- If you relied on defaults *only* when URL is empty:
  ```tsx
  // OLD: defaults only when no params
  const [query] = useUrlQuery({ page: 1 });

  // NEW: explicitly check if URL has params
  const hasParams = window.location.search !== '';
  const [query] = useUrlQuery(hasParams ? {} : { page: 1 });
  ```

#### 2. Function Signature Changed

**v1.x:**
```tsx
setQuery(newQuery: T | null)
```

**v2.0:**
```tsx
setQuery(newQuery: T | null, options?: { replace?: boolean })
```

**Migration:**
- Existing code works as-is (backward compatible)
- Optionally add `{ replace: true }` for replace mode

---

## 🎨 Examples Added

New examples in documentation:

1. **Tab Navigation with Replace Mode**
   - Shows how to avoid history pollution

2. **Form State with Replace Mode**
   - Demonstrates replace mode for form fields

3. **Security Examples**
   - Shows how overflow protection works

4. **Default Merging Examples**
   - Demonstrates the new merge behavior

---

## 📊 Package Stats

| Metric | Value |
|--------|-------|
| Package | `@sarshay/react-utils` |
| Current Version | `0.1.5` |
| Next Version | `0.2.0` (recommended for v2.0 features) |
| Bundle Size | ~2KB (estimated) |
| Dependencies | 0 (only peerDeps: React) |
| TypeScript | ✅ Full support |
| SSR | ✅ Safe |

---

## ✅ Next Steps

### 1. Set Up NPM Publishing (5 minutes)
- [ ] Create npm access token
- [ ] Add `NPM_TOKEN` to GitHub secrets
- [ ] Test with a patch version bump

### 2. Bump to v2.0 (2 minutes)
```bash
cd packages/react-utils
npm version minor  # 0.1.5 → 0.2.0 (new features)
# or
npm version major  # 0.1.5 → 1.0.0 (breaking changes)
```

### 3. Create Changelog (5 minutes)
Create `packages/react-utils/CHANGELOG.md`:
```markdown
# Changelog

## [0.2.0] - 2024-XX-XX

### Added
- Security protections (overflow prevention, input validation)
- Replace mode option for setQuery
- Default value merging (preserves defaults for missing keys)

### Fixed
- parseInt radix bug
- Default value handling (now merges instead of replaces)

### Breaking Changes
- Default values now merge with URL params instead of replace
```

### 4. Update Main README (Optional)
Add a "Recent Updates" section to `packages/react-utils/README.md`

### 5. Test & Publish
```bash
# Build
pnpm --filter @sarshay/react-utils build

# Test
pnpm --filter @sarshay/react-utils test

# Commit version bump
git add .
git commit -m "feat: upgrade useUrlQuery to v2.0 with security & UX improvements"
git push origin main

# Watch it auto-publish! 🚀
```

---

## 🔗 Quick Links

- **npm Package**: https://www.npmjs.com/package/@sarshay/react-utils
- **GitHub Repo**: https://github.com/sarshay/react-utils
- **Documentation**: https://sarshay.github.io/react-utils/
- **GitHub Actions**: https://github.com/sarshay/react-utils/actions

---

## 📞 Support

If you need help:
1. Check `docs/NPM_PUBLISHING_SETUP.md` for publishing issues
2. Check `packages/react-utils/src/hooks/useUrlQuery.README.md` for API docs
3. Review test examples in `useUrlQuery.test.tsx`

---

## 🎯 Summary

✅ Hook upgraded with production-ready security
✅ Better UX with default value merging
✅ New replace mode feature
✅ Comprehensive documentation created
✅ Full test suite added
✅ Automated publishing configured
✅ Ready for npm release!

**Your package is now ready to be published as a professional, production-grade npm package! 🚀**
