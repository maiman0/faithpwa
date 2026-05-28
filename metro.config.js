const { getDefaultConfig } = require('expo/metro-config');
const { createProxyMiddleware } = require('http-proxy-middleware');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add proxy middleware to the dev server for web
const BACKEND_TARGET = process.env.BACKEND_URL || 'https://endpoint.daythree.ai/faithMobile/routes';

if (config.server) {
  const originalEnhanceMiddleware = config.server.enhanceMiddleware;
  config.server.enhanceMiddleware = (middleware, server) => {
    const enhanced = originalEnhanceMiddleware 
      ? originalEnhanceMiddleware(middleware, server) 
      : middleware;

    return (req, res, next) => {
      // If the request starts with /api, proxy it to the PHP backend
      if (req.url.startsWith('/api')) {
        return createProxyMiddleware({
          target: BACKEND_TARGET,
          changeOrigin: true,
          timeout: 30000, // Wait 30s for the connection
          proxyTimeout: 30000, // Wait 30s for the response
          pathRewrite: {
            '^/api': '', // Remove '/api' from the path before sending to server
          },
          onProxyRes: (proxyRes) => {
            // Ensure CORS headers are present in the response for the browser
            proxyRes.headers['Access-Control-Allow-Origin'] = '*';
            proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS, PUT, DELETE';
            proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With';
          },
          onError: (err, req, res) => {
            console.error('[Proxy Error]:', err.message);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Proxy encountered an error connecting to the backend.');
          }
        })(req, res, next);
      }
      return enhanced(req, res, next);
    };
  };
} else {
  // If config.server is not defined, initialize it
  config.server = {
    enhanceMiddleware: (middleware) => {
      return (req, res, next) => {
        if (req.url.startsWith('/api')) {
          return createProxyMiddleware({
            target: BACKEND_TARGET,
            changeOrigin: true,
            timeout: 30000,
            proxyTimeout: 30000,
            pathRewrite: {
              '^/api': '',
            },
            onProxyRes: (proxyRes) => {
              proxyRes.headers['Access-Control-Allow-Origin'] = '*';
              proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS, PUT, DELETE';
              proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-Requested-With';
            },
            onError: (err, req, res) => {
              console.error('[Proxy Error]:', err.message);
              res.writeHead(500, { 'Content-Type': 'text/plain' });
              res.end('Proxy encountered an error connecting to the backend.');
            }
          })(req, res, next);
        }
        return middleware(req, res, next);
      };
    },
  };
}

module.exports = config;
