# single-spa-root

> **Part of [Demo Microfrontends](https://github.com/cesarchamal/demo-microfrontends)** - A comprehensive Single-SPA microfrontend architecture demonstration

<img src="https://single-spa.js.org/img/logo-white-bgblue.svg" width="50" height="50">
[![npm version](https://img.shields.io/npm/v/single-spa-root.svg?style=flat-square)](https://www.npmjs.org/package/single-spa-root)

Single-spa application example which imports registered applications from NPM packages and manages authentication features such as login.

## 🏗️ Microfrontend Architecture

This application is the **orchestrator** of **12 microfrontends** in the demo-microfrontends project:

| Microfrontend | Framework | Port | Route | Repository |
|---------------|-----------|------|-------|------------|
| 🔐 Auth App | Vue.js | 4201 | /login | [single-spa-auth-app](https://github.com/cesarchamal/single-spa-auth-app) |
| 🎨 Layout App | Vue.js | 4202 | All routes | [single-spa-layout-app](https://github.com/cesarchamal/single-spa-layout-app) |
| 🏠 Home App | AngularJS | 4203 | / | [single-spa-home-app](https://github.com/cesarchamal/single-spa-home-app) |
| 🅰️ Angular App | Angular 8 | 4204 | /angular/* | [single-spa-angular-app](https://github.com/cesarchamal/single-spa-angular-app) |
| 💚 Vue App | Vue.js 2 | 4205 | /vue/* | [single-spa-vue-app](https://github.com/cesarchamal/single-spa-vue-app) |
| ⚛️ React App | React 16 | 4206 | /react/* | [single-spa-react-app](https://github.com/cesarchamal/single-spa-react-app) |
| 🍦 Vanilla App | ES2020+ | 4207 | /vanilla/* | [single-spa-vanilla-app](https://github.com/cesarchamal/single-spa-vanilla-app) |
| 🧩 Web Components | Lit | 4208 | /webcomponents/* | [single-spa-webcomponents-app](https://github.com/cesarchamal/single-spa-webcomponents-app) |
| 📘 TypeScript App | TypeScript | 4209 | /typescript/* | [single-spa-typescript-app](https://github.com/cesarchamal/single-spa-typescript-app) |
| 💎 jQuery App | jQuery 3.6 | 4210 | /jquery/* | [single-spa-jquery-app](https://github.com/cesarchamal/single-spa-jquery-app) |
| 🔥 Svelte App | Svelte 3 | 4211 | /svelte/* | [single-spa-svelte-app](https://github.com/cesarchamal/single-spa-svelte-app) |
| **🎯 Root App** | **Single-SPA** | **8080** | **Orchestrator** | **This repo** |

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
npm start                       # Build and start production server
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
* **root-application-dynamic.js:** Unified dynamic mode-aware MFE registration supporting all deployment strategies
* **server.js:** Express server for production mode
* **webpack.config.js:** Bundles root app with mode-specific configurations and environment variables
* **index.html:** Template with dynamic mode configuration injection

### Loading Strategies
* **Local Mode:** SystemJS imports from localhost ports (dev) or static files (prod)
* **NPM Mode:** CDN imports from jsdelivr for published NPM packages
* **Nexus Mode:** CDN imports from private Nexus registry
* **GitHub Mode:** Remote loading from GitHub Pages repositories
* **AWS Mode:** Dynamic loading via S3-hosted import maps

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
