# single-spa-root

> **Part of [Demo Microfrontends](https://github.com/cesarchamal/demo-microfrontends)** - A comprehensive Single-SPA microfrontend architecture demonstration

<img src="https://single-spa.js.org/img/logo-white-bgblue.svg" width="50" height="50">

[![npm version](https://img.shields.io/npm/v/@cesarchamal/single-spa-root.svg?style=flat-square)](https://www.npmjs.com/package/@cesarchamal/single-spa-root)

Single-spa application example which imports registered applications from NPM packages and manages authentication features such as login.

## 🏗️ Microfrontend Architecture

This application is the **orchestrator** of **12 microfrontends** in the demo-microfrontends project:

| Microfrontend | Framework | Build Tool | Port | Route | Repository |
|---------------|-----------|------------|------|-------|------------|
| **🎯 Root App** | **Single-SPA + SystemJS** | **Webpack 4** | **8080** | **Orchestrator** | **This repo** |
| 🔐 Auth App | Vue.js 2 + Vue CLI | Vue CLI Service | 4201 | /login | [single-spa-auth-app](https://github.com/cesarchamal/single-spa-auth-app) |
| 🎨 Layout App | Vue.js 2 + Bootstrap Vue | Vue CLI Service | 4202 | All routes | [single-spa-layout-app](https://github.com/cesarchamal/single-spa-layout-app) |
| 🏠 Home App | AngularJS 1.x + Bootstrap | Webpack 4 | 4203 | / | [single-spa-home-app](https://github.com/cesarchamal/single-spa-home-app) |
| 🅰️ Angular App | Angular 8 + Angular CLI | Angular CLI | 4204 | /angular/* | [single-spa-angular-app](https://github.com/cesarchamal/single-spa-angular-app) |
| 💚 Vue App | Vue.js 2 + Vue Router | Vue CLI Service | 4205 | /vue/* | [single-spa-vue-app](https://github.com/cesarchamal/single-spa-vue-app) |
| ⚛️ React App | React 16 + React Router | Create React App | 4206 | /react/* | [single-spa-react-app](https://github.com/cesarchamal/single-spa-react-app) |
| 🍦 Vanilla App | ES2020+ Modules | Webpack 4 | 4207 | /vanilla/* | [single-spa-vanilla-app](https://github.com/cesarchamal/single-spa-vanilla-app) |
| 🧩 Web Components | Lit + Shadow DOM | Webpack 4 | 4208 | /webcomponents/* | [single-spa-webcomponents-app](https://github.com/cesarchamal/single-spa-webcomponents-app) |
| 📘 TypeScript App | TypeScript + Strict Mode | Webpack 4 + TS Loader | 4209 | /typescript/* | [single-spa-typescript-app](https://github.com/cesarchamal/single-spa-typescript-app) |
| 💎 jQuery App | jQuery 3.6 + Bootstrap | Webpack 4 | 4210 | /jquery/* | [single-spa-jquery-app](https://github.com/cesarchamal/single-spa-jquery-app) |
| 🔥 Svelte App | Svelte 3 + Rollup | Rollup + Svelte Plugin | 4211 | /svelte/* | [single-spa-svelte-app](https://github.com/cesarchamal/single-spa-svelte-app) |

**Main Repository**: [demo-microfrontends](https://github.com/cesarchamal/demo-microfrontends)

---

## ✍🏻 Motivation

This application demonstrates a comprehensive microfrontend architecture using Single-SPA with multiple deployment strategies including local development, NPM packages, Nexus private registry, GitHub Pages, and AWS S3. It showcases 12 different microfrontends built with various frameworks and technologies.

---

## ▶️ Demo

**Live Demo:** [http://single-spa-demo-774145483743.s3-website.eu-central-1.amazonaws.com/](http://single-spa-demo-774145483743.s3-website.eu-central-1.amazonaws.com/)

**Login credentials:**

| User  | Password |
| ----- | -------- |
| admin | 12345    |

---

## ⚙️ Node.js Compatibility & Setup

This project supports modern Node.js versions with legacy provider compatibility.

**Recommended:**

* **Node.js:** v18.0.0 or higher
* **npm:** v8.0.0 or higher
* **nvm:** for Node version management

```bash
nvm install 18
nvm use 18
```

**Note:** Uses `--openssl-legacy-provider` flag for Webpack 4 compatibility.

**Important:** Avoid using `--legacy-peer-deps --force` flags. Instead, use clean install approach for proper dependency resolution.

---

## 💻 Local Development & Production Flow

### Quick Start (Recommended)

Use the launcher scripts for automated setup:

```bash
# Windows
run.bat

# Linux/Mac
./run.sh
```

These scripts will:
- Clean npm cache and lock files
- Fresh install all dependencies
- Build all microfrontends
- Start the root server on port 8080

### Manual Development Mode

Use this when you want to run everything locally with hot reload:

```bash
npm run install   # Install root + all sub-app dependencies
npm run serve         # Start root app + all MFEs concurrently
```

Open: [http://localhost:8080](http://localhost:8080)

### Production Build & Run

Use this to prepare the production build and run it locally:

```bash
npm run build:all   # Build all microfrontends
npm run build       # Build root app into dist/
npm start           # Run Express server serving dist/
```

---

## 📜 NPM Scripts Overview

### Development Scripts
```bash
npm run serve                    # Start root + all MFEs concurrently
npm run serve:root              # Start only root application
npm run dev:serve:apps          # Serve all MFE dist folders
```

### Build Scripts
```bash
npm run build                   # Build root application
npm run build:dev               # Build root (development mode)
npm run build:prod              # Build root (production mode)
npm run build:aws:prod          # Build root for AWS S3 deployment
npm run prod:build:apps         # Build all microfrontends concurrently
npm start                       # Build and start production server
```

### Concurrent Scripts (Performance Optimized)
```bash
npm run dev:build:apps          # Build all MFEs concurrently (development)
npm run prod:build:apps         # Build all MFEs concurrently (production)
npm run dev:serve:apps          # Serve all MFE dist folders concurrently
npm run lint:strict             # Lint all apps concurrently (strict mode)
npm run lint:loose              # Lint all apps concurrently (loose mode)
```

### Utility Scripts
```bash
npm run install             # Install dependencies
npm run lint-all:strict         # Lint all apps (strict mode)
npm run lint-all:loose          # Lint all apps (loose mode)
npm run clean                   # Clean all node_modules
```

### Individual Publishing Scripts
```bash
# NPM Registry
npm run publish:npm:root:patch  # Publish root app with patch version bump
npm run publish:npm:auth:patch  # Publish auth app with patch version bump
# ... (similar for all 12 apps)

# Nexus Registry
npm run publish:nexus:root:patch # Publish root app to Nexus with patch version bump
# ... (similar for all 12 apps)
```

### Mode-Specific Scripts
```bash
npm run serve:local:dev         # Local development mode (all apps)
npm run serve:local:prod        # Local production mode (static files)
npm run serve:npm               # NPM packages mode (CDN loading)
npm run serve:nexus             # Nexus private registry mode
npm run serve:github            # GitHub Pages mode
npm run serve:aws               # AWS S3 mode (import map loading)
```

---

## 📦 Included Microfrontends

### Core Applications
* **🎯 single-spa-root** - SystemJS orchestrator with dynamic mode switching (Port 8080)
  - **Tech Stack**: Single-SPA, SystemJS, Webpack 4, Express.js, RxJS state management
  - **Features**: Multi-mode deployment, offline support, concurrent builds

### Authentication & Layout
* **🔐 single-spa-auth-app** - Vue.js 2 authentication with FontAwesome icons (Port 4201)
  - **Tech Stack**: Vue.js 2, Vue CLI, Bootstrap Vue, FontAwesome, single-spa-vue
  - **Features**: Login/logout, form validation, state management integration

* **🎨 single-spa-layout-app** - Vue.js 2 shared layout components (Port 4202)
  - **Tech Stack**: Vue.js 2, Bootstrap Vue, Vue Router, responsive design
  - **Features**: Header, navigation, footer, responsive layout

### Framework Demonstrations
* **🏠 single-spa-home-app** - AngularJS 1.x legacy integration (Port 4203)
  - **Tech Stack**: AngularJS 1.x, Bootstrap 4, Webpack 4, legacy support
  - **Features**: Home dashboard, employee showcase, cross-app communication

* **🅰️ single-spa-angular-app** - Angular 8 modern framework (Port 4204)
  - **Tech Stack**: Angular 8, Angular CLI, TypeScript, RxJS, Angular Router
  - **Features**: Component architecture, services, dependency injection

* **💚 single-spa-vue-app** - Vue.js 2 progressive framework (Port 4205)
  - **Tech Stack**: Vue.js 2, Vue CLI, Vue Router, Vuex-like state, single-spa-vue
  - **Features**: Reactive components, routing, state management

* **⚛️ single-spa-react-app** - React 16 with hooks (Port 4206)
  - **Tech Stack**: React 16, Create React App, React Router, React Hooks
  - **Features**: Functional components, custom hooks, context API

### Technology Showcases
* **🍦 single-spa-vanilla-app** - Pure ES2020+ JavaScript (Port 4207)
  - **Tech Stack**: ES2020+ modules, Webpack 4, native APIs, no frameworks
  - **Features**: Modern JavaScript, module system, DOM manipulation

* **🧩 single-spa-webcomponents-app** - Web Components with Lit (Port 4208)
  - **Tech Stack**: Lit framework, Web Components, Shadow DOM, Custom Elements
  - **Features**: Encapsulated components, reusable elements, modern standards

* **📘 single-spa-typescript-app** - TypeScript with strict typing (Port 4209)
  - **Tech Stack**: TypeScript, Webpack 4, TS Loader, strict mode, type definitions
  - **Features**: Type safety, compile-time validation, modern tooling

* **💎 single-spa-jquery-app** - jQuery 3.6 legacy integration (Port 4210)
  - **Tech Stack**: jQuery 3.6, Bootstrap 4, Webpack 4, legacy DOM manipulation
  - **Features**: Legacy support, DOM queries, event handling

* **🔥 single-spa-svelte-app** - Svelte 3 compile-time optimization (Port 4211)
  - **Tech Stack**: Svelte 3, Rollup, compile-time optimization, reactive statements
  - **Features**: No virtual DOM, compile-time optimization, reactive updates

**Total: 12 Microfrontends** demonstrating 10+ different technologies and integration patterns.

## 🔄 Shared State Management

All microfrontends are integrated with a centralized **RxJS-based state management system**:

### Global State Manager
```javascript
// Available globally in all microfrontends
window.stateManager
```

### Features
- **User Authentication State**: Login/logout synchronization across all apps
- **Employee Data API**: Shared JSON data accessible at `/employees.json`
- **Cross-App Event Broadcasting**: Real-time communication between frameworks
- **Visual State Showcase**: Interactive UI in 9 microfrontends showing shared state
- **Live Synchronization**: All state changes propagate instantly across frameworks

### Implementation Status
| App | User State | Employee Data | Cross-App Events | Visual Showcase |
|-----|------------|---------------|------------------|------------------|
| 🔐 Auth App | ✅ Login/Logout | ❌ | ✅ All events | ❌ |
| 🎨 Layout App | ✅ User display | ❌ | ✅ All events | ❌ |
| 🏠 Home App | ✅ User state | ✅ Employee display | ✅ Event feed | ✅ Full Showcase |
| 🅰️ Angular App | ✅ User state | ✅ Employee display | ✅ Event feed | ✅ Full Showcase |
| 💚 Vue App | ✅ User state | ✅ Employee display | ✅ Event feed | ✅ Full Showcase |
| ⚛️ React App | ✅ Custom hooks | ✅ Employee display | ✅ Event feed | ✅ Full Showcase |
| 🍦 Vanilla App | ✅ User state | ✅ Employee display | ✅ Event feed | ✅ Full Showcase |
| 🧩 Web Components | ✅ User state | ✅ Employee display | ✅ Event feed | ✅ Full Showcase |
| 📘 TypeScript App | ✅ User state | ✅ Employee display | ✅ Event feed | ✅ Full Showcase |
| 💎 jQuery App | ✅ User state | ✅ Employee display | ✅ Event feed | ✅ Full Showcase |
| 🔥 Svelte App | ✅ User state | ✅ Employee display | ✅ Event feed | ✅ Full Showcase |

---

## 🛠 How it works

### Core Files
* **root-application-dynamic.js:** Unified dynamic mode-aware MFE registration supporting all deployment strategies
* **server.js:** Express server for production mode
* **webpack.config.js:** Bundles root app with mode-specific configurations and environment variables
* **index.html:** Template with dynamic mode configuration injection

### Loading Strategies
* **Local Mode:** SystemJS imports from localhost ports (dev) or static files (prod)
  - **Development**: Hot reload from individual dev servers (ports 4201-4211)
  - **Production**: Static file serving from built dist directories
  - **Offline Support**: Local CDN dependencies for internet-free development
* **NPM Mode:** CDN imports from jsdelivr for published NPM packages
  - **Registry**: https://registry.npmjs.org/
  - **CDN**: https://cdn.jsdelivr.net/npm/
  - **Versioning**: Automatic version synchronization across packages
* **Nexus Mode:** CDN imports from private Nexus registry
  - **Registry**: Configurable private Nexus repository
  - **Authentication**: Token-based access control
  - **Enterprise**: Suitable for corporate environments
* **GitHub Mode:** Remote loading from GitHub Pages repositories
  - **Development**: Read from existing GitHub Pages
  - **Production**: Auto-create repositories and deploy
  - **CDN**: GitHub Pages static hosting
* **AWS Mode:** Dynamic loading via S3-hosted import maps
  - **Storage**: AWS S3 static website hosting
  - **CDN**: Optional CloudFront distribution
  - **Import Maps**: Dynamic module resolution

---

## 🔧 Troubleshooting

### Common Issues

1. **ESLint Configuration Errors**: Fixed to use `airbnb-base` instead of missing `@vue/eslint-config-airbnb`
2. **Dependency Conflicts**: Use clean install approach (cache clean + lock file removal)
3. **Port Conflicts**: Ensure ports 8080, 4201-4211 are available
4. **Node Version**: Use Node.js v18+ with legacy OpenSSL provider

### Clean Install

If you encounter dependency issues:

```bash
# Clear everything and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Offline Mode Issues

If offline dependencies are missing:

```bash
# Download offline dependencies (one-time setup)
npm run offline:setup

# Or manually
bash ./scripts/download-offline-deps.sh

# Then rebuild with offline mode
OFFLINE=true npm run build:prod
```

### Build Performance Issues

For faster builds, use concurrent scripts:

```bash
# Instead of sequential builds
npm run build:all               # ~15-20 minutes

# Use concurrent builds
npm run prod:build:apps         # ~3-5 minutes (3-4x faster)
```

## 📌 Notes

* Bootstrap & FontAwesome CSS are imported in **root-application-dynamic.js** to avoid duplication.
* FontAwesome dependencies added to all microfrontends with framework-specific packages.
* Login logic is hardcoded for demo purposes.
* `serve` script runs both the root and all 12 microfrontends in parallel.
* Use `lint-all:loose` or `lint-all:strict` to lint all MFEs at once.
* `install:all` script ensures dependencies for all MFEs are installed.
* ESLint configs added to all new microfrontends with appropriate parsers and rules.
* Dynamic mode switching supports local, NPM, Nexus, and GitHub loading strategies.
* All microfrontends include proper Single-SPA lifecycle methods and routing.
