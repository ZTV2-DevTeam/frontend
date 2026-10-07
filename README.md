# FTV Frontend

Modern Next.js frontend application for the FTV project with comprehensive API integration and multi-environment support.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- FTV Django backend running (for development)

### Installation
```bash
# Clone repository
git clone <repository-url>
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local
# Edit .env.local with your configuration

# Start development server
npm run dev
```

Visit `http://localhost:3000` (or `http://localhost:3001` if port 3000 is busy)

## 🌍 Environment Configuration

This application supports multiple environments with automatic backend switching:

| Environment | Command | Backend URL | Purpose |
|-------------|---------|-------------|---------|
| **Development** | `npm run dev` | `http://localhost:8000` | Local development |
| **Development (Prod API)** | `npm run dev:prod-api` | `https://ftvapi.szlg.info` | Testing with live API |
| **Staging** | `npm run build:staging` | `https://api-staging.szlg.info` | QA and testing |
| **Production** | `npm run build:production` | `https://ftvapi.szlg.info` | Live deployment |

### Environment Setup
1. **Development**: Copy `.env.example` to `.env.local`
2. **Staging**: Copy `.env.example` to `.env.staging`
3. **Production**: Copy `.env.example` to `.env.production`
4. **Test Configuration**: Visit `/environment-test` to verify setup

**📖 [Complete Environment Setup Guide](./docs/ENVIRONMENT_SETUP.md)**

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev              # Start development server (localhost backend)
npm run dev:prod-api     # Start development with production API

# Building
npm run build            # Build for production
npm run build:staging    # Build for staging environment
npm run build:production # Build for production environment

# Production
npm start                # Start production server
npm run start:staging    # Start staging server

# Linting & Type Checking
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript compiler check
```

### Project Structure

```
frontend/
├── app/                 # Next.js App Router pages
│   ├── api/            # API routes
│   ├── app/            # Protected application pages
│   ├── login/          # Authentication pages
│   └── environment-test/ # Environment testing
├── components/          # Reusable React components
│   ├── ui/             # UI library components
│   └── animate-ui/     # Animation components
├── contexts/           # React contexts (auth, theme, etc.)
├── hooks/             # Custom React hooks
├── lib/               # Utilities and configuration
│   ├── api.ts         # API client with full backend integration
│   ├── config.ts      # Environment configuration system
│   ├── types.ts       # TypeScript type definitions
│   └── utils.ts       # Utility functions
├── docs/              # Documentation
└── public/            # Static assets
```

## 🔌 API Integration

### Complete Backend Integration
- **91+ API Endpoints**: Full integration with FTV Django backend
- **Type-Safe**: Complete TypeScript definitions for all API responses
- **Authentication**: JWT-based auth with automatic token management
- **Error Handling**: Comprehensive error handling and user feedback
- **Environment-Aware**: Automatic backend URL switching per environment

### Key API Features
- **Dashboard Data**: Analytics, statistics, and overview data
- **User Management**: Authentication, profiles, and roles
- **Equipment Management**: Equipment tracking and reservations
- **Schedule Management**: Events, rotations, and calendar integration
- **Partner Management**: Partner relationships and contact management
- **Message Wall**: Internal communication system
- **And much more...**

### API Client Usage
```typescript
import { api } from '@/lib/api';

// Get dashboard data
const dashboard = await api.dashboard.getDashboardData();

// Get equipment list
const equipment = await api.equipment.getEquipmentList();

// Create new rotation
const rotation = await api.rotations.createRotation(rotationData);
```

## 🎨 UI/UX Features

### Design System
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality component library
- **Dark/Light Theme**: System preference with manual toggle
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG compliant components

### Key Components
- **Sidebar Navigation**: Collapsible sidebar with active state management
- **Data Tables**: Advanced tables with sorting, filtering, pagination
- **Charts**: Interactive charts with multiple visualization types
- **Forms**: Validated forms with error handling
- **Modals & Dialogs**: Accessible modal components
- **Loading States**: Skeleton loaders and loading indicators

## 🔐 Authentication & Authorization

### Authentication Flow
- **JWT Tokens**: Secure token-based authentication
- **Automatic Refresh**: Token refresh with seamless user experience
- **Protected Routes**: Route-level protection with role-based access
- **Login/Logout**: Complete authentication flow
- **Password Recovery**: Forgot password functionality
- **SZLG+ Login (SSO)**: "Bejelentkezés SZLG+-szal" button on `/login`. The backend runs the OpenID Connect flow and
  redirects back to `/login?sso_ticket=...` (or `?sso_error=<code>`); `components/login-form.tsx` exchanges the
  one-time ticket for the same JWT session as the password login (`apiClient.exchangeSSOTicket`,
  `useAuth().loginWithSSOTicket`). The SSO client settings live in the **backend**, not in the frontend `.env`
  (see the backend `docs/SSO_LOGIN.md`).

### User Roles
- **Student**: Basic access to personal data
- **Teacher**: Access to class and student management
- **Admin**: Full system administration access
- **Superuser**: Complete system control

## 📊 Features

### Dashboard
- **Analytics Overview**: Key metrics and statistics
- **Activity Feed**: Recent activities and updates
- **Quick Actions**: Common tasks and shortcuts
- **Status Indicators**: System health and connectivity

### Equipment Management
- **Equipment Database**: Complete equipment inventory
- **Reservation System**: Equipment booking and scheduling
- **Maintenance Tracking**: Equipment status and maintenance records
- **Usage Analytics**: Equipment utilization statistics

### Schedule Management
- **Calendar Integration**: Event and schedule management
- **Rotation Planning**: Class rotation and scheduling
- **Conflict Detection**: Automatic scheduling conflict resolution
- **Notification System**: Schedule updates and reminders

### Communication
- **Message Wall**: Internal announcement system
- **Notifications**: Real-time notifications
- **Contact Management**: Partner and contact database

## 🔧 Configuration

### Environment Variables

Key environment variables (see `.env.example` for complete list):

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://ftvapi.szlg.info
NEXT_PUBLIC_BACKEND_URL=https://ftvapi.szlg.info

# Environment & Debug
NEXT_PUBLIC_NODE_ENV=production
NEXT_PUBLIC_DEBUG=false
NEXT_PUBLIC_LOG_LEVEL=error

# Organization
NEXT_PUBLIC_ORG_NAME=FTV
NEXT_PUBLIC_CONTACT_EMAIL=balla.botond.23f@szlgbp.hu
```

