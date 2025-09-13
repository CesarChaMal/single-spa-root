/* eslint-env browser */
/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
/* eslint-disable no-console */
/* eslint-disable no-alert */
/* eslint-disable import/no-dynamic-require */
/* eslint-disable import/no-unresolved */
/* eslint-disable no-else-return */
/* eslint-disable no-inner-declarations */
/* eslint-disable consistent-return */
/* eslint-disable no-plusplus */
/* eslint-disable no-await-in-loop */
/* eslint-disable no-trailing-spaces */
/* eslint-disable arrow-parens */
/* eslint-disable no-param-reassign */
import * as singleSpa from 'single-spa';
import 'zone.js';
import stateManager from '../shared/state-manager';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

window.stateManager = stateManager;

// Configuration modes
const MODES = {
  LOCAL: 'local',
  NPM: 'npm',
  NEXUS: 'nexus',
  GITHUB: 'github',
  AWS: 'aws',
};

// Get mode from environment variables (via webpack), URL parameter, or localStorage
const urlParams = new URLSearchParams(window.location.search);
const envMode = process.env.SPA_MODE || MODES.LOCAL;
// Auto-detect production environment for S3 websites
const isS3Website = window.location.hostname.includes('.s3-website-')
    || window.location.hostname.includes('.s3.')
    || window.location.hostname.includes('amazonaws.com');
const envEnvironment = isS3Website ? 'prod' : (process.env.SPA_ENV || 'dev');

// Auto-detect mode based on hostname
let detectedMode = envMode;
if (window.location.hostname.includes('.s3-website-')
    || window.location.hostname.includes('.s3.')
    || window.location.hostname.includes('amazonaws.com')) {
  console.log('🔍 Auto-detected S3 website, switching to AWS mode');
  detectedMode = MODES.AWS;
} else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
  console.log('🔍 Auto-detected localhost, using environment mode:', envMode);
  detectedMode = envMode;
}

const mode = detectedMode === MODES.AWS
  ? detectedMode // 1. If S3 website detected → use AWS mode
  : (urlParams.get('mode') // 2. Otherwise, check URL parameter (?mode=aws)
        || envMode // 3. Then check environment variable (SPA_MODE)
        || localStorage.getItem('spa-mode') // 4. Then check browser storage
        || detectedMode); // 5. Finally, use auto-detected mode

// Save mode to localStorage for persistence (only if not auto-detected)
if (!window.location.hostname.includes('.s3-website-')
    && !window.location.hostname.includes('.s3.')
    && !window.location.hostname.includes('amazonaws.com')) {
  localStorage.setItem('spa-mode', mode);
}

// Display current mode
console.log(`🚀 Single-SPA Mode: ${mode.toUpperCase()}`);
console.log(`🔧 Environment Variables - SPA_MODE: ${process.env.SPA_MODE}, SPA_ENV: ${process.env.SPA_ENV}`);
console.log(`🌐 Hostname: ${window.location.hostname}`);
console.log(`🔗 Full URL: ${window.location.href}`);

function showWhenAnyOf(routes) {
  return function (location) {
    return routes.some((route) => location.pathname === route);
  };
}

function showWhenPrefix(routes) {
  return function (location) {
    return routes.some((route) => location.pathname.startsWith(route));
  };
}

function showExcept(routes) {
  return function (location) {
    return routes.every((route) => location.pathname !== route);
  };
}

// Authentication helper function
function isAuthenticated() {
  return sessionStorage.getItem('token') !== null;
}

// Protected route helper - requires authentication
function showWhenAuthenticatedAndPrefix(routes) {
  return function (location) {
    return isAuthenticated() && routes.some((route) => location.pathname.startsWith(route));
  };
}

function showWhenAuthenticatedAndAnyOf(routes) {
  return function (location) {
    return isAuthenticated() && routes.some((route) => location.pathname === route);
  };
}

function showWhenAuthenticatedExcept(routes) {
  return function (location) {
    return isAuthenticated() && routes.every((route) => location.pathname !== route);
  };
}

// AWS S3 import map configuration from webpack template (environment variables)
const { AWS_CONFIG } = window;
const { IMPORTMAP_URL } = window;
const { S3_WEBSITE_URL } = window;

