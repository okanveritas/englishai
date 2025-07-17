const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// PWA headers for proper HTTPS simulation
app.use((req, res, next) => {
  // Force HTTPS headers for PWA
  res.setHeader('X-Forwarded-Proto', 'https');
  // PWA cache headers
  if (req.url.endsWith('.js') || req.url.endsWith('.css')) {
    res.setHeader('Cache-Control', 'public, max-age=31536000');
  }
  // Service Worker must be served with correct MIME type
  if (req.url === '/sw.js') {
    res.setHeader('Content-Type', 'application/javascript');
    res.setHeader('Service-Worker-Allowed', '/');
  }
  // Manifest headers
  if (req.url === '/manifest.json') {
    res.setHeader('Content-Type', 'application/manifest+json');
  }
  next();
});

// Serve static files
app.use(express.static(__dirname, {
  setHeaders: (res, path) => {
    if (path.endsWith('sw.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// Serve index.html for all routes (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 AI Destekli Quiz Platform running on port ${PORT}`);
  console.log(`📱 PWA Ready: Open in browser and look for "Install App" prompt`);
});