### Configuration System
The application uses a sophisticated configuration system that:
- Automatically detects the current environment
- Configures backend URLs appropriately
- Sets logging levels based on environment
- Provides debugging tools for development

## 🧪 Testing

### Environment Testing
Visit `/environment-test` to verify:
- Environment detection
- API configuration
- Backend connectivity
- Debug settings
- Environment variables

### Testing Commands
```bash
# Test environment configuration
npm run dev
# Visit: http://localhost:3001/environment-test

# Test with production API
npm run dev:prod-api
# Verify API calls in browser console
```

## 📦 Deployment

### Production Deployment
```bash
# Build for production
npm run build:production

# Start production server
npm start
```

### Staging Deployment
```bash
# Build for staging
npm run build:staging

# Start staging server
npm run start:staging
```

### Environment-Specific Builds
The build system automatically:
- Uses correct backend URLs for each environment
- Optimizes bundle size for production
- Configures logging appropriately
- Sets up environment-specific configurations

## 🛡️ Security

### Security Features
- **Environment Variable Validation**: Runtime validation of configuration
- **Secure Logging**: Production logging excludes sensitive data
- **HTTPS Enforcement**: Secure connections in staging/production
- **Token Management**: Secure JWT token handling
- **CORS Configuration**: Proper cross-origin resource sharing setup

### Best Practices
- Environment files are gitignored
- Sensitive data uses server-side variables only
- Production builds minimize exposed information
- Security headers configured appropriately

## 📚 Documentation

- **[Environment Setup Guide](./docs/ENVIRONMENT_SETUP.md)**: Comprehensive environment configuration
- **[API Documentation](./lib/api.ts)**: Complete API client documentation
- **[Type Definitions](./lib/types.ts)**: TypeScript type reference
- **[Configuration Reference](./lib/config.ts)**: Configuration system documentation
- **[Date/Time Picker Guide](./docs/date-time-pickers.md)**: Cross-platform date and time components
- **[Migration Guide](./docs/MIGRATION_GUIDE.md)**: How to migrate to system-native pickers

### UI Components

#### Cross-Platform Date/Time Pickers (RECOMMENDED)
The application provides both system-native and custom date/time picker components. For best user experience, use the system-native components:

```tsx
import { SystemDatePicker, SystemTimePicker, SystemDateTimePicker } from "@/components/ui/date-time-components"

// System-native date picker (recommended)
<SystemDatePicker date={date} onSelect={setDate} placeholder="Válassz dátumot" />

// System-native time picker with 24-hour format
<SystemTimePicker time={time} onTimeChange={setTime} placeholder="Válassz időt" />

// Combined date and time picker
<SystemDateTimePicker date={dateTime} onSelect={setDateTime} placeholder="Válassz dátumot és időt" />
```

**For legacy/custom styling needs only:**
```tsx
import { DatePicker, TimePicker, DateTimePicker } from "@/components/ui/date-time-components"
```

**Key Benefits of System Components:**
- **Native User Experience**: Uses platform-specific date/time pickers
- **Accessibility**: Full keyboard and screen reader support
- **24-Hour Format**: Consistent time display across all platforms
- **Touch Optimized**: Mobile-friendly native controls on iOS/Android
- **No JavaScript Dependencies**: Faster loading and better performance

See [Date/Time Picker Guide](./docs/DATE_TIME_PICKER_GUIDE.md) for complete documentation and migration instructions.

## 🤝 Contributing

### Development Workflow
1. Create feature branch from `master`
2. Develop using `npm run dev`
3. Test with `npm run dev:prod-api`
4. Build and test: `npm run build:staging`
5. Create pull request

### Code Standards
- **TypeScript**: Strict typing required
- **ESLint**: Follow configured linting rules  
- **Prettier**: Code formatting enforced
- **Component Documentation**: Document complex components
- **API Integration**: Use the centralized API client

## 🐛 Troubleshooting

### Common Issues

#### API Connection Issues
```bash
# Check environment configuration
npm run dev
# Visit: /environment-test

# Test with different backend
npm run dev:prod-api
```

#### Build Issues
```bash
# Install missing dependencies
npm install

# Check environment variables
npm run type-check

# Clean build
rm -rf .next && npm run build
```

#### Environment Issues
- Check `.env.*` files exist and have correct variables
- Verify `cross-env` is installed: `npm install --save-dev cross-env`
- Restart development server after environment changes
- Clear browser cache after environment updates

## 📞 Support

- **Developer**: balla.botond.23f@szlgbp.hu
- **Issues**: Create GitHub issue
- **Documentation**: See `/docs` folder
- **Environment Testing**: Visit `/environment-test`

## 🔄 Recent Updates

- ✅ Complete API integration with 91+ endpoints
- ✅ Multi-environment configuration system
- ✅ Enhanced debugging and logging
- ✅ Professional deployment workflow
- ✅ Comprehensive documentation

---

**FTV Frontend** - Built with Next.js, TypeScript, and modern web technologies.


*Last updated: August 11, 2025*