// Only warn about AWS config if we're actually using AWS mode
if (mode === MODES.AWS && (!AWS_CONFIG || !IMPORTMAP_URL)) {
  console.warn('⚠️ AWS configuration not found. Make sure environment variables are set: S3_BUCKET, AWS_REGION, ORG_NAME');
}

// Shared function to resolve single-spa lifecycle functions from loaded modules
function resolveLifecycles(module, name) {
  console.log('🔍 Module keys:', Object.keys(module));
  console.log('🔍 Has bootstrap:', typeof module.bootstrap);
  console.log('🔍 Has mount:', typeof module.mount);
  console.log('🔍 Has unmount:', typeof module.unmount);

  let lifecycles;

  // Check if it's a proper single-spa app with lifecycle functions
  if (module.bootstrap && module.mount && module.unmount) {
    lifecycles = module;
  } else if (module.default && module.default.bootstrap) {
    lifecycles = module.default;
  // } else if (window['single-spa-layout-app']) {
  //   // Check if it's exposed on window (UMD)
  //   lifecycles = window['single-spa-layout-app'];
  } else if (window[name]) {
    // Check if it's exposed on window (UMD)
    lifecycles = window[name];
  } else if (window[name.replace(/-/g, '')]) {
    // Check if it's exposed on window (UMD)
    const globalName = name.replace(/-/g, '');
    console.log('globalName: ', globalName);
    lifecycles = window[globalName];
  } else {
    // Try specific UMD global names
    const umdGlobals = {
      'single-spa-auth-app': 'singleSpaAuthApp',
      'single-spa-layout-app': 'singleSpaLayoutApp',
      'single-spa-home-app': 'singleSpaHomeApp',
      'single-spa-angular-app': 'singleSpaAngularApp',
      'single-spa-vue-app': 'singleSpaVueApp',
      'single-spa-react-app': 'singleSpaReactApp',
      'single-spa-vanilla-app': 'singleSpaVanillaApp',
      'single-spa-webcomponents-app': 'singleSpaWebcomponentsApp',
      'single-spa-typescript-app': 'singleSpaTypescriptApp',
      'single-spa-jquery-app': 'singleSpaJqueryApp',
      'single-spa-svelte-app': 'singleSpaSvelteApp',
    };
    const umdGlobalName = umdGlobals[name];
    console.log(`🔍 Debug: Trying UMD global '${umdGlobalName}' for ${name}`);
    console.log('🔍 Debug: Available globals:', Object.keys(window).filter((k) => k.includes('single') || k.includes('Spa')));

    if (umdGlobalName && window[umdGlobalName]) {
      console.log(`✅ Found UMD global '${umdGlobalName}' for ${name}`);
      lifecycles = window[umdGlobalName];
    } else {
      console.error(`❌ Invalid module format for ${name}. Expected single-spa lifecycles.`);
      console.log('🔍 Debug: Module structure:', module);
      console.log('🔍 Debug: Expected UMD global:', umdGlobalName);
      console.log('🔍 Debug: Available on window:', !!window[umdGlobalName]);
      throw new Error(`Module ${name} does not export valid single-spa lifecycles`);
    }
  }

  return lifecycles;
}

// Unified module loading strategy
function loadModule(url, options = {}) {
  const { 
    isExternalUrl = false, 
    isCdnUrl = false, 
    isPackageName = false, 
  } = options;
  
  if (isCdnUrl || isExternalUrl) {
    // Use SystemJS for external URLs (GitHub, AWS, Local URLs, CDN URLs)
    return window.System.import(url);
  } else if (isPackageName) {
    // Use webpack import() for package names (direct NPM/Nexus imports)
    return window.System.import(url);
  } else {
    // Default: use SystemJS for all other URLs to avoid webpack warnings
    return window.System.import(url);
  }
}

// Configure loading strategy based on mode
let loadApp;
let importMapPromise;

console.log('🔍 Mode comparison debug:');
console.log(`  - mode: '${mode}' (type: ${typeof mode})`);
console.log(`  - MODES.AWS: '${MODES.AWS}' (type: ${typeof MODES.AWS})`);
console.log(`  - mode === MODES.AWS: ${mode === MODES.AWS}`);
console.log(`  - mode === 'aws': ${mode === 'aws'}`);

