# Sync Core v2.0

A professional administrative portal for syncing HTML templates.

## 🚀 Deployment to GitHub Pages

To deploy this application to GitHub Pages from AI Studio, follow these steps:

1. **Export to GitHub**:
   - In AI Studio, click the **Settings** (gear icon).
   - Select **Export to GitHub**.
   - Create a new repository or select an existing one.

2. **Wait for CI/CD**:
   - Vite projects usually require a build step to produce static files.
   - The export includes a standard `package.json`.

3. **Configure GitHub Pages**:
   - Go to your repository on GitHub.com.
   - Go to **Settings** > **Pages**.
   - In the **Build and deployment** section, under **Source**, select **GitHub Actions**.
   - Search for the "Static HTML" or "Vite" template, or use the following workflow file.

### Sample GitHub Action (`.github/workflows/deploy.yml`)

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: ["main"]
permissions:
  contents: read
  pages: write
  id-token: write
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      - name: Install dependencies
        run: npm install
      - name: Build
        run: npm run build
      - name: Setup Pages
        uses: actions/configure-pages@v4
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

## Features

- **Dark Mode UI**: Technical aesthetic with glass-morphism.
- **Fast Sync**: Drag-and-drop file upload zone.
- **Asset Monitoring**: Real-time asset list with status tracking.
- **Responsive Design**: Works across different screen sizes.
