# i18n Redirect Loop Fix Report

**Project:** raddah.net (Astro Blog)  
**Version:** 1.0  
**Date:** 2026-05-31  
**Branch:** astro  
**Author:** opencode  

---

## Executive Summary

This report documents the investigation and resolution of a critical bug affecting the English version of the Projects and About pages on the raddah.net Astro blog. The issue was caused by self-referencing redirect rules in the Cloudflare Pages `_redirects` file, which created infinite redirect loops preventing users from accessing these pages.

---

## Problem Description

### Symptoms
- English version of `/en/projects/` page was inaccessible
- English version of `/en/about/` page was inaccessible
- Users experienced infinite redirect loops or browser errors when attempting to access these pages
- Arabic (`/ar/projects/`, `/ar/about/`) and Chinese (`/zh/projects/`, `/zh/about/`) versions worked correctly

### User Impact
- English-speaking visitors could not access the Projects or About pages
- SEO impact due to redirect loops
- Poor user experience for international audience

---

## Investigation Process

### 1. Codebase Structure Analysis

**Project Architecture:**
- **Framework:** Astro 5.18.1
- **Deployment:** Cloudflare Pages
- **i18n Strategy:** Directory-based routing with locale prefixes
- **Supported Locales:** Arabic (ar), English (en), Chinese (zh)
- **Default Locale:** Arabic (ar)

**Directory Structure:**
```
src/
├── pages/
│   ├── ar/
│   │   ├── about.astro
│   │   ├── projects.astro
│   │   └── ...
│   ├── en/
│   │   ├── about.astro
│   │   ├── projects.astro
│   │   └── ...
│   ├── zh/
│   │   ├── about.astro
│   │   ├── projects.astro
│   │   └── ...
│   └── index.astro (redirects to /ar/)
├── i18n/
│   ├── index.ts (locale configuration)
│   └── ui.ts (translation strings)
├── layouts/
│   ├── BaseLayout.astro
│   └── PageLayout.astro
└── components/
    └── global/
        ├── Header.astro
        ├── Footer.astro
        └── LanguageSwitcher.astro
```

### 2. Build Verification

**Build Command:** `npm run build`

**Build Output:**
- All pages built successfully (28 pages total)
- English pages generated correctly:
  - `/en/about/index.html`
  - `/en/projects/index.html`
- No build errors or warnings
- HTML structure and content verified as correct

**Conclusion:** The Astro build process was functioning correctly. The issue was not in the source code or build pipeline.

### 3. Configuration Review

**astro.config.mjs:**
```javascript
i18n: {
  defaultLocale: 'ar',
  locales: ['ar', 'en', 'zh'],
  routing: {
    prefixDefaultLocale: true,
    redirectToDefaultLocale: true,
  },
},
build: {
  format: 'directory',
  assets: '_assets',
},
```

**Analysis:** Configuration was correct and consistent with the directory structure.

### 4. Redirect Rules Analysis

**File:** `public/_redirects`

This file is used by Cloudflare Pages to handle URL redirects. It's copied to the `dist/` folder during build and processed by Cloudflare's edge network.

**Original Content (BUGGY):**
```
# Hugo → Astro URL redirects (preserving your old URLs)
/back-again/               /ar/blog/back-again/      301
/en/back-again/            /en/blog/back-again/      301
/projects/                 /ar/projects/             301
/about/                    /ar/about/                301
/en/about/                 /en/about/                301    ← BUG
/en/projects/              /en/projects/             301    ← BUG
/search/                   /ar/                      301
/en/search/                /en/                      301

# Legacy RSS
/index.xml                 /ar/rss.xml               301
/en/index.xml              /en/rss.xml               301

# Root → Arabic
/                          /ar/                      301
```

---

## Root Cause Analysis

### The Bug

Lines 6 and 7 of the `_redirects` file contained self-referencing redirect rules:

```
/en/about/                 /en/about/                301
/en/projects/              /en/projects/             301
```

These rules instructed Cloudflare Pages to redirect:
- `/en/about/` → `/en/about/` (same URL)
- `/en/projects/` → `/en/projects/` (same URL)

### Why This Caused Infinite Loops

