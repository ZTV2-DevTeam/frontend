# FTV Frontend - Quick Reference Guide

## 🚀 Essential Commands

```bash
# Development
npm run dev              # Local development (localhost:8000 backend)
npm run dev:prod-api     # Development with production API

# Building & Deployment
npm run build:staging    # Build for staging environment
npm run build:production # Build for production
npm start               # Start production build
npm run start:staging   # Start staging build

# Testing
# Visit: http://localhost:3001/environment-test
```

## 🌍 Environment Quick Setup

### 1. Development Setup (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
NEXT_PUBLIC_NODE_ENV=development
NEXT_PUBLIC_DEBUG=true
NEXT_PUBLIC_LOG_LEVEL=debug
```

### 2. Production Setup (.env.production)
```env
NEXT_PUBLIC_API_URL=https://ftvapi.szlg.info
NEXT_PUBLIC_BACKEND_URL=https://ftvapi.szlg.info
NEXT_PUBLIC_NODE_ENV=production
NEXT_PUBLIC_DEBUG=false
NEXT_PUBLIC_LOG_LEVEL=error
```

## 🔌 API Client Usage

```typescript
import { api } from '@/lib/api';

// Dashboard
const dashboard = await api.dashboard.getDashboardData();
const stats = await api.dashboard.getStatistics();

// Equipment
const equipment = await api.equipment.getEquipmentList();
const reservation = await api.equipment.createReservation(data);

// Users & Auth
const profile = await api.users.getCurrentUserProfile();
const login = await api.auth.login(credentials);

// Rotations
const rotations = await api.rotations.getRotationsList();
const rotation = await api.rotations.createRotation(rotationData);
```

## 🎨 Key Components

```typescript
// Sidebar Navigation
import { AppSidebar } from '@/components/app-sidebar';

// Data Tables
import { DataTable } from '@/components/data-table';

// Charts
import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { ChartBarEquipment } from '@/components/chart-bar-equipment';

// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
```

## 🔐 Authentication

```typescript
// Auth Context
import { useAuth } from '@/contexts/auth-context';

const { user, login, logout, isLoading, isAuthenticated } = useAuth();

// Protected Route
import ProtectedRoute from '@/components/protected-route';

<ProtectedRoute allowedRoles={['admin', 'teacher']}>
  <YourComponent />
</ProtectedRoute>
```

## 🛠️ Configuration Access

```typescript
import { API_CONFIG, ENV_UTILS, DEBUG_CONFIG } from '@/lib/config';

// Environment checks
const isDev = ENV_UTILS.isDevelopment();
const currentEnv = ENV_UTILS.getCurrentEnvironment();
const apiUrl = ENV_UTILS.getApiUrl();

// Debug settings
const debugEnabled = DEBUG_CONFIG.ENABLED;
const logLevel = DEBUG_CONFIG.LOG_LEVEL;
```

## 🎭 Theme System

```typescript
// Theme Context
import { useTheme } from '@/contexts/theme-context';

const { theme, setTheme, toggleTheme } = useTheme();

// Theme Selector Component
import { ThemeSelector } from '@/components/theme-selector';
```

## 📊 Project Structure

```
app/
├── api/              # Next.js API routes
├── app/              # Protected app pages
│   ├── iranyitopult/ # Dashboard
│   ├── felszereles/  # Equipment
│   ├── forgatasok/   # Rotations
│   └── beallitasok/  # Settings
├── login/            # Auth pages
└── environment-test/ # Config testing

components/
├── ui/              # Base UI components
├── charts/          # Chart components
└── forms/           # Form components

lib/
├── api.ts          # Complete API client
├── config.ts       # Environment config
├── types.ts        # TypeScript types
└── utils.ts        # Utilities
```

## 🚨 Troubleshooting

### Environment Issues
```bash
# Check environment detection
npm run dev
# Look for: "🔧 Environment Configuration:" in console

# Test environment page
# Visit: http://localhost:3001/environment-test
```

### API Issues
```bash
# Enable debug mode in .env.local
NEXT_PUBLIC_DEBUG=true
NEXT_PUBLIC_LOG_LEVEL=debug

# Check console for detailed API logs
```

### Build Issues
```bash
# Install missing dependencies
npm install --save-dev cross-env

# Clean and rebuild
rm -rf .next node_modules
npm install
npm run build
```

## 📖 Documentation Links

- **[Complete Setup Guide](./docs/ENVIRONMENT_SETUP.md)**
- **[Environment Configuration](./ENVIRONMENT_CONFIGURATION.md)**
- **[API Reference](./lib/api.ts)**
- **[Type Definitions](./lib/types.ts)**

## 🎯 Common Patterns

### Data Fetching
```typescript
'use client';
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';

export default function MyComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.someEndpoint.getData()
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Loading...</div>;
  return <div>{/* Render data */}</div>;
}
```

### Form Handling
```typescript
import { useState } from 'react';
import { api } from '@/lib/api';
import { Button } from '@/components/ui/button';

export default function MyForm() {
  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.someEndpoint.createData(formData);
      // Handle success
    } catch (error) {
      // Handle error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Form fields */}
      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : 'Save'}
      </Button>
    </form>
  );
}
```

---

*FTV Frontend Quick Reference - Always up to date!*
