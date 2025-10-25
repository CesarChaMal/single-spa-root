# NPM Package Publishing Guide

This guide explains how to publish microfrontends as NPM packages for use with the `npm` mode in this Single-SPA application.

## 📦 Publishing to NPM Registry

### Prerequisites

1. **NPM Account**: Create account at [npmjs.com](https://www.npmjs.com/)
2. **NPM CLI**: Install and login
   ```bash
   npm install -g npm
   npm login
   ```

### Step 1: Prepare Package

Each microfrontend needs proper package.json configuration:

```json
{
  "name": "@your-org/single-spa-auth-app",
  "version": "1.0.0",
  "description": "Vue authentication microfrontend",
  "main": "dist/single-spa-auth-app.umd.js",
  "files": [
    "dist/"
  ],
  "publishConfig": {
    "access": "public"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/your-org/single-spa-auth-app.git"
  },
  "keywords": [
    "single-spa",
    "microfrontend",
    "vue",
    "authentication"
  ]
}
```

### Step 2: Build for Production

```bash
# Build individual microfrontend
cd single-spa-auth-app
npm run build

# Or build all from root
npm run build:all
```

### Step 3: Publish Package

```bash
# Dry run to check what will be published
npm publish --dry-run

# Publish to NPM
npm publish
```

### Step 4: Update Root Application

Add the published package to root dependencies:

```json
{
  "dependencies": {
    "@your-org/single-spa-auth-app": "^1.0.0",
    "@your-org/single-spa-layout-app": "^1.0.0",
    "@your-org/single-spa-home-app": "^1.0.0",
    "@your-org/single-spa-angular-app": "^1.0.0",
    "@your-org/single-spa-vue-app": "^1.0.0",
    "@your-org/single-spa-react-app": "^1.0.0",
    "@your-org/single-spa-vanilla-app": "^1.0.0",
    "@your-org/single-spa-webcomponents-app": "^1.0.0",
    "@your-org/single-spa-typescript-app": "^1.0.0",
    "@your-org/single-spa-jquery-app": "^1.0.0",
    "@your-org/single-spa-svelte-app": "^1.0.0"
  }
}
```

Update imports in `root-application-npm.js`:

```javascript
singleSpa.registerApplication(
  'login',
  () => import('@your-org/single-spa-auth-app'),
  showWhenAnyOf(['/login']),
);
```

## 🏢 Publishing to Nexus Repository

### Prerequisites

1. **Nexus Repository Manager**: Access to Nexus instance
2. **NPM Configuration**: Configure npm to use Nexus registry

### Step 1: Configure NPM Registry

Create `.npmrc` file in project root:

```bash
# For scoped packages
@your-org:registry=https://nexus.your-company.com/repository/npm-private/

# For all packages (alternative)
registry=https://nexus.your-company.com/repository/npm-group/

# Authentication
//nexus.your-company.com/repository/npm-private/:_authToken=${NPM_TOKEN}
```

### Step 2: Set Authentication

```bash
# Option 1: Environment variable
export NPM_TOKEN=your-nexus-auth-token

# Option 2: NPM login (if Nexus supports it)
npm login --registry=https://nexus.your-company.com/repository/npm-private/
```

### Step 3: Configure Package Scope

Update package.json:

```json
{
  "name": "@your-org/single-spa-auth-app",
  "publishConfig": {
    "registry": "https://nexus.your-company.com/repository/npm-private/"
  }
}
```

### Step 4: Publish to Nexus

```bash
# Build the package
npm run build

# Publish to Nexus
npm publish
```

### Step 5: Install from Nexus

Update root application's `.npmrc`:

```bash
@your-org:registry=https://nexus.your-company.com/repository/npm-group/
//nexus.your-company.com/repository/npm-group/:_authToken=${NPM_TOKEN}
```

Install packages:

```bash
npm install @your-org/single-spa-auth-app
```

## 🔄 Automated Publishing with CI/CD

### GitHub Actions Example

Create `.github/workflows/publish.yml`:

```yaml
name: Publish Package

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build package
        run: npm run build
        
      - name: Publish to NPM
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

### Nexus CI/CD Example

```yaml
name: Publish to Nexus

on:
  push:
    branches: [main]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://nexus.your-company.com/repository/npm-private/'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build package
        run: npm run build
        
      - name: Publish to Nexus
        run: npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NEXUS_TOKEN }}
```

## 📋 Package Publishing Checklist

### Before Publishing

- [ ] Update version in package.json
- [ ] Build package (`npm run build`)
- [ ] Test package locally (`npm pack` and test)
- [ ] Update CHANGELOG.md
- [ ] Commit and tag release

### Package.json Requirements

- [ ] Correct `name` (with scope if needed)
- [ ] Proper `version` (semantic versioning)
- [ ] Valid `main` entry point
- [ ] Include `files` array
- [ ] Set `publishConfig` if needed
- [ ] Add relevant `keywords`
- [ ] Framework-specific dependencies (Vue, React, Angular, etc.)
- [ ] FontAwesome dependencies if using icons

### Security Considerations

- [ ] Never commit auth tokens
- [ ] Use environment variables for credentials
- [ ] Configure proper access levels
- [ ] Review package contents before publishing

## 🛠 Troubleshooting

### Common Issues

**Authentication Failed:**
```bash
npm login --registry=https://your-registry.com
```

**Package Already Exists:**
```bash
# Update version and republish
npm version patch
npm publish
```

**Scoped Package Access:**
```bash
# Make scoped package public
npm publish --access public
```

**Nexus SSL Issues:**
```bash
# Disable SSL verification (not recommended for production)
npm config set strict-ssl false
```

### Useful Commands

```bash
# Check current registry
npm config get registry

# View package info
npm view @your-org/package-name

# List published versions
npm view @your-org/package-name versions --json

# Unpublish (within 24 hours)
npm unpublish @your-org/package-name@1.0.0
```

## 📚 Additional Resources

- [NPM Publishing Guide](https://docs.npmjs.com/packages-and-modules/contributing-packages-to-the-registry)
- [Nexus Repository Manager](https://help.sonatype.com/repomanager3)
- [Semantic Versioning](https://semver.org/)
- [NPM Scopes](https://docs.npmjs.com/about-scopes)