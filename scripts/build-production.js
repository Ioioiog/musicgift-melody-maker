
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// This script ensures the production build uses the correct HTML structure
// It removes development-specific scripts and ensures proper asset references

const buildDir = path.join(__dirname, '..', 'dist');
const indexPath = path.join(buildDir, 'index.html');

if (fs.existsSync(indexPath)) {
  let html = fs.readFileSync(indexPath, 'utf8');
  
  // Remove any hardcoded asset references that might cause 404s
  html = html.replace(/src="\/src\/main\.tsx"/g, '');
  
  // Ensure proper meta tags for production
  if (!html.includes('og:image')) {
    html = html.replace(
      '<meta property="og:image" content="https://www.musicgift.ro/uploads/logo.png" />',
      '<meta property="og:image" content="https://www.musicgift.ro/uploads/logo_musicgift.webp" />'
    );
  }
  
  // Write the cleaned up HTML back
  fs.writeFileSync(indexPath, html, 'utf8');
  console.log('✅ Production HTML cleaned up successfully');
} else {
  console.log('⚠️ No built index.html found - build may have failed');
}
