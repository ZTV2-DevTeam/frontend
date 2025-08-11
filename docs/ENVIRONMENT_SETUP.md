# FTV Frontend Environment Configuration Documentation

## 📋 Overview

This document provides comprehensive guidance for configuring and managing different environments (development, staging, production) in the FTV frontend application. The system automatically detects environments and configures backend connections, logging, and debugging features accordingly.

## 🎯 Quick Start

### For Developers
1. Copy `.env.example` to `.env.local`
2. Update variables for your local development setup
3. Run `npm run dev` to start development server
4. Visit `http://localhost:3001/environment-test` to verify configuration

### For Deployment
1. Use environment-specific build commands
2. Ensure correct environment variables are set
3. Verify backend connectivity before deployment

## 🌍 Environment Types

| Environment | Backend URL | Purpose | Logging Level |
|-------------|-------------|---------|---------------|
| **Development** | `http://localhost:8000` | Local development with Django backend | `debug` (full logging) |
| **Staging** | `https://api-staging.szlg.info` | Testing and QA environment | `info` (moderate logging) |
| **Production** | `https://ftvapi.szlg.info` | Live production deployment | `error` (minimal logging) |

## 📁 Configuration Files Structure

```
FTV/frontend/
├── .env.local          # Development environment (gitignored)
├── .env.staging        # Staging environment (gitignored)
├── .env.production     # Production environment (gitignored)
├── .env.example        # Template file with all variables
├── lib/
│   └── config.ts       # Main configuration system
└── docs/
    └── ENVIRONMENT_SETUP.md  # This file
```

## ⚙️ Environment Variables Reference

### Core Variables

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | ✅ | Main API endpoint URL | `https://ftvapi.szlg.info` |
| `NEXT_PUBLIC_BACKEND_URL` | ✅ | Django admin backend URL | `https://ftvapi.szlg.info` |
| `NEXT_PUBLIC_NODE_ENV` | ❌ | Override environment detection | `production` |

### Debug & Logging Variables

| Variable | Default | Description | Values |
|----------|---------|-------------|--------|
| `NEXT_PUBLIC_DEBUG` | `false` | Enable debug mode | `true`/`false` |
| `NEXT_PUBLIC_LOG_LEVEL` | `error` | Logging verbosity | `debug`, `info`, `warn`, `error` |

### Contact & Organization Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_CONTACT_EMAIL` | Primary contact email | `balla.botond.23f@szlgbp.hu` |
| `NEXT_PUBLIC_DEVELOPER_EMAIL` | Developer contact | `balla.botond.23f@szlgbp.hu` |
| `NEXT_PUBLIC_SUPPORT_EMAIL` | Support contact | `balla.botond.23f@szlgbp.hu` |
| `NEXT_PUBLIC_EMERGENCY_CONTACT` | Emergency contact | `balla.botond.23f@szlgbp.hu` |
| `NEXT_PUBLIC_ORG_NAME` | Organization name | `FTV` |
| `NEXT_PUBLIC_WEBSITE_URL` | Website URL | `https://ftv.szlg.info` |

## 🚀 Usage Instructions

### Development Environment

#### Standard Development (Local Backend)
```bash
# Start development server with localhost backend
npm run dev

# Automatically uses:
# - API URL: http://localhost:8000
# - Full debug logging enabled
# - Environment: development
```

#### Development with Production API
```bash
# Test against production API while developing
npm run dev:prod-api

# Uses production backend but with development features:
# - API URL: https://ftvapi.szlg.info
# - Debug logging enabled
# - Hot reloading active
```

### Staging Environment

```bash
# Build for staging
npm run build:staging

# Start staging build
npm run start:staging

# Configuration:
# - API URL: https://api-staging.szlg.info
# - Moderate logging (info level)
# - Production optimizations
```

### Production Environment

```bash
# Build for production
npm run build:production

# Start production build
npm start

# Configuration:
# - API URL: https://ftvapi.szlg.info
# - Minimal logging (error level only)
# - Full optimizations
```

## 🔧 Environment Configuration System

### Automatic Environment Detection

The system detects environments using this priority:

1. `NEXT_PUBLIC_NODE_ENV` environment variable
2. `NODE_ENV` environment variable  
3. Defaults to `'development'`

### Configuration Objects

#### API_CONFIG
```typescript
export const API_CONFIG = {
  BASE_URL: string,           // API endpoint URL
  IS_DEVELOPMENT: boolean,    // Development flag
  IS_PRODUCTION: boolean,     // Production flag
  IS_STAGING: boolean,        // Staging flag
  ENVIRONMENT: string,        // Current environment name
  DEBUG: boolean,            // Debug mode flag
  LOG_LEVEL: string,         // Logging level
  ENDPOINTS: object          // API endpoint paths
}
```

