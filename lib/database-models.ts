/**
 * Centralized Database Models Configuration
 * 
 * This file contains all database model paths for Django admin integration.
 * Configure the models once here and they will be used throughout the application.
 */

// Database model paths for Django admin
export const DATABASE_MODELS = {
  // Authentication & User Management
  AUTH_GROUP: 'auth/group',
  AUTH_USER: 'auth/user',
    
    // API Models
    PARTNER: 'api/partner',
    PROFILE: 'api/profile',
    OSZTALY: 'api/osztaly',
    STAB: 'api/stab',
    PARTNERTIPUS: 'api/partnertipus',
    CONFIG: 'api/config',
    FORGATAS: 'api/forgatas',
    EQUIPMENTTIPUS: 'api/equipmenttipus',
    EQUIPMENT: 'api/equipment',
    CONTACTPERSON: 'api/contactperson',
    ANNOUNCEMENT: 'api/announcement',
    TAVOLLET: 'api/tavollet',
    BEOSZTAS: 'api/beosztas',
    SZEREPKOR: 'api/szerepkor',
    SZEREPKORRELACIOK: 'api/szerepkorrelaciok',

    GLOBAL_SETTINGS: 'api/config', // Assuming events are configured through config
} as const;

/**
 * Human-readable names for database models
 */
export const DATABASE_MODEL_NAMES = {
  [DATABASE_MODELS.AUTH_GROUP]: 'Csoportok',
  [DATABASE_MODELS.AUTH_USER]: 'Felhasználók',
  [DATABASE_MODELS.PARTNER]: 'Partnerek',
  [DATABASE_MODELS.PROFILE]: 'Profilok',
  [DATABASE_MODELS.OSZTALY]: 'Osztályok',
  [DATABASE_MODELS.STAB]: 'Stáb',
  [DATABASE_MODELS.PARTNERTIPUS]: 'Partner típusok',
  [DATABASE_MODELS.CONFIG]: 'Konfiguráció',
  [DATABASE_MODELS.FORGATAS]: 'Forgatások',
  [DATABASE_MODELS.EQUIPMENTTIPUS]: 'Felszerelés típusok',
  [DATABASE_MODELS.EQUIPMENT]: 'Felszerelések',
  [DATABASE_MODELS.CONTACTPERSON]: 'Kapcsolattartók',
  [DATABASE_MODELS.ANNOUNCEMENT]: 'Közlemények',
  [DATABASE_MODELS.TAVOLLET]: 'Távollétek',
  [DATABASE_MODELS.BEOSZTAS]: 'Beosztások',
  [DATABASE_MODELS.SZEREPKOR]: 'Szerepkörök',
  [DATABASE_MODELS.SZEREPKORRELACIOK]: 'Szerepkör relációk',
} as const;

/**
 * Get the full Django admin URL for a model
 */
export function getDatabaseAdminUrl(modelPath: string, baseUrl?: string): string {
  const backendUrl = baseUrl || process.env.NEXT_PUBLIC_BACKEND_URL || 'https://ftvapi.szlg.info';
  return `${backendUrl}/admin/${modelPath}/`;
}

/**
 * Get human-readable name for a model
 */
export function getModelDisplayName(modelPath: string): string {
  return DATABASE_MODEL_NAMES[modelPath as keyof typeof DATABASE_MODEL_NAMES] || modelPath;
}

/**
 * Configuration for database admin menu items
 */
export interface DatabaseAdminMenuItem {
  name: string;
  modelPath: string;
  icon: string; // Icon name as string
  category?: string;
  roles?: string[]; // Which user roles can access this
}

/**
 * Get all available database admin menu items
 * This function can be extended to filter based on user roles
 */