1. User requests `/en/projects/`
2. Cloudflare Pages checks `_redirects` file
3. Finds rule: `/en/projects/` → `/en/projects/` (301 redirect)
4. Sends 301 redirect response to browser with Location: `/en/projects/`
5. Browser follows redirect to `/en/projects/`
6. Cloudflare Pages checks `_redirects` file again
7. Finds same rule and sends another 301 redirect
8. Loop continues indefinitely until browser gives up with "too many redirects" error

### Why Arabic and Chinese Worked

The `_redirects` file did not contain self-referencing rules for:
- `/ar/projects/` or `/ar/about/`
- `/zh/projects/` or `/zh/about/`

These paths were served directly from the built static files without any redirect interference.

### Why These Rules Existed

The rules were likely added during the migration from Hugo to Astro as placeholder redirects, but were incorrectly configured. The intent may have been to:
- Preserve old Hugo URLs
- Redirect legacy paths to new Astro paths

However, since `/en/projects/` and `/en/about/` are valid Astro routes that exist in the build output, they should never have redirect rules pointing to themselves.

---

## Solution

### Fix Applied

**Removed the self-referencing redirect rules from `public/_redirects`:**

```diff
# Hugo → Astro URL redirects (preserving your old URLs)
/back-again/               /ar/blog/back-again/      301
/en/back-again/            /en/blog/back-again/      301
/projects/                 /ar/projects/             301
/about/                    /ar/about/                301
-/en/about/                 /en/about/                301
-/en/projects/              /en/projects/             301
/search/                   /ar/                      301
/en/search/                /en/                      301

# Legacy RSS
/index.xml                 /ar/rss.xml               301
/en/index.xml              /en/rss.xml               301

# Root → Arabic
/                          /ar/                      301
```

### Verification

1. **Rebuilt the project:** `npm run build`
2. **Verified `_redirects` in dist/:** Confirmed the buggy rules were removed
3. **Checked built pages:** `/en/projects/index.html` and `/en/about/index.html` exist and are valid

### Expected Behavior After Fix

- `/en/projects/` → Serves the English projects page directly
- `/en/about/` → Serves the English about page directly
- `/projects/` → Redirects to `/ar/projects/` (Arabic, as intended)
- `/about/` → Redirects to `/ar/about/` (Arabic, as intended)

---

## Technical Details

### Cloudflare Pages Redirect Syntax

The `_redirects` file uses the following syntax:
```
/source-path    /destination-path    status-code
```

- **301:** Permanent redirect (cached by browsers and search engines)
- **302:** Temporary redirect
- **200:** Proxy/rewrite (serves content from destination without redirect)

### Astro Build Output Structure

With `build.format: 'directory'`, Astro generates:
```
dist/
├── en/
│   ├── about/
│   │   └── index.html
│   ├── projects/
│   │   └── index.html
│   └── ...
├── ar/
│   ├── about/
│   │   └── index.html
│   ├── projects/
│   │   └── index.html
│   └── ...
└── _redirects
```

Cloudflare Pages serves these static files and applies redirect rules from `_redirects` before serving.

### Redirect Priority

Cloudflare Pages processes redirects in the following order:
1. Exact path matches
2. Wildcard/splat patterns
3. Static files in the build output

Since `/en/projects/` and `/en/about/` exist as static files, they should be served directly without any redirect rules.

---

## Lessons Learned

### 1. Redirect Rules Should Never Point to Themselves

Self-referencing redirects create infinite loops. Always verify that source and destination paths are different.

### 2. Test Redirect Rules Before Deployment

Use tools like `curl -I` or browser developer tools to test redirect behavior:
```bash
curl -I https://raddah.net/en/projects/
```

Look for:
- `HTTP/2 200` (success)
- `HTTP/2 301` or `302` (redirect - check Location header)
- Multiple 301 responses (indicates a loop)

### 3. Separate Legacy Redirects from Active Routes

Maintain clear documentation of which paths are:
- **Legacy:** Old URLs that need to redirect to new locations
- **Active:** Current URLs that should serve content directly

### 4. Use Automated Testing

Add redirect validation to CI/CD pipeline:
```bash
# Example test script
for path in /en/projects/ /en/about/ /ar/projects/ /ar/about/; do
  status=$(curl -o /dev/null -s -w "%{http_code}" "https://raddah.net$path")
  if [ "$status" != "200" ]; then
    echo "ERROR: $path returned $status"
    exit 1
  fi
done
```

---

## Recommendations

### Immediate Actions