#### BACKEND_CONFIG
```typescript
export const BACKEND_CONFIG = {
  BASE_URL: string,                    // Backend URL
  ADMIN_BASE_PATH: string,            // Django admin path
  getAdminUrl: (path: string) => string  // Generate admin URLs
}
```

#### DEBUG_CONFIG
```typescript
export const DEBUG_CONFIG = {
  ENABLED: boolean,        // Debug mode enabled
  LOG_LEVEL: string,       // Current log level
  LOG_API_CALLS: boolean,  // Log API requests
  DETAILED_ERRORS: boolean // Show detailed errors
}
```

#### ENV_UTILS
```typescript
export const ENV_UTILS = {
  isDevelopment: () => boolean,      // Check if development
  isProduction: () => boolean,       // Check if production
  isStaging: () => boolean,          // Check if staging
  getCurrentEnvironment: () => string, // Get current environment
  getApiUrl: () => string,           // Get API URL
  getBackendUrl: () => string        // Get backend URL
}
```

## 🔍 Environment Testing

### Built-in Test Page

Visit `/environment-test` to verify your configuration:

- **Environment Detection**: Shows current environment and flags
- **API Configuration**: Displays API and backend URLs
- **Debug Settings**: Shows logging and debug configuration
- **Environment Variables**: Lists current variable values
- **API Test Links**: Quick access to test API integration

### Console Logging

In development, the configuration system logs startup information:

```
🔧 Environment Configuration: {
  environment: 'development',
  apiUrl: 'http://localhost:8000',
  backendUrl: 'http://localhost:8000',
  debug: true,
  logLevel: 'debug'
}
```

## 📊 API Logging System

### Development Logging
- ✅ Full request/response logging
- ✅ Request timing information
- ✅ Environment context
- ✅ Detailed error messages

### Staging Logging  
- ✅ Basic request logging
- ✅ Response status logging
- ❌ Request/response bodies
- ⚠️ Limited error details

### Production Logging
- ❌ No request/response logging
- ✅ Error logging only
- ❌ No debug information
- 🔒 Security-focused minimal logging

## 🛠️ Setup Instructions

### 1. Environment File Setup

#### For Development (.env.local)
```env
# Development Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_NODE_ENV=development
NEXT_PUBLIC_DEBUG=true
NEXT_PUBLIC_LOG_LEVEL=debug

# Contact Information
NEXT_PUBLIC_CONTACT_EMAIL=your-dev-email@domain.com
NEXT_PUBLIC_ORG_NAME=FTV Dev
NEXT_PUBLIC_WEBSITE_URL=http://localhost:3000
```

#### For Staging (.env.staging)
```env
# Staging Configuration
NEXT_PUBLIC_API_URL=https://api-staging.szlg.info
NEXT_PUBLIC_BACKEND_URL=https://api-staging.szlg.info
NEXT_PUBLIC_NODE_ENV=staging
NEXT_PUBLIC_DEBUG=true
NEXT_PUBLIC_LOG_LEVEL=info

# Contact Information
NEXT_PUBLIC_CONTACT_EMAIL=staging@szlgbp.hu
NEXT_PUBLIC_ORG_NAME=FTV Staging
NEXT_PUBLIC_WEBSITE_URL=https://staging.ftv.szlg.info
```

#### For Production (.env.production)
```env
# Production Configuration
NEXT_PUBLIC_API_URL=https://ftvapi.szlg.info
NEXT_PUBLIC_BACKEND_URL=https://ftvapi.szlg.info
NEXT_PUBLIC_NODE_ENV=production
NEXT_PUBLIC_DEBUG=false
NEXT_PUBLIC_LOG_LEVEL=error

# Contact Information
NEXT_PUBLIC_CONTACT_EMAIL=balla.botond.23f@szlgbp.hu
NEXT_PUBLIC_ORG_NAME=FTV
NEXT_PUBLIC_WEBSITE_URL=https://ftv.szlg.info
```

### 2. Package Dependencies

Ensure these dependencies are installed:

```json
{
  "devDependencies": {
    "cross-env": "^7.0.3"
  }
}
```

Install if missing:
```bash
npm install --save-dev cross-env
```

### 3. Build Scripts Configuration