export function getDatabaseAdminMenuItems(): DatabaseAdminMenuItem[] {
  return [
    // Authentication & User Management
    {
      name: DATABASE_MODEL_NAMES[DATABASE_MODELS.AUTH_USER],
      modelPath: DATABASE_MODELS.AUTH_USER,
      icon: 'UserCheck',
      category: 'Felhasználó kezelés',
      roles: ['admin'],
    },
    {
      name: DATABASE_MODEL_NAMES[DATABASE_MODELS.AUTH_GROUP],
      modelPath: DATABASE_MODELS.AUTH_GROUP,
      icon: 'Users',
      category: 'Felhasználó kezelés',
      roles: ['admin'],
    },
    
    // Core Models
    {
      name: DATABASE_MODEL_NAMES[DATABASE_MODELS.FORGATAS],
      modelPath: DATABASE_MODELS.FORGATAS,
      icon: 'Video',
      category: 'Tevékenység',
      roles: ['admin'],
    },
    {
      name: DATABASE_MODEL_NAMES[DATABASE_MODELS.BEOSZTAS],
      modelPath: DATABASE_MODELS.BEOSZTAS,
      icon: 'TableProperties',
      category: 'Tevékenység',
      roles: ['admin'],
    },
    {
      name: DATABASE_MODEL_NAMES[DATABASE_MODELS.EQUIPMENT],
      modelPath: DATABASE_MODELS.EQUIPMENT,
      icon: 'Wrench',
      category: 'Eszközök',
      roles: ['admin'],
    },
    {
      name: DATABASE_MODEL_NAMES[DATABASE_MODELS.EQUIPMENTTIPUS],
      modelPath: DATABASE_MODELS.EQUIPMENTTIPUS,
      icon: 'Settings',
      category: 'Eszközök',
      roles: ['admin'],
    },
    
    // Partners & Relationships
    {
      name: DATABASE_MODEL_NAMES[DATABASE_MODELS.PARTNER],
      modelPath: DATABASE_MODELS.PARTNER,
      icon: 'Handshake',
      category: 'Kapcsolatok',
      roles: ['admin'],
    },
    {
      name: DATABASE_MODEL_NAMES[DATABASE_MODELS.PARTNERTIPUS],
      modelPath: DATABASE_MODELS.PARTNERTIPUS,
      icon: 'Tag',
      category: 'Kapcsolatok',
      roles: ['admin'],
    },
    {
      name: DATABASE_MODEL_NAMES[DATABASE_MODELS.CONTACTPERSON],
      modelPath: DATABASE_MODELS.CONTACTPERSON,
      icon: 'Phone',
      category: 'Kapcsolatok',
      roles: ['admin'],
    },
    
    // Educational
    {
      name: DATABASE_MODEL_NAMES[DATABASE_MODELS.OSZTALY],
      modelPath: DATABASE_MODELS.OSZTALY,
      icon: 'GraduationCap',
      category: 'Oktatás',
      roles: ['admin'],
    },
    {
      name: DATABASE_MODEL_NAMES[DATABASE_MODELS.STAB],
      modelPath: DATABASE_MODELS.STAB,
      icon: 'Users',
      category: 'Oktatás',
      roles: ['admin'],
    },
    {
      name: DATABASE_MODEL_NAMES[DATABASE_MODELS.TAVOLLET],
      modelPath: DATABASE_MODELS.TAVOLLET,
      icon: 'Calendar',
      category: 'Oktatás',
      roles: ['admin'],
    },
    
    // System
    {
      name: DATABASE_MODEL_NAMES[DATABASE_MODELS.PROFILE],
      modelPath: DATABASE_MODELS.PROFILE,
      icon: 'User',
      category: 'Rendszer',
      roles: ['admin'],
    },
    {
      name: DATABASE_MODEL_NAMES[DATABASE_MODELS.CONFIG],
      modelPath: DATABASE_MODELS.CONFIG,
      icon: 'Settings',
      category: 'Rendszer',
      roles: ['admin'],
    },
    {
      name: DATABASE_MODEL_NAMES[DATABASE_MODELS.ANNOUNCEMENT],
      modelPath: DATABASE_MODELS.ANNOUNCEMENT,
      icon: 'BellDot',
      category: 'Kommunikáció',
      roles: ['admin'],
    },
    {
      name: DATABASE_MODEL_NAMES[DATABASE_MODELS.SZEREPKOR],
      modelPath: DATABASE_MODELS.SZEREPKOR,
      icon: 'Shield',
      category: 'Rendszer',
      roles: ['admin'],
    },
    {
      name: DATABASE_MODEL_NAMES[DATABASE_MODELS.SZEREPKORRELACIOK],
      modelPath: DATABASE_MODELS.SZEREPKORRELACIOK,
      icon: 'Network',
      category: 'Rendszer',
      roles: ['admin'],
    },
  ];
}

/**
 * Filter database admin menu items by user role
 */
export function getDatabaseAdminMenuItemsByRole(userRole: string): DatabaseAdminMenuItem[] {
  return getDatabaseAdminMenuItems().filter(item => 
    !item.roles || item.roles.includes(userRole)
  );
}
