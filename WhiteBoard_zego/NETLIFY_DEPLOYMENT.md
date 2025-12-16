# Netlify Deployment Checklist

## Frontend Deployment (Netlify)

### Required Files:
- [ ] `netlify.toml` - Build configuration
- [ ] `_redirects` - SPA routing (in public folder)
- [ ] Environment variables setup

### Steps:
1. Build the project: `npm run build`
2. Deploy `dist` folder to Netlify
3. Set build command: `npm run build`
4. Set publish directory: `dist`

### Configuration Files Needed:

**netlify.toml:**
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**public/_redirects:**
```
/*    /index.html   200
```

## Backend Deployment (Separate Service)

### Options:
- [ ] Railway
- [ ] Render
- [ ] Heroku
- [ ] Vercel (serverless functions)

### Backend Requirements:
- [ ] Deploy server.js separately
- [ ] Update Socket.IO CORS origin to frontend URL
- [ ] Set PORT environment variable
- [ ] Update frontend to connect to deployed backend URL

### Frontend Updates for Production:
- [ ] Update Socket.IO client connection URL
- [ ] Add environment variables for API endpoints