# single-spa-root

<img src="https://single-spa.js.org/img/logo-white-bgblue.svg" width="50" height="50">
[![npm version](https://img.shields.io/npm/v/single-spa-root.svg?style=flat-square)](https://www.npmjs.org/package/single-spa-root)

Single-spa application example which imports registered applications from NPM packages and manages authentication features such as login.

---

## ✍🏻 Motivation

This application is a [demo](https://single-spa-with-npm-packages.herokuapp.com/) showing how to use single-spa with [Option 2: NPM packages](https://single-spa.js.org/docs/separating-applications#option-2-npm-packages) for splitting code.

---

## ▶️ Demo

**Live Demo:** [https://single-spa-with-npm-packages.herokuapp.com](https://single-spa-with-npm-packages.herokuapp.com/)
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
npm start                       # Build and start production server
```

### Utility Scripts
```bash
npm run install             # Install dependencies
npm run lint-all:strict         # Lint all apps (strict mode)
npm run lint-all:loose          # Lint all apps (loose mode)
npm run clean                   # Clean all node_modules
```

### Mode-Specific Scripts
```bash
npm run serve:local             # Local development mode
npm run serve:npm               # NPM packages mode
npm run serve:nexus             # Nexus private registry mode
npm run serve:github            # GitHub Pages mode
```

---

## 📦 Included Microfrontends

### Framework-Based Applications
* **single-spa-auth-app** - Vue.js 2 authentication (Port 4201)
* **single-spa-layout-app** - Vue.js 2 layout components (Port 4202)
* **single-spa-home-app** - AngularJS 1.x home page (Port 4203)
* **single-spa-angular-app** - Angular 8 application (Port 4204)
* **single-spa-vue-app** - Vue.js 2 features (Port 4205)
* **single-spa-react-app** - React 16 application (Port 4206)

### Technology Demonstration Applications
* **single-spa-vanilla-app** - Pure JavaScript ES2020+ (Port 4207)
* **single-spa-webcomponents-app** - Lit + Web Components (Port 4208)
* **single-spa-typescript-app** - TypeScript with strict typing (Port 4209)
* **single-spa-jquery-app** - jQuery 3.6 legacy integration (Port 4210)
* **single-spa-svelte-app** - Svelte 3 compile-time optimized (Port 4211)

**Total: 12 Microfrontends** demonstrating different technologies and integration patterns.

---

## 🛠 How it works

### Core Files
* **root-application-dynamic.js:** Dynamic mode-aware MFE registration with single-spa lifecycle rules
* **root-application-local.js:** Local development configuration
* **root-application-npm.js:** NPM packages configuration
* **root-application-nexus.js:** Nexus private registry configuration
* **root-application-github.js:** GitHub Pages remote loading configuration
* **server.js:** Express server for production mode
* **webpack.config.js:** Bundles root app with TypeScript, CSS, and ESLint support

### Loading Strategies
* **Local Mode:** SystemJS imports from localhost ports
* **NPM Mode:** Direct NPM package imports
* **Nexus Mode:** Scoped packages from private registry
* **GitHub Mode:** Remote loading from GitHub Pages

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