1. **Deploy the fix:** Merge the `astro` branch into `main` to trigger deployment
2. **Verify in production:** Test all affected URLs after deployment
3. **Clear browser cache:** Users who visited the broken pages may have cached the redirect

### Short-Term Improvements

1. **Add redirect validation script:** Create a pre-deployment check that validates all redirect rules
2. **Document redirect rules:** Add comments explaining the purpose of each rule
3. **Review all redirect rules:** Audit the entire `_redirects` file for similar issues

### Long-Term Improvements

1. **Implement E2E tests:** Add Playwright or Cypress tests that verify all pages load correctly
2. **Add monitoring:** Set up uptime monitoring for critical pages (Projects, About, Blog)
3. **Use Astro's built-in redirects:** Consider using `astro.config.mjs` redirects instead of `_redirects` file for better type safety

---

## Files Modified

| File | Change | Lines |
|------|--------|-------|
| `public/_redirects` | Removed self-referencing redirect rules | -2 lines |

---

## Testing Checklist

- [ ] `/en/projects/` loads successfully (HTTP 200)
- [ ] `/en/about/` loads successfully (HTTP 200)
- [ ] `/ar/projects/` loads successfully (HTTP 200)
- [ ] `/ar/about/` loads successfully (HTTP 200)
- [ ] `/zh/projects/` loads successfully (HTTP 200)
- [ ] `/zh/about/` loads successfully (HTTP 200)
- [ ] `/projects/` redirects to `/ar/projects/` (HTTP 301)
- [ ] `/about/` redirects to `/ar/about/` (HTTP 301)
- [ ] Language switcher works correctly on all pages
- [ ] Navigation links work correctly
- [ ] No browser console errors
- [ ] Page loads in < 2 seconds

---

## Deployment Instructions

### Option 1: Merge to Main (Recommended)

```bash
git checkout main
git merge astro
git push origin main
```

This will trigger the GitHub Actions workflow (`.github/workflows/deploy.yml`) which:
1. Checks out the code
2. Installs dependencies (`npm ci`)
3. Runs type checking (`npx astro check`)
4. Builds the site (`npm run build`)
5. Deploys to Cloudflare Pages

### Option 2: Direct Push to Main

```bash
git checkout astro
git push origin astro:main
```

### Option 3: Create Pull Request

```bash
gh pr create --base main --head astro --title "Fix: Remove self-referencing redirects for /en/projects/ and /en/about/"
```

---

## Rollback Plan

If issues arise after deployment:

1. **Revert the commit:**
   ```bash
   git revert <commit-hash>
   git push origin main
   ```

2. **Or restore the old `_redirects` file:**
   ```bash
   git checkout HEAD~1 -- public/_redirects
   git commit -m "Revert: Restore old _redirects file"
   git push origin main
   ```

3. **Cloudflare Pages will automatically redeploy** the previous version.

---

## References

- [Cloudflare Pages Redirects Documentation](https://developers.cloudflare.com/pages/platform/redirects/)
- [Astro i18n Documentation](https://docs.astro.build/en/guides/internationalization/)
- [HTTP 301 Redirect Best Practices](https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections)
- [Astro Build Configuration](https://docs.astro.build/en/reference/configuration-reference/#buildformat)

---

## Appendix: Full `_redirects` File (After Fix)

```
# Hugo → Astro URL redirects (preserving your old URLs)
/back-again/               /ar/blog/back-again/      301
/en/back-again/            /en/blog/back-again/      301
/projects/                 /ar/projects/             301
/about/                    /ar/about/                301

/search/                   /ar/                      301
/en/search/                /en/                      301

# Legacy RSS
/index.xml                 /ar/rss.xml               301
/en/index.xml              /en/rss.xml               301

# Root → Arabic
/                          /ar/                      301
```

---

## Conclusion

The English version of the Projects and About pages was broken due to self-referencing redirect rules in the Cloudflare Pages `_redirects` file. The fix involved removing these two problematic lines, allowing Cloudflare Pages to serve the static HTML files directly.

This issue highlights the importance of:
- Careful review of redirect rules
- Automated testing of critical user paths
- Clear documentation of URL routing logic

The fix is minimal, safe, and restores full functionality to the English version of the site.

---

**Report Status:** Complete  
**Next Steps:** Deploy to production and verify in live environment