function getLocalAppUrls(isProduction) {
  return isProduction ? {
    // Production: Load from root server static files
    'single-spa-auth-app': '/single-spa-auth-app.umd.js',
    'single-spa-layout-app': '/single-spa-layout-app.umd.js',
    'single-spa-home-app': '/single-spa-home-app.js',
    'single-spa-angular-app': '/single-spa-angular-app.js',
    'single-spa-vue-app': '/single-spa-vue-app.umd.js',
    'single-spa-react-app': '/single-spa-react-app.js',
    'single-spa-vanilla-app': '/single-spa-vanilla-app.js',
    'single-spa-webcomponents-app': '/single-spa-webcomponents-app.js',
    'single-spa-typescript-app': '/single-spa-typescript-app.js',
    'single-spa-jquery-app': '/single-spa-jquery-app.js',
    'single-spa-svelte-app': '/single-spa-svelte-app.js',
  } : {
    // Development: Load from individual ports
    'single-spa-auth-app': 'http://localhost:4201/single-spa-auth-app.umd.js',
    'single-spa-layout-app': 'http://localhost:4202/single-spa-layout-app.umd.js',
    'single-spa-home-app': 'http://localhost:4203/single-spa-home-app.js',
    'single-spa-angular-app': 'http://localhost:4204/single-spa-angular-app.js',
    'single-spa-vue-app': 'http://localhost:4205/single-spa-vue-app.umd.js',
    'single-spa-react-app': 'http://localhost:4206/single-spa-react-app.js',
    'single-spa-vanilla-app': 'http://localhost:4207/single-spa-vanilla-app.js',
    'single-spa-webcomponents-app': 'http://localhost:4208/single-spa-webcomponents-app.js',
    'single-spa-typescript-app': 'http://localhost:4209/single-spa-typescript-app.js',
    'single-spa-jquery-app': 'http://localhost:4210/single-spa-jquery-app.js',
    'single-spa-svelte-app': 'http://localhost:4211/single-spa-svelte-app.js',
  };
}

function getGitHubAppUrls(githubUser, usePages = true) {
  if (usePages) {
    // GitHub Pages URLs (for prod mode)
    return {
      'single-spa-auth-app': `https://${githubUser}.github.io/single-spa-auth-app/single-spa-auth-app.umd.js`,
      'single-spa-layout-app': `https://${githubUser}.github.io/single-spa-layout-app/single-spa-layout-app.umd.js`,
      'single-spa-home-app': `https://${githubUser}.github.io/single-spa-home-app/single-spa-home-app.js`,
      'single-spa-angular-app': `https://${githubUser}.github.io/single-spa-angular-app/single-spa-angular-app.js`,
      'single-spa-vue-app': `https://${githubUser}.github.io/single-spa-vue-app/single-spa-vue-app.umd.js`,
      'single-spa-react-app': `https://${githubUser}.github.io/single-spa-react-app/single-spa-react-app.js`,
      'single-spa-vanilla-app': `https://${githubUser}.github.io/single-spa-vanilla-app/single-spa-vanilla-app.js`,
      'single-spa-webcomponents-app': `https://${githubUser}.github.io/single-spa-webcomponents-app/single-spa-webcomponents-app.js`,
      'single-spa-typescript-app': `https://${githubUser}.github.io/single-spa-typescript-app/single-spa-typescript-app.js`,
      'single-spa-jquery-app': `https://${githubUser}.github.io/single-spa-jquery-app/single-spa-jquery-app.js`,
      'single-spa-svelte-app': `https://${githubUser}.github.io/single-spa-svelte-app/single-spa-svelte-app.js`,
    };
  } else {
    // Raw GitHub repository URLs (for dev mode)
    return {
      'single-spa-auth-app': `https://raw.githubusercontent.com/${githubUser}/single-spa-auth-app/main/dist/single-spa-auth-app.umd.js`,
      'single-spa-layout-app': `https://raw.githubusercontent.com/${githubUser}/single-spa-layout-app/main/dist/single-spa-layout-app.umd.js`,
      'single-spa-home-app': `https://raw.githubusercontent.com/${githubUser}/single-spa-home-app/main/dist/single-spa-home-app.js`,
      'single-spa-angular-app': `https://raw.githubusercontent.com/${githubUser}/single-spa-angular-app/main/dist/single-spa-angular-app.js`,
      'single-spa-vue-app': `https://raw.githubusercontent.com/${githubUser}/single-spa-vue-app/main/dist/single-spa-vue-app.umd.js`,
      'single-spa-react-app': `https://raw.githubusercontent.com/${githubUser}/single-spa-react-app/main/dist/single-spa-react-app.js`,
      'single-spa-vanilla-app': `https://raw.githubusercontent.com/${githubUser}/single-spa-vanilla-app/main/dist/single-spa-vanilla-app.js`,
      'single-spa-webcomponents-app': `https://raw.githubusercontent.com/${githubUser}/single-spa-webcomponents-app/main/dist/single-spa-webcomponents-app.js`,
      'single-spa-typescript-app': `https://raw.githubusercontent.com/${githubUser}/single-spa-typescript-app/main/dist/single-spa-typescript-app.js`,
      'single-spa-jquery-app': `https://raw.githubusercontent.com/${githubUser}/single-spa-jquery-app/main/dist/single-spa-jquery-app.js`,
      'single-spa-svelte-app': `https://raw.githubusercontent.com/${githubUser}/single-spa-svelte-app/main/dist/single-spa-svelte-app.js`,
    };
  }
}