The following scripts are configured in `package.json`:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "dev:prod-api": "cross-env NEXT_PUBLIC_API_URL=https://ftvapi.szlg.info NEXT_PUBLIC_BACKEND_URL=https://ftvapi.szlg.info next dev --turbopack",
    "build": "next build",
    "build:staging": "cross-env NODE_ENV=production NEXT_PUBLIC_NODE_ENV=staging next build",
    "build:production": "cross-env NODE_ENV=production NEXT_PUBLIC_NODE_ENV=production next build",
    "start": "next start",
    "start:staging": "cross-env NODE_ENV=production NEXT_PUBLIC_NODE_ENV=staging next start"
  }
}
```

## 🚨 Troubleshooting

### Common Issues

#### 1. Wrong Backend URL
**Symptoms**: API calls fail, network errors
**Solutions**:
- Check `NEXT_PUBLIC_API_URL` in your environment file
- Verify backend server is running and accessible
- Test backend URL directly in browser

#### 2. Environment Not Detected Correctly
**Symptoms**: Wrong environment shown in test page
**Solutions**:
- Check `NEXT_PUBLIC_NODE_ENV` is set correctly
- Restart development server after changing environment files
- Clear browser cache and restart

#### 3. Build Fails
**Symptoms**: Build process errors, missing dependencies
**Solutions**:
- Install `cross-env`: `npm install --save-dev cross-env`
- Check all required environment variables are set
- Verify environment file syntax

#### 4. API Logging Not Working
**Symptoms**: No console logs, missing debug information
**Solutions**:
- Set `NEXT_PUBLIC_DEBUG=true` in environment file
- Check log level: `NEXT_PUBLIC_LOG_LEVEL=debug`
- Open browser developer console
- Restart development server

### Debug Commands

```bash
# Check current environment detection
npm run dev
# Look for: "🔧 Environment Configuration:"

# Test with production API
npm run dev:prod-api
# Verify API URL in console logs

# Build and test staging
npm run build:staging
npm run start:staging
# Check build output for environment

# Test environment page
# Visit: http://localhost:3001/environment-test
```

## 🔒 Security Considerations

### Environment Variables
- ❌ **Never commit `.env.local`, `.env.staging`, or `.env.production`**
- ✅ Always use `.env.example` as template
- ❌ Don't put secrets in `NEXT_PUBLIC_*` variables (they're exposed to browser)
- ✅ Use server-side environment variables for sensitive data

### Logging Security
- 🔒 Production logging is minimal to prevent data exposure
- ⚠️ Staging logs may contain request data - monitor access
- 🔍 Development logs contain full details - never deploy with debug enabled

### Backend URLs
- ✅ Use HTTPS in staging and production
- ✅ Validate backend SSL certificates
- ⚠️ Localhost only acceptable in development

## 📚 Related Files

| File | Purpose | Description |
|------|---------|-------------|
| `lib/config.ts` | Main configuration | Environment detection and API configuration |
| `lib/api.ts` | API client | Environment-aware HTTP client with logging |
| `components/environment-test.tsx` | Testing component | Environment configuration test page |
| `app/environment-test/page.tsx` | Test route | Environment test page route |
| `package.json` | Build scripts | Environment-specific build commands |
| `.env.example` | Template | Environment variable template |

## 💡 Best Practices

### Development
1. **Always test locally first** before deploying
2. **Use environment test page** to verify configuration
3. **Enable debug mode** when troubleshooting
4. **Check console logs** for environment detection
5. **Test API connections** after environment changes

### Staging
1. **Test full deployment workflow** before production
2. **Verify all environment variables** are set correctly
3. **Test with realistic data** similar to production
4. **Monitor logs** for any configuration issues
5. **Validate backend connectivity** from staging environment

### Production
1. **Minimize logging** for security and performance
2. **Use HTTPS only** for all backend connections
3. **Monitor error logs** for configuration issues
4. **Test deployment process** in staging first
5. **Keep environment files secure** and version controlled separately

### General
1. **Document environment changes** in this file
2. **Keep `.env.example` updated** with new variables
3. **Use descriptive commit messages** for environment changes
4. **Test all environments** when adding new features
5. **Review security implications** of new environment variables

## 🔄 Deployment Workflow

### Recommended Deployment Process

1. **Development**
   ```bash
   # Develop with local backend
   npm run dev
   
   # Test with production API
   npm run dev:prod-api
   ```

2. **Testing**
   ```bash
   # Build and deploy to staging
   npm run build:staging
   npm run start:staging
   ```

3. **Production**
   ```bash
   # Build and deploy to production
   npm run build:production
   npm start
   ```

### Environment Promotion

- **Dev → Staging**: Test features with staging backend
- **Staging → Production**: Validate full deployment with production backend
- **Rollback**: Keep previous builds for quick rollback if needed

---

## 📞 Support

For issues with environment configuration:

- **Developer**: balla.botond.23f@szlgbp.hu
- **Documentation**: This file and `ENVIRONMENT_CONFIGURATION.md`
- **Test Page**: `/environment-test` for configuration verification
- **Debug Mode**: Enable `NEXT_PUBLIC_DEBUG=true` for detailed logging

---

*Last updated: August 11, 2025*
*FTV Frontend Environment Configuration v2.0*
