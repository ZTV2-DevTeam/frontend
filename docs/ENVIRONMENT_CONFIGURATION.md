# Environment Configuration Guide

This guide explains how to configure and use different environments (development, staging, production) with the FTV frontend application.

## 🌍 Environment Overview

The application supports three distinct environments:

- **Development**: Local development with localhost backend
- **Staging**: Testing environment with staging backend
- **Production**: Live production environment

## 📁 Configuration Files

### Environment Files

| File | Purpose | Usage |
|------|---------|-------|
| `.env.local` | Development environment | Used when running `npm run dev` |
| `.env.staging` | Staging environment | Used with `npm run build:staging` |
| `.env.production` | Production environment | Used with `npm run build:production` |
| `.env.example` | Template file | Copy to create new environment files |

### Backend URLs by Environment

| Environment | Backend URL | Description |
|-------------|-------------|-------------|
| Development | `http://localhost:8000` | Local Django backend |
| Staging | `https://api-staging.szlg.info` | Staging server |
| Production | `https://ftvapi.szlg.info` | Live production server |

## 🚀 Usage

### Development

```bash
# Start development server
npm run dev

# Start development with production API (for testing)
npm run dev:prod-api
```

### Staging Build

```bash
# Build for staging environment
npm run build:staging

# Start staging build
npm run start:staging
```

### Production Build

```bash
# Build for production
npm run build:production

# Start production build
npm start
```

## 🔧 Environment Variables

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Main API endpoint | `https://ftvapi.szlg.info` |
| `NEXT_PUBLIC_BACKEND_URL` | Backend admin URL | `https://ftvapi.szlg.info` |
| `NEXT_PUBLIC_NODE_ENV` | Environment type | `production` |

### Optional Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NEXT_PUBLIC_DEBUG` | `false` | Enable debug logging |
| `NEXT_PUBLIC_LOG_LEVEL` | `error` | Log level (debug, info, warn, error) |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Set in files | Contact email |

## 🔍 Environment Detection

The application automatically detects the environment using:

1. `NEXT_PUBLIC_NODE_ENV` (if set)
2. `NODE_ENV` (fallback)
3. Default to 'development'

### Environment-Specific Behavior

#### Development
- ✅ Detailed API logging
- ✅ Debug information in console
- ✅ Error details exposed
- ✅ Hot reloading enabled

#### Staging
- ✅ Moderate logging for testing
- ✅ Some debug information
- ⚠️ Limited error exposure
- ❌ No hot reloading

#### Production
- ❌ Minimal logging
- ❌ No debug information
- ❌ Error details hidden
- ❌ No hot reloading
- ✅ Performance optimized

## 📝 Creating New Environments

1. Copy `.env.example` to `.env.{environment}`
2. Update the variables for your environment
3. Add build script to `package.json`:
   ```json
   "build:myenv": "cross-env NODE_ENV=production NEXT_PUBLIC_NODE_ENV=myenv next build"
   ```

## 🛠️ Configuration System

### Core Configuration (`lib/config.ts`)

The configuration system provides:

- **Environment Detection**: Automatic environment type detection
- **API Configuration**: Environment-specific API settings
- **Debug Configuration**: Logging and debug controls
- **Backend Configuration**: Admin and API URL management

### Key Functions

```typescript
// Get current environment
const env = getCurrentEnvironment(); // 'development' | 'staging' | 'production'

// Check if development
const isDev = isDevelopment();

// Get API configuration
const apiConfig = getApiConfig();

// Get debug settings
const debugConfig = getDebugConfig();
```

## 🐛 Debugging

### Debug Mode

Enable debug mode by setting `NEXT_PUBLIC_DEBUG=true` in your environment file.

Debug mode provides:
- Detailed API request/response logging
- Environment information in console
- Enhanced error messages
- Request timing information

### Log Levels

Set `NEXT_PUBLIC_LOG_LEVEL` to control logging verbosity:

- `debug`: All logs including request/response details
- `info`: General information and API calls
- `warn`: Warnings and important notices
- `error`: Only errors (production default)

## 🔒 Security Considerations

- ❌ Never commit `.env.local`, `.env.staging`, or `.env.production`
- ✅ Always use `.env.example` as a template
- ❌ Don't put sensitive data in environment variables that start with `NEXT_PUBLIC_`
- ✅ Use server-side environment variables for secrets
- ✅ Validate all environment variables at runtime

## 🚨 Troubleshooting

### Common Issues

1. **Wrong Backend URL**
   - Check your `.env` file has the correct `NEXT_PUBLIC_API_URL`
   - Verify the backend server is running

2. **Environment Not Detected**
   - Check `NEXT_PUBLIC_NODE_ENV` is set correctly
   - Restart the development server after changing environment files

3. **Build Fails**
   - Ensure `cross-env` is installed: `npm install --save-dev cross-env`
   - Check all required environment variables are set

4. **API Calls Fail**
   - Enable debug mode: `NEXT_PUBLIC_DEBUG=true`
   - Check console for detailed error messages
   - Verify backend server is accessible

### Debug Commands

```bash
# Check environment detection
npm run dev
# Look for: "🌍 Environment detected: development"

# Test production API in development
npm run dev:prod-api
# Look for: "🔗 Using production API: https://ftvapi.szlg.info"

# Verify staging build
npm run build:staging
# Check build output for environment settings
```

## 📚 Related Files

- `lib/config.ts` - Main configuration system
- `lib/api.ts` - API client with environment-aware logging
- `package.json` - Build scripts for different environments
- `.env.*` files - Environment-specific variables
- `next.config.ts` - Next.js configuration

## 💡 Best Practices

1. **Always test locally first**: Use `npm run dev` before deploying
2. **Use staging for testing**: Deploy to staging before production
3. **Check environment detection**: Verify the correct environment is detected
4. **Enable debug mode when troubleshooting**: Set `NEXT_PUBLIC_DEBUG=true`
5. **Keep environment files in sync**: Update all environments when adding new variables
6. **Document environment changes**: Update this guide when making changes
7. **Use descriptive commit messages**: Include environment changes in commits
