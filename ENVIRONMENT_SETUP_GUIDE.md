# Environment Separation for React/Next.js Apps

## 1. 🔧 Environment Variables Setup

### Create Environment Files
```bash
# Root directory structure
.env.local          # Local development (gitignored)
.env.development    # Development environment
.env.staging        # Staging environment  
.env.production     # Production environment
.env.example        # Template file (committed to git)
```

### Example Environment Files:

#### `.env.development`
```bash
# Development Environment
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3001/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
DATABASE_URL=postgresql://user:pass@localhost:5432/myapp_dev
STRIPE_SECRET_KEY=sk_test_...
JWT_SECRET=dev_jwt_secret_key
```

#### `.env.staging`
```bash
# Staging Environment
NEXT_PUBLIC_APP_ENV=staging
NEXT_PUBLIC_API_URL=https://api-staging.myapp.com/api
NEXT_PUBLIC_APP_URL=https://staging.myapp.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
DATABASE_URL=postgresql://user:pass@staging-db:5432/myapp_staging
STRIPE_SECRET_KEY=sk_test_...
JWT_SECRET=staging_jwt_secret_key
```

#### `.env.production`
```bash
# Production Environment
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_API_URL=https://api.myapp.com/api
NEXT_PUBLIC_APP_URL=https://myapp.com
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
DATABASE_URL=postgresql://user:pass@prod-db:5432/myapp_prod
STRIPE_SECRET_KEY=sk_live_...
JWT_SECRET=super_secure_production_jwt_secret
```

#### `.env.example` (Template)
```bash
# Environment Template - Copy to .env.local for development
NEXT_PUBLIC_APP_ENV=
NEXT_PUBLIC_API_URL=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
DATABASE_URL=
STRIPE_SECRET_KEY=
JWT_SECRET=
```

---

## 2. 📝 Update Your API Configuration

### Update `lib/api.ts` to use environment variables:
```typescript
import axios from 'axios';
import { redirect } from 'next/navigation';

// Create axios instance with environment-based URL
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
});

// Add environment info to requests (optional)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add environment header for debugging
    config.headers['X-App-Environment'] = process.env.NEXT_PUBLIC_APP_ENV;
    
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
```

---

## 3. 🔒 Environment-Specific Configuration

### Create a config helper:
```typescript
// lib/config.ts
export const config = {
  env: process.env.NEXT_PUBLIC_APP_ENV || 'development',
  apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api',
  appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  isDev: process.env.NEXT_PUBLIC_APP_ENV === 'development',
  isStaging: process.env.NEXT_PUBLIC_APP_ENV === 'staging',
  isProd: process.env.NEXT_PUBLIC_APP_ENV === 'production',
  
  // Feature flags
  features: {
    analytics: process.env.NEXT_PUBLIC_APP_ENV === 'production',
    debugMode: process.env.NEXT_PUBLIC_APP_ENV === 'development',
    betaFeatures: process.env.NEXT_PUBLIC_APP_ENV === 'staging',
  },
  
  // External services
  stripe: {
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  },
};

// Usage in components:
// import { config } from '@/lib/config';
// if (config.isDev) { console.log('Debug info'); }
```

---

## 4. 🚀 Deployment Strategies

### A. **Vercel Deployment**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to different environments
vercel --prod                 # Production
vercel --env staging          # Staging
vercel                        # Development/Preview
```

**Vercel Environment Setup:**
1. Go to Vercel Dashboard → Project → Settings → Environment Variables
2. Add variables for each environment:
   - Development: Used for preview deployments
   - Preview: Used for branch deployments
   - Production: Used for production deployments

### B. **Netlify Deployment**
```bash
# netlify.toml
[build]
  command = "npm run build"
  publish = ".next"

[build.environment]
  NEXT_PUBLIC_API_URL = "https://api.myapp.com/api"

# Different deploy contexts
[context.production.environment]
  NEXT_PUBLIC_APP_ENV = "production"
  NEXT_PUBLIC_API_URL = "https://api.myapp.com/api"

[context.deploy-preview.environment]
  NEXT_PUBLIC_APP_ENV = "staging"
  NEXT_PUBLIC_API_URL = "https://api-staging.myapp.com/api"

[context.branch-deploy.environment]
  NEXT_PUBLIC_APP_ENV = "development"
  NEXT_PUBLIC_API_URL = "https://api-dev.myapp.com/api"
```

### C. **Docker Deployment**
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Build with environment-specific variables
ARG NEXT_PUBLIC_APP_ENV
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_APP_ENV=$NEXT_PUBLIC_APP_ENV
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL

RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build for different environments
docker build --build-arg NEXT_PUBLIC_APP_ENV=production --build-arg NEXT_PUBLIC_API_URL=https://api.myapp.com/api -t myapp:prod .
docker build --build-arg NEXT_PUBLIC_APP_ENV=staging --build-arg NEXT_PUBLIC_API_URL=https://api-staging.myapp.com/api -t myapp:staging .
```

---

## 5. 📋 Package.json Scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "build:staging": "env-cmd -f .env.staging next build",
    "build:production": "env-cmd -f .env.production next build",
    "start": "next start",
    "deploy:staging": "env-cmd -f .env.staging vercel --env staging",
    "deploy:prod": "env-cmd -f .env.production vercel --prod"
  },
  "devDependencies": {
    "env-cmd": "^10.1.0"
  }
}
```

---

## 6. 🛡️ Security Best Practices

### GitIgnore Setup:
```gitignore
# Environment files
.env.local
.env.*.local

# Keep template and non-sensitive env files
!.env.example
!.env.development
```

### Environment Variable Rules:
1. **NEXT_PUBLIC_**: Client-side accessible (public)
2. **No NEXT_PUBLIC_**: Server-side only (private)
3. **Never commit**: `.env.local`, sensitive keys
4. **Always commit**: `.env.example`, non-sensitive defaults

---

## 7. 🔄 CI/CD Pipeline Example

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches:
      - main        # Production
      - staging     # Staging
      - develop     # Development

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build for Production
        if: github.ref == 'refs/heads/main'
        env:
          NEXT_PUBLIC_APP_ENV: production
          NEXT_PUBLIC_API_URL: https://api.myapp.com/api
        run: npm run build
        
      - name: Build for Staging
        if: github.ref == 'refs/heads/staging'
        env:
          NEXT_PUBLIC_APP_ENV: staging
          NEXT_PUBLIC_API_URL: https://api-staging.myapp.com/api
        run: npm run build
        
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
        if: github.ref == 'refs/heads/main'
```

---

## 8. 🎯 Environment Detection in Code

```tsx
// components/EnvironmentBanner.tsx
import { config } from '@/lib/config';

export function EnvironmentBanner() {
  if (config.isProd) return null;
  
  return (
    <div className={`
      w-full text-center py-2 text-white text-sm font-medium
      ${config.isStaging ? 'bg-yellow-600' : 'bg-red-600'}
    `}>
      🚧 {config.env.toUpperCase()} Environment 🚧
    </div>
  );
}

// Usage in layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <EnvironmentBanner />
        {children}
      </body>
    </html>
  );
}
```

This setup gives you complete environment separation with proper security and deployment strategies!