function getAWSAppUrls() {
  return {
    'single-spa-auth-app': `@${AWS_CONFIG.orgName}/auth-app`,
    'single-spa-layout-app': `@${AWS_CONFIG.orgName}/layout-app`,
    'single-spa-home-app': `@${AWS_CONFIG.orgName}/home-app`,
    'single-spa-angular-app': `@${AWS_CONFIG.orgName}/angular-app`,
    'single-spa-vue-app': `@${AWS_CONFIG.orgName}/vue-app`,
    'single-spa-react-app': `@${AWS_CONFIG.orgName}/react-app`,
    'single-spa-vanilla-app': `@${AWS_CONFIG.orgName}/vanilla-app`,
    'single-spa-webcomponents-app': `@${AWS_CONFIG.orgName}/webcomponents-app`,
    'single-spa-typescript-app': `@${AWS_CONFIG.orgName}/typescript-app`,
    'single-spa-jquery-app': `@${AWS_CONFIG.orgName}/jquery-app`,
    'single-spa-svelte-app': `@${AWS_CONFIG.orgName}/svelte-app`,
  };
}

// Enhanced error handling for network requests
function handleNetworkError(error, context) {
  console.error(`❌ Network error in ${context}:`, error);
  if (error.message.includes('CORS')) {
    console.error('🚨 CORS Error: Check S3 bucket CORS configuration');
  }
  if (error.message.includes('403') || error.message.includes('Forbidden')) {
    console.error('🚨 Access Denied: Check S3 bucket permissions and policies');
  }
  if (error.message.includes('404') || error.message.includes('Not Found')) {
    console.error('🚨 Resource Not Found: Check if files are properly deployed to S3');
  }
  return error;
}

