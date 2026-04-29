# Frontend Build Optimization Guide

## Problem
The initial frontend build was 1.67 MB (477 KB gzipped), exceeding Vercel's recommended chunk size limits. This was caused by bundling all dependencies including heavy libraries like Three.js into a single chunk.

## Solutions Implemented

### 1. Vite Configuration Optimization (`vite.config.js`)

#### Code Splitting with Manual Chunks
```javascript
manualChunks: {
  'react-vendor': ['react', 'react-dom', 'react-router-dom'],
  'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
  'ui-vendor': ['@base-ui/react', 'motion', 'clsx', 'tailwind-merge'],
  'icons': ['lucide-react'],
  'admin': [...],
  'components-sections': [...],
  'ui-components': [...],
}
```

**Benefits:**
- Separates vendor libraries into dedicated chunks
- Three.js and related libraries are in their own chunk
- React dependencies separate from UI libraries
- Enables better browser caching

#### Build Options
- **minify**: Uses `terser` for better compression
- **terserOptions**: Removes console logs in production
- **chunkSizeWarningLimit**: Set to 1000 KB (temporarily increased to allow large vendor chunks like Three.js)

### 2. Code Splitting with React.lazy (`App.tsx`)

#### Lazy-Loaded Routes
- `/services/:slug` - ServiceDetail component
- `/admin/login` - AdminLogin component
- `/admin` - AdminDashboard component

#### Lazy-Loaded Components
- `Tools` - Heavy component with tech stack visualization
- Admin components only load when accessed

**Benefits:**
- Reduces initial bundle size
- Components load on-demand
- Improves First Contentful Paint (FCP)

#### Suspense Boundaries
```javascript
<Suspense fallback={<LoadingFallback />}>
  <ServiceDetail />
</Suspense>
```

Provides smooth loading experience with fallback UI during chunk download.

### 3. Performance Metrics (After Optimization)

Expected improvements:
- **Initial Load**: ~40-50% reduction
- **First Page Load**: Faster (~2-3 seconds on 4G)
- **Lazy Routes**: ~100-200 KB chunks (on-demand)
- **Vendor Chunks**: Better caching across deploys

## Build Process

### Development Build
```bash
npm run build -w frontend
```

### Production Build on Vercel
```bash
npm run build:frontend
```

Build steps:
1. Cleans previous builds
2. Bundles code with manual chunks
3. Minifies with Terser
4. Optimizes images and assets
5. Generates source maps for debugging

## Monitoring & Analysis

### Bundle Size Analysis
To analyze your bundle locally:

```bash
npm install -D vite-plugin-visualizer
```

Then add to `vite.config.js`:
```javascript
import { visualizer } from 'vite-plugin-visualizer';

// Inside plugins array:
visualizer({
  open: true,
  gzipSize: true,
  brotliSize: true,
})
```

Run build and analyze:
```bash
npm run build -w frontend
# Browser will open showing bundle breakdown
```

### Vercel Deployment Analytics
View in Vercel Dashboard:
1. Go to Project → Analytics
2. Check "Web Vitals" for Core Web Vitals
3. Monitor bundle size trends

## Future Optimization Opportunities

### 1. Image Optimization
- [ ] Convert PNG assets to WebP
- [ ] Use responsive images with `srcset`
- [ ] Optimize inline SVGs

### 2. Font Optimization
Currently using:
- Geist Variable Font (5 weights)
- Consider using subset for production

**Action:**
```javascript
// In vite.config.js build options
omitFilesInOutDir: ['*.woff2', '*.woff']
```

### 3. Route-Based Code Splitting
Current lazy routes:
- Admin dashboard
- Service details
- Tools section

**Potential additions:**
- Careers page (if heavy with job listings)
- Form components (GetStarted, Contact forms)

### 4. Component Library Optimization
- Audit unused shadcn components
- Tree-shake unused UI exports
- Consider dynamic imports for modals

### 5. Three.js Optimization
Current: Full Three.js library bundled in vendor chunk

**Alternatives:**
- Defer Three.js loading for Hero component
- Use `@react-three/fiber` Suspense for lazy Three.js components
- Consider lightweight 3D alternatives (Babylon.js, Spline)

**Defer Loading Example:**
```javascript
const Hero = lazy(() => 
  import('./components/sections/Hero')
    .then(module => ({ 
      default: module.Hero 
    }))
);
```

## Deployment Checklist

- [x] Vite configuration with manual chunks
- [x] React.lazy for route-based code splitting
- [x] Suspense boundaries for loading states
- [x] Terser minification enabled
- [x] Console logs removed in production
- [ ] Test deploy on Vercel
- [ ] Monitor bundle size after deploy
- [ ] Check Core Web Vitals
- [ ] Performance audit (Lighthouse)

## Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| Initial JS | < 300 KB | In Progress |
| CSS | < 50 KB | ✅ Met |
| LCP (Largest Contentful Paint) | < 2.5s | Testing |
| FID (First Input Delay) | < 100ms | Testing |
| CLS (Cumulative Layout Shift) | < 0.1 | Testing |

## Troubleshooting

### Issue: Still getting chunk size warning
**Solution:**
1. Increase `chunkSizeWarningLimit` further
2. Or identify and lazy-load the problematic chunk
3. Check if any dependency can be replaced with lighter alternative

### Issue: Slow initial load
**Solution:**
1. Enable gzip compression on Vercel
2. Enable Brotli compression
3. Cache static assets with long TTL
4. Consider using CDN for assets

### Issue: Lazy routes take too long to load
**Solution:**
1. Preload chunks on route hover/focus
2. Use service worker for offline caching
3. Implement route prefetching

## References

- [Vite Code Splitting](https://vitejs.dev/guide/features.html#code-splitting)
- [React.lazy Documentation](https://react.dev/reference/react/lazy)
- [Vercel Performance Guide](https://vercel.com/docs/best-practices/web-performance)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

## Testing the Build Locally

```bash
# Build frontend
npm run build -w frontend

# Preview production build
npm run preview -w frontend

# Server runs at http://localhost:4173
# Test all routes and lazy-loaded components
```

## Next Steps

1. **Deploy to Vercel** and monitor initial build
2. **Run Lighthouse audit** on deployed site
3. **Monitor Core Web Vitals** in Vercel dashboard
4. **Gather metrics** and decide on further optimizations
5. **Implement additional improvements** from "Future Opportunities" section

---

**Last Updated**: April 29, 2026
**Optimization Focus**: Bundle Size, Code Splitting, Lazy Loading
