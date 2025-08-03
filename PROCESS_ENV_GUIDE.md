# Process and Environment Variables in Next.js

## 🔍 What is `process` in Next.js?

### 1. **Process Object**
`process` is a **global Node.js object** that provides information about the current Node.js process.

```typescript
// Process is available in both server and client (with limitations)
console.log(process.env);        // Environment variables
console.log(process.platform);  // Operating system
console.log(process.version);    // Node.js version
```

### 2. **Server vs Client Differences**

#### **Server-Side (Node.js environment):**
```typescript
// ✅ Full access to process object
process.env.DATABASE_URL;           // Available
process.env.JWT_SECRET;             // Available
process.env.NEXT_PUBLIC_API_URL;    // Available
process.platform;                  // Available
process.cwd();                      // Available
```

#### **Client-Side (Browser environment):**
```typescript
// ⚠️ Limited access - only NEXT_PUBLIC_ variables
process.env.DATABASE_URL;           // ❌ undefined (security)
process.env.JWT_SECRET;             // ❌ undefined (security)
process.env.NEXT_PUBLIC_API_URL;    // ✅ Available
process.platform;                  // ❌ undefined
```

---

## 🔄 How Next.js Loads Environment Variables

### 1. **Loading Order (Priority)**
Next.js loads environment variables in this order:

```
1. .env.local          (highest priority, gitignored)
2. .env.production     (if NODE_ENV=production)
   .env.staging        (if NODE_ENV=staging)
   .env.development    (if NODE_ENV=development)
3. .env                (lowest priority)
```

### 2. **Variable Types**

#### **Server-Only Variables:**
```bash
# .env file
DATABASE_URL=postgresql://localhost:5432/mydb
JWT_SECRET=super-secret-key
STRIPE_SECRET_KEY=sk_live_...
```

#### **Client-Accessible Variables (NEXT_PUBLIC_ prefix):**
```bash
# .env file
NEXT_PUBLIC_API_URL=https://api.myapp.com
NEXT_PUBLIC_APP_ENV=production
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### 3. **Build-Time vs Runtime**

#### **Build-Time Replacement:**
```typescript
// At build time, Next.js replaces these with actual values
const apiUrl = process.env.NEXT_PUBLIC_API_URL;
// Becomes: const apiUrl = "https://api.myapp.com";
```

#### **Runtime Access (Server-only):**
```typescript
// Server-side: Read at runtime
export async function GET() {
  const dbUrl = process.env.DATABASE_URL; // Read from environment
  // ...
}
```

---

## 🛠️ Practical Examples

### 1. **Environment Detection**
```typescript
// lib/config.ts
export const config = {
  // Environment detection
  env: process.env.NEXT_PUBLIC_APP_ENV || 'development',
  nodeEnv: process.env.NODE_ENV,
  
  // Client-accessible
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
  
  // Server-only (undefined on client)
  databaseUrl: process.env.DATABASE_URL,
};

// Usage
if (config.env === 'development') {
  console.log('Running in development mode');
}
```

### 2. **Conditional Loading**
```typescript
// Only load analytics in production
if (process.env.NEXT_PUBLIC_APP_ENV === 'production') {
  // Initialize Google Analytics
  gtag('config', process.env.NEXT_PUBLIC_GA_ID);
}
```

### 3. **API Configuration**
```typescript
// lib/api.ts
const apiClient = axios.create({
  // This works on both server and client
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  
  // This would be undefined on client
  timeout: process.env.API_TIMEOUT || 10000,
});
```

---

## 🔐 Security Implications

### **What's Safe vs Unsafe:**

#### **✅ Safe for Client (NEXT_PUBLIC_):**
```bash
NEXT_PUBLIC_API_URL=https://api.example.com
NEXT_PUBLIC_APP_VERSION=1.0.0
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

#### **❌ Never expose to client:**
```bash
DATABASE_URL=postgresql://...
JWT_SECRET=secret-key
STRIPE_SECRET_KEY=sk_live_...
PASSWORD=my-password
```

### **Why the NEXT_PUBLIC_ prefix?**
- **Explicit opt-in**: You must intentionally expose variables
- **Build-time replacement**: Values are baked into the client bundle
- **Security by default**: Server secrets stay on server

---

## 🚀 Environment Loading Process

### 1. **Development (`npm run dev`):**
```
1. Loads .env.local (if exists)
2. Loads .env.development
3. Loads .env
4. Sets NODE_ENV=development
```

### 2. **Production Build (`npm run build`):**
```
1. Loads .env.local (if exists)
2. Loads .env.production
3. Loads .env
4. Sets NODE_ENV=production
5. Replaces NEXT_PUBLIC_ variables in bundle
```

### 3. **Custom Environment (with env-cmd):**
```bash
# npm run build:staging
env-cmd -f .env.staging next build

# This:
1. Loads .env.staging first
2. Then follows normal loading order
3. Overrides any conflicting variables
```

---

## 🔍 Debugging Environment Variables

### **Check what's loaded:**
```typescript
// In your component or API route
console.log('Client vars:', {
  env: process.env.NEXT_PUBLIC_APP_ENV,
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
});

// Server-side only
console.log('Server vars:', {
  nodeEnv: process.env.NODE_ENV,
  dbUrl: process.env.DATABASE_URL,
});
```

### **Package.json debug script:**
```json
{
  "scripts": {
    "env:check": "node -e \"console.log('Environment:', process.env.NEXT_PUBLIC_APP_ENV || 'development'); console.log('API URL:', process.env.NEXT_PUBLIC_API_URL);\""
  }
}
```

---

## ⚡ Key Takeaways

1. **`process`** is a Node.js global object
2. **Client** only gets `NEXT_PUBLIC_` variables
3. **Server** gets all environment variables
4. **Build-time** replacement for client variables
5. **Loading order** matters (.env.local wins)
6. **Security** by explicit opt-in with prefix

Your current setup with `lib/config.ts` is perfect for managing this complexity!