switch (mode) {
  case MODES.NPM:
    // NPM package imports via CDN
    loadApp = async (name) => {
      const scopedName = `@cesarchamal/${name}`;
      // Use correct file names based on actual package structure
      const fileMap = {
        'single-spa-auth-app': 'single-spa-auth-app.umd.js',
        'single-spa-layout-app': 'single-spa-layout-app.umd.js', 
        'single-spa-home-app': 'single-spa-home-app.js',
        'single-spa-angular-app': 'single-spa-angular-app.js',
        'single-spa-vue-app': 'single-spa-vue-app.umd.js',
        'single-spa-react-app': 'single-spa-react-app.js',
        'single-spa-vanilla-app': 'single-spa-vanilla-app.js',
        'single-spa-webcomponents-app': 'single-spa-webcomponents-app.js',
        'single-spa-typescript-app': 'single-spa-typescript-app.js',
        'single-spa-jquery-app': 'single-spa-jquery-app.js',
        'single-spa-svelte-app': 'single-spa-svelte-app.js',
      };
      const fileName = fileMap[name];
      const cdnUrl = `https://cdn.jsdelivr.net/npm/${scopedName}@latest/dist/${fileName}`;
      console.log(`Loading ${name} from NPM CDN: ${cdnUrl}`);
      try {
        const module = await loadModule(cdnUrl, { isCdnUrl: true });
        return resolveLifecycles(module, name);
      } catch (error) {
        throw handleNetworkError(error, `NPM CDN import for ${name}`);
      }
    };
    break;

  case MODES.NEXUS:
    // Nexus private registry imports via CDN
    loadApp = async (name) => {
      const scopedName = `@cesarchamal/${name}`;
      // Use correct file names based on actual package structure
      const fileMap = {
        'single-spa-auth-app': 'single-spa-auth-app.umd.js',
        'single-spa-layout-app': 'single-spa-layout-app.umd.js', 
        'single-spa-home-app': 'single-spa-home-app.js',
        'single-spa-angular-app': 'single-spa-angular-app.js',
        'single-spa-vue-app': 'single-spa-vue-app.umd.js',
        'single-spa-react-app': 'single-spa-react-app.js',
        'single-spa-vanilla-app': 'single-spa-vanilla-app.js',
        'single-spa-webcomponents-app': 'single-spa-webcomponents-app.js',
        'single-spa-typescript-app': 'single-spa-typescript-app.js',
        'single-spa-jquery-app': 'single-spa-jquery-app.js',
        'single-spa-svelte-app': 'single-spa-svelte-app.js',
      };
      const fileName = fileMap[name];
      // Use CORS proxy URL from environment variables
      const nexusBaseUrl = process.env.NEXUS_CORS_REGISTRY || 'http://localhost:8082/repository/npm-group';
      // Nexus mode: Use same file serving approach as local mode
      // Dev: Individual dev servers, Prod: Static files from root server
      // Nexus publishing happens in the background but file serving is local
      const isProduction = envEnvironment === 'prod';
      console.log(`🔧 Nexus mode (${envEnvironment}): Using ${isProduction ? 'static files' : 'dev servers'} + Nexus registry`);
      
      const nexusUrl = isProduction ? {
        // Production: Load from root server static files
        'single-spa-auth-app': '/single-spa-auth-app.umd.js',
        'single-spa-layout-app': '/single-spa-layout-app.umd.js',
        'single-spa-home-app': '/single-spa-home-app.js',
        'single-spa-angular-app': '/single-spa-angular-app.js',
        'single-spa-vue-app': '/single-spa-vue-app.umd.js',
        'single-spa-react-app': '/single-spa-react-app.js',
        'single-spa-vanilla-app': '/single-spa-vanilla-app.js',
        'single-spa-webcomponents-app': '/single-spa-webcomponents-app.js',
        'single-spa-typescript-app': '/single-spa-typescript-app.js',
        'single-spa-jquery-app': '/single-spa-jquery-app.js',
        'single-spa-svelte-app': '/single-spa-svelte-app.js',
      }[name] : {
        // Development: Load from individual ports
        'single-spa-auth-app': 'http://localhost:4201/single-spa-auth-app.umd.js',
        'single-spa-layout-app': 'http://localhost:4202/single-spa-layout-app.umd.js',
        'single-spa-home-app': 'http://localhost:4203/single-spa-home-app.js',
        'single-spa-angular-app': 'http://localhost:4204/single-spa-angular-app.js',
        'single-spa-vue-app': 'http://localhost:4205/single-spa-vue-app.umd.js',
        'single-spa-react-app': 'http://localhost:4206/single-spa-react-app.js',
        'single-spa-vanilla-app': 'http://localhost:4207/single-spa-vanilla-app.js',
        'single-spa-webcomponents-app': 'http://localhost:4208/single-spa-webcomponents-app.js',
        'single-spa-typescript-app': 'http://localhost:4209/single-spa-typescript-app.js',
        'single-spa-jquery-app': 'http://localhost:4210/single-spa-jquery-app.js',
        'single-spa-svelte-app': 'http://localhost:4211/single-spa-svelte-app.js',
      }[name];
      console.log(`Loading ${name} from Nexus CDN: ${nexusUrl}`);
      try {
        const module = await loadModule(nexusUrl, { isCdnUrl: true });
        return resolveLifecycles(module, name);
      } catch (error) {
        console.error(`❌ Failed to load ${scopedName} from Nexus registry`);
        console.error('💡 Make sure:');
        console.error('   1. Package is published to Nexus: npm run publish:nexus:prod');
        console.error('   2. Registry is set to Nexus: npm run registry:nexus');
        console.error('   3. Nexus authentication is configured');
        console.error('   4. Package dependencies are installed');
        throw handleNetworkError(error, `Nexus CDN import for ${name}`);
      }
    };
    break;

  case MODES.GITHUB: {
    // GitHub Pages - different behavior for dev vs prod
    // Check environment variable first, then fallback to URL parameter
    const urlEnv = urlParams.get('env');
    const githubEnv = envEnvironment || urlEnv;
    const { GITHUB_USERNAME } = window;
    const githubUser = GITHUB_USERNAME || process.env.GITHUB_USERNAME || 'cesarchamal';

    // Always use GitHub Pages URLs to avoid MIME type issues with raw URLs
    const usePages = true;
    
    console.log('🔍 GitHub mode environment detection:');
    console.log(`  - Webpack env variable (priority): ${envEnvironment}`);
    console.log(`  - URL env parameter (fallback): ${urlEnv}`);
    console.log(`  - Final githubEnv: ${githubEnv}`);
    console.log(`  - usePages (GitHub Pages): ${usePages}`);
    console.log(`  - GitHub user: ${githubUser}`);

    if (githubEnv === 'prod') {
      console.log('🔧 GitHub prod mode: Creates repos + deploys to GitHub Pages');
      console.log('⏳ Note: GitHub Pages may take 5-10 minutes to become available after deployment');
    } else {
      console.log('📖 GitHub dev mode: Reading from existing GitHub Pages');
      console.log('🔍 Source: GitHub Pages (proper MIME types)');
    }

    // Retry mechanism for external URLs
    async function loadWithRetry(url, maxRetries = 3, delay = 2000) {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          console.log(`📡 Attempt ${attempt}/${maxRetries} loading: ${url}`);
          const module = await loadModule(url, { isExternalUrl: true });
          console.log(`✅ Successfully loaded on attempt ${attempt}`);
          return module;
        } catch (error) {
          console.log(`❌ Attempt ${attempt} failed:`, error.message);
          
          if (attempt === maxRetries) {
            if (usePages) {
              console.error('🚨 GitHub Pages not ready yet. This is normal after fresh deployment.');
              console.error('💡 Solutions:');
              console.error('   1. Wait 5-10 minutes for GitHub Pages to activate');
              console.error('   2. Check repository settings: Settings > Pages');
              console.error('   3. Verify deployment completed successfully');
              console.error(`   4. Manual check: ${url}`);
            } else {
              console.error('🚨 Repository files not found.');
              console.error('💡 Solutions:');
              console.error('   1. Verify repositories exist and are public');
              console.error('   2. Check if files are built and committed');
              console.error('   3. Verify branch is "main" not "master"');
              console.error(`   4. Manual check: ${url}`);
            }
            throw error;
          }
          
          const retryDelay = usePages ? delay : 1000;
          console.log(`⏳ Waiting ${retryDelay}ms before retry...`);
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          delay *= 1.5;
        }
      }
    }

    loadApp = async (name) => {
      const appUrls = getGitHubAppUrls(githubUser, usePages);
      const url = appUrls[name];
      const source = usePages ? 'GitHub Pages' : 'GitHub Repository';
      console.log(`Loading ${name} from ${source}: ${url}`);
      try {
        const module = usePages ? await loadWithRetry(url) : await loadWithRetry(url, 2, 1000);
        return resolveLifecycles(module, name);
      } catch (error) {
        throw handleNetworkError(error, `GitHub ${source} import for ${name}`);
      }
    };
    break;
  }

  case MODES.AWS: {
    // AWS S3 - load from import map
    if (!IMPORTMAP_URL || !AWS_CONFIG) {
      throw new Error('❌ AWS mode requires environment variables: S3_BUCKET, AWS_REGION, ORG_NAME');
    }

    // AWS - different behavior for dev vs prod
    const publicUrl = S3_WEBSITE_URL || `http://${AWS_CONFIG.s3Bucket}.s3-website-${AWS_CONFIG.region}.amazonaws.com`;
    if (envEnvironment === 'prod') {
      // Production: S3 deployment handled by launcher script
      console.log('🔧 AWS prod mode: S3 deployment completed by launcher');
      console.log('🌍 Public S3 Website:');
      console.log(`   ${publicUrl}`);
    } else {
      // Development: Just read from existing S3
      console.log('📖 AWS dev mode: Reading from existing S3 deployment...');
      console.log('🌍 Public S3 Website:');
      console.log(`   ${publicUrl}`);
    }

    console.log(`📦 Loading import map from: ${IMPORTMAP_URL}`);
    console.log('🔧 AWS Config:', AWS_CONFIG);
    importMapPromise = fetch(IMPORTMAP_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to fetch import map: ${response.status} ${response.statusText}`);
        }
        return response.json();
      })
      .then((importMap) => {
        // Configure SystemJS with the import map
        console.log('🔧 Configuring SystemJS with import map:', importMap);

        // Ensure SystemJS is available
        if (!window.System) {
          throw new Error('SystemJS is not available');
        }

        // Configure SystemJS with the import map
        if (window.System.addImportMap) {
          window.System.addImportMap(importMap);
        } else if (window.System.config) {
          window.System.config({ map: importMap.imports });
        } else {
          // Fallback: manually set the map
          window.System.map = window.System.map || {};
          Object.assign(window.System.map, importMap.imports);
        }

        console.log('✅ SystemJS configured with import map');
        return importMap;
      })
      .catch((error) => {
        handleNetworkError(error, 'Import map fetch from S3');
        // Return empty import map to prevent complete failure
        return { imports: {} };
      });

    loadApp = async (name) => {
      try {
        // Wait for import map to be loaded
        const importMap = await importMapPromise;
        const appNameMap = getAWSAppUrls();
        const moduleName = appNameMap[name];
        const url = importMap.imports[moduleName];

        if (!url) {
          throw new Error(`Module ${moduleName} not found in import map. Available modules: ${Object.keys(importMap.imports).join(', ')}`);
        }

        console.log(`Loading ${name} from S3: ${url}`);
        console.log(`🔍 Module name: ${moduleName}`);
        console.log(`🔍 Resolved URL: ${url}`);

        // Use unified module loader for external URLs
        const module = await loadModule(url, { isExternalUrl: true });
        console.log(`✅ SystemJS import successful for ${moduleName}:`, module);
        return resolveLifecycles(module, name);
      } catch (error) {
        throw handleNetworkError(error, `AWS S3 import for ${name}`);
      }
    };
    break;
  }

  case MODES.LOCAL:
  default:
    // Local mode - detect if production build (files served from root)
    // or development (individual ports)
    loadApp = (name) => {
      // Check if we're in production mode using environment variable
      const isProduction = envEnvironment === 'prod';

      // Debug information
      console.log('🔍 LOCAL Mode Debug Info:');
      console.log('  - URL:', window.location.href);
      console.log('  - Port:', window.location.port);
      console.log('  - SPA_MODE:', process.env.SPA_MODE);
      console.log('  - SPA_ENV:', process.env.SPA_ENV);
      console.log('  - envEnvironment:', envEnvironment);
      console.log('  - isProduction:', isProduction);
      console.log('  - Mode will be:', isProduction ? 'PRODUCTION (root server)' : 'DEVELOPMENT (individual ports)');
      const appUrls = getLocalAppUrls(isProduction);
      const url = appUrls[name];
      console.log(`🚀 Loading ${name} from ${url}`);
      console.log(`🔍 Debug: Using ${isProduction ? 'PRODUCTION' : 'DEVELOPMENT'} URLs for ${name}`);

      return loadModule(url, { isExternalUrl: true }).then((module) => {
        console.log(`✅ Successfully loaded ${name}:`, module);
        const lifecycles = resolveLifecycles(module, name);
        console.log(`✅ ${name} lifecycles resolved:`, {
          bootstrap: typeof lifecycles.bootstrap,
          mount: typeof lifecycles.mount,
          unmount: typeof lifecycles.unmount,
        });
        return lifecycles;
      }).catch((error) => {
        throw handleNetworkError(error, `Local import for ${name}`);
      });
    };
    break;
}

// Register applications using the selected loading strategy
singleSpa.registerApplication(
  'login',
  () => loadApp('single-spa-auth-app'),
  (location) => !isAuthenticated() || location.pathname === '/login',
);

singleSpa.registerApplication(
  'layout',
  () => loadApp('single-spa-layout-app'),
  showWhenAuthenticatedExcept(['/login']),
);

singleSpa.registerApplication(
  'home',
  () => loadApp('single-spa-home-app'),
  showWhenAuthenticatedAndAnyOf(['/', '/index.html']),
);

singleSpa.registerApplication(
  'angular',
  () => loadApp('single-spa-angular-app'),
  showWhenAuthenticatedAndPrefix(['/angular']),
);

singleSpa.registerApplication(
  'vue',
  () => loadApp('single-spa-vue-app'),
  showWhenAuthenticatedAndPrefix(['/vue']),
);

singleSpa.registerApplication(
  'react',
  () => loadApp('single-spa-react-app'),
  showWhenAuthenticatedAndPrefix(['/react']),
);

singleSpa.registerApplication(
  'vanilla',
  () => loadApp('single-spa-vanilla-app'),
  showWhenAuthenticatedAndPrefix(['/vanilla']),
);

singleSpa.registerApplication(
  'webcomponents',
  () => loadApp('single-spa-webcomponents-app'),
  showWhenAuthenticatedAndPrefix(['/webcomponents']),
);

singleSpa.registerApplication(
  'typescript',
  () => loadApp('single-spa-typescript-app'),
  showWhenAuthenticatedAndPrefix(['/typescript']),
);

singleSpa.registerApplication(
  'jquery',
  () => loadApp('single-spa-jquery-app'),
  showWhenAuthenticatedAndPrefix(['/jquery']),
);

singleSpa.registerApplication(
  'svelte',
  () => loadApp('single-spa-svelte-app'),
  showWhenAuthenticatedAndPrefix(['/svelte']),
);

// Add event listeners to debug Single-SPA lifecycle
window.addEventListener('single-spa:before-routing-event', (evt) => {
  console.log('📍 Single-SPA before routing event:', evt.detail);
});

window.addEventListener('single-spa:routing-event', (evt) => {
  console.log('📍 Single-SPA routing event:', evt.detail);
});

window.addEventListener('single-spa:app-change', (evt) => {
  console.log('📍 Single-SPA app change:', evt.detail);
});

// Enhanced routing for S3 deployments - handle /index.html paths
const currentPath = window.location.pathname;
if (currentPath === '/index.html') {
  console.log('🔄 S3 index.html detected, treating as root path');
  // Don't redirect, just let single-spa handle it
}

// Debug authentication and routing
console.log('🔍 Authentication Debug:');
console.log('  - isAuthenticated():', isAuthenticated());
console.log('  - currentPath:', currentPath);
console.log('  - sessionStorage token:', sessionStorage.getItem('token'));

// Auto-redirect to login if not authenticated and at root
if (!isAuthenticated() && (currentPath === '/' || currentPath === '/index.html')) {
  console.log('🔄 Not authenticated, redirecting to /login');
  window.history.pushState(null, null, '/login');
}

console.log('🚀 Starting Single-SPA...');
console.log('🔍 Single-SPA Debug:');
console.log('  - singleSpa object:', singleSpa);
console.log('  - singleSpa.start function:', typeof singleSpa.start);
console.log('  - window.singleSpa:', window.singleSpa);

try {
  singleSpa.start();
  console.log('✅ Single-SPA started successfully');
} catch (error) {
  console.error('❌ Single-SPA start failed:', error);
  // Try alternative start methods
  if (window.singleSpa && window.singleSpa.start) {
    console.log('🔄 Trying window.singleSpa.start()...');
    window.singleSpa.start();
    console.log('✅ Single-SPA started via window.singleSpa');
  } else {
    console.error('❌ No alternative single-spa start method found');
    throw error;
  }
}

// Log current location
console.log('📍 Current location:', window.location.pathname);
console.log('📍 Current search:', window.location.search);
console.log('📍 Authentication status:', isAuthenticated() ? 'Authenticated' : 'Not authenticated');

// Debug which apps should be active
console.log('🔍 App Activity Check:');
const location = { pathname: window.location.pathname };
console.log('  - login app should show:', !isAuthenticated() || location.pathname === '/login');
console.log('  - layout app should show:', isAuthenticated() && location.pathname !== '/login');
console.log('  - home app should show:', isAuthenticated() && (location.pathname === '/' || location.pathname === '/index.html'));
