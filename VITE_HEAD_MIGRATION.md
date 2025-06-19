# Vite Head Management Migration Guide

## ✅ Completed Changes

### Dependencies Removed
- ✅ `react-helmet-async` - Removed
- ✅ `@headlessui/react` - Removed (if was present)
- ✅ `react-helmet` - Removed (if was present)

### New Files Created
- ✅ `src/utils/headManager.js` - Core head management utilities
- ✅ `src/components/SEO.jsx` - Enhanced SEO component with Vite head management
- ✅ `src/hooks/useHead.js` - Custom hooks for easier head management

## 🔄 Migration Steps Required

### 1. Remove Helmet Imports
Replace helmet imports with the new SEO component:

```jsx
// OLD - Remove these
import { Helmet, HelmetProvider } from 'react-helmet-async'

// NEW - Use these instead
import SEO from '@/components/SEO'
import { useHead } from '@/hooks/useHead'
```

### 2. Update App.jsx
Remove HelmetProvider wrapper:

```jsx
// OLD - Remove this
function App() {
  return (
    <HelmetProvider>
      <div className="App">
        {/* your app */}
      </div>
    </HelmetProvider>
  )
}

// NEW - No provider needed
function App() {
  return (
    <div className="App">
      <SEO /> {/* Add default SEO */}
      {/* your app */}
    </div>
  )
}
```

### 3. Replace Helmet Usage

#### Option A: Use SEO Component
```jsx
// OLD
<Helmet>
  <title>Article Title | Site</title>
  <meta name="description" content="Article description" />
</Helmet>

// NEW
<SEO 
  title="Article Title"
  description="Article description"
  article={articleData} // for articles
/>
```

#### Option B: Use useHead Hook
```jsx
// NEW - For simple cases
import { useHead } from '@/hooks/useHead'

function MyComponent() {
  useHead({
    title: 'Page Title',
    description: 'Page description',
    keywords: 'keyword1, keyword2'
  })
  
  return <div>Your content</div>
}
```

#### Option C: Direct Utility Usage
```jsx
// NEW - For complex cases
import { updateTitle, updateMetaTag } from '@/utils/headManager'

useEffect(() => {
  updateTitle('Dynamic Title')
  updateMetaTag('description', 'Dynamic description')
}, [someData])
```

### 4. Article Pages
For article/news pages, use the enhanced SEO component:

```jsx
<SEO 
  title={article.title}
  description={article.excerpt}
  image={article.image}
  url={article.url}
  type="article"
  article={{
    pubDate: article.publishedAt,
    source: article.source,
    category: article.category,
    tags: article.tags
  }}
/>
```

## 📚 Available Utilities

### Head Manager Functions
```javascript
import { 
  updateTitle,
  updateMetaTag,
  updateLinkTag,
  updateStructuredData,
  removeMetaTag,
  cleanupMetaTags
} from '@/utils/headManager'
```

### Custom Hooks
```javascript
import { useHead, useArticleHead } from '@/hooks/useHead'
```

## 🔧 Benefits of Migration

### Performance
- ✅ No additional bundle size from helmet
- ✅ Direct DOM manipulation (faster)
- ✅ Better tree-shaking

### Features
- ✅ Enhanced structured data support
- ✅ Better article meta tag support
- ✅ Automatic Open Graph optimization
- ✅ Twitter Card optimization

### Flexibility
- ✅ Granular control over head management
- ✅ Easy cleanup for SPA navigation
- ✅ Custom hooks for specific use cases

## 🐛 Troubleshooting

### SEO Not Working
1. Check that SEO component is imported correctly
2. Verify the @ alias is working (`jsconfig.json`)
3. Check browser dev tools for meta tags

### Missing Meta Tags
1. Use browser dev tools to inspect `<head>`
2. Check console for JavaScript errors
3. Verify `updateMetaTag` calls are working

### Structured Data Issues
1. Test with [Google Rich Results Tester](https://search.google.com/test/rich-results)
2. Check JSON-LD in page source
3. Verify `updateStructuredData` calls

## 📁 File Structure After Migration

```
src/
├── components/
│   ├── SEO.jsx           # Main SEO component
│   └── ...
├── hooks/
│   ├── useHead.js        # Head management hooks
│   └── ...
├── utils/
│   ├── headManager.js    # Core utilities
│   └── ...
└── ...
```

## 🚀 Next Steps

1. **Test the migration**: `npm run dev`
2. **Update helmet usage**: Check files with `.helmet-backup` extension
3. **Verify SEO**: Test meta tags in browser dev tools
4. **Check structured data**: Use Google Rich Results Tester
5. **Remove backups**: Once migration is complete

## 📊 SEO Checklist

- [ ] Page titles are working
- [ ] Meta descriptions are set
- [ ] Open Graph tags are present
- [ ] Twitter Cards are working
- [ ] Structured data is valid
- [ ] Canonical URLs are set
- [ ] Article meta tags work
- [ ] No console errors
