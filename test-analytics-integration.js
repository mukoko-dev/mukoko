// Test script for analytics and search integration
// Run with: node test-analytics-integration.js

console.log('🧪 Testing Analytics and Search Integration')
console.log('==========================================')

// Test 1: Check if components exist
const fs = require('fs')
const path = require('path')

const checkFile = (filePath, description) => {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${description}`)
    return true
  } else {
    console.log(`❌ ${description}`)
    return false
  }
}

console.log('\n📂 File Structure Check:')
checkFile('src/components/SearchPage.jsx', 'SearchPage component')
checkFile('src/components/EnhancedAnalyticsSection.jsx', 'EnhancedAnalyticsSection component')
checkFile('src/hooks/useAnalytics.js', 'useAnalytics hook')

// Test 2: Check for imports and integration
console.log('\n🔗 Integration Check:')

if (fs.existsSync('src/components/SearchPage.jsx')) {
  const searchPageContent = fs.readFileSync('src/components/SearchPage.jsx', 'utf8')
  
  const checks = [
    { pattern: /import.*EnhancedAnalyticsSection/, desc: 'EnhancedAnalyticsSection import' },
    { pattern: /import.*useAnalytics/, desc: 'useAnalytics hook import' },
    { pattern: /trackSearch/, desc: 'Search tracking integration' },
    { pattern: /trackArticleView/, desc: 'Article view tracking' },
    { pattern: /recentSearches/, desc: 'Recent searches support' },
    { pattern: /onKeywordSearch/, desc: 'Keyword search integration' }
  ]
  
  checks.forEach(check => {
    if (check.pattern.test(searchPageContent)) {
      console.log(`✅ ${check.desc}`)
    } else {
      console.log(`❌ ${check.desc}`)
    }
  })
}

console.log('\n🚀 Next Steps:')
console.log('1. Update App.jsx with recentSearches state (see instructions above)')
console.log('2. Test the components: npm run dev')
console.log('3. Deploy: npm run deploy')
console.log('4. Test analytics tracking in browser dev tools')

console.log('\n✅ Integration test completed!')
