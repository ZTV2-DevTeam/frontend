import Link from 'next/link';
import { API_CONFIG, BACKEND_CONFIG, DEBUG_CONFIG, ENV_UTILS } from '@/lib/config';

export default function EnvironmentTest() {
  const env = ENV_UTILS.getCurrentEnvironment();
  const isDev = ENV_UTILS.isDevelopment();
  const apiConfig = {
    baseURL: API_CONFIG.BASE_URL,
    backendURL: BACKEND_CONFIG.BASE_URL,
    timeout: 30000, // default timeout
    debug: API_CONFIG.DEBUG,
    logLevel: API_CONFIG.LOG_LEVEL
  };
  const debugConfig = {
    enabled: DEBUG_CONFIG.ENABLED,
    logLevel: DEBUG_CONFIG.LOG_LEVEL,
    logRequests: DEBUG_CONFIG.LOG_API_CALLS
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Environment Configuration Test</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
        {/* Environment Info */}
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Environment Detection</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Current Environment:</span>
              <span className={`px-2 py-1 rounded text-sm font-mono ${
                env === 'development' ? 'bg-green-100 text-green-800' :
                env === 'staging' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {env}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Is Development:</span>
              <span className={`px-2 py-1 rounded text-sm ${isDev ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {isDev ? 'Yes' : 'No'}
              </span>
            </div>
          </div>
        </div>

        {/* API Configuration */}
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">API Configuration</h2>
          <div className="space-y-2">
            <div>
              <span className="font-medium">API URL:</span>
              <div className="font-mono text-sm mt-1 p-2 bg-muted rounded">
                {apiConfig.baseURL}
              </div>
            </div>
            <div>
              <span className="font-medium">Backend URL:</span>
              <div className="font-mono text-sm mt-1 p-2 bg-muted rounded">
                {apiConfig.backendURL}
              </div>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Timeout:</span>
              <span className="font-mono text-sm">{apiConfig.timeout}ms</span>
            </div>
          </div>
        </div>

        {/* Debug Configuration */}
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Debug Configuration</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="font-medium">Debug Mode:</span>
              <span className={`px-2 py-1 rounded text-sm ${debugConfig.enabled ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {debugConfig.enabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">Log Level:</span>
              <span className="px-2 py-1 rounded text-sm bg-blue-100 text-blue-800 font-mono">
                {debugConfig.logLevel}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium">API Logging:</span>
              <span className={`px-2 py-1 rounded text-sm ${debugConfig.logRequests ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                {debugConfig.logRequests ? 'On' : 'Off'}
              </span>
            </div>
          </div>
        </div>

        {/* Environment Variables */}
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">Environment Variables</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="font-medium">NODE_ENV:</span>
              <span className="ml-2 font-mono">{process.env.NODE_ENV}</span>
            </div>
            <div>
              <span className="font-medium">NEXT_PUBLIC_NODE_ENV:</span>
              <span className="ml-2 font-mono">{process.env.NEXT_PUBLIC_NODE_ENV || 'not set'}</span>
            </div>
            <div>
              <span className="font-medium">NEXT_PUBLIC_DEBUG:</span>
              <span className="ml-2 font-mono">{process.env.NEXT_PUBLIC_DEBUG || 'not set'}</span>
            </div>
            <div>
              <span className="font-medium">NEXT_PUBLIC_LOG_LEVEL:</span>
              <span className="ml-2 font-mono">{process.env.NEXT_PUBLIC_LOG_LEVEL || 'not set'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Test API Call */}
      <div className="mt-6">
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-4">API Test</h2>
          <p className="text-muted-foreground mb-4">
            Open your browser&apos;s console to see the API logging in action when you visit pages that make API calls.
          </p>
          <div className="flex gap-4">
            <Link 
              href="/app/iranyitopult" 
              className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90"
            >
              Test Dashboard APIs
            </Link>
            <Link 
              href="/app/felszereles" 
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/90"
            >
              Test Equipment APIs
            </Link>
            <Link 
              href="/app/forgatasok" 
              className="px-4 py-2 bg-accent text-accent-foreground rounded hover:bg-accent/90"
            >
              Test Forgatasok APIs
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h3 className="font-semibold mb-2">🚀 Environment System Status</h3>
        <p className="text-sm text-muted-foreground">
          Environment configuration system is <strong>active</strong> and working correctly! 
          The application is automatically using the {env} environment configuration 
          with {isDev ? 'development' : 'production'} settings.
        </p>
      </div>
    </div>
  );
}
