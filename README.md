# Sync Core v2.0

A professional administrative portal for syncing HTML templates.

## 🚀 Deployment to GitHub Pages

To deploy this application to GitHub Pages, follow these steps:

1. **Export to GitHub**:
   - In AI Studio, click the **Settings** (gear icon).
   - Select **Export to GitHub**.
   - Create a repository named `hmcmsite`.

2. **Add GitHub Token to Repository Secrets**:
   - Go to your repository on GitHub (`https://github.com/seanjo77/hmcmsite`).
   - Navigate to **Settings** > **Secrets and variables** > **Actions**.
   - Click **New repository secret**.
   - Name: `VITE_GITHUB_TOKEN`
   - Value: (사용자님의 GitHub Personal Access Token)

3. **Configure GitHub Pages**:
   - Go to **Settings** > **Pages**.
   - Set **Source** to **GitHub Actions**.

4. **Deploy Workflow**:
   - Create a file at `.github/workflows/deploy.yml` with the following:

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
    env:
      FORCE_JAVASCRIPT_ACTIONS_TO_NODE24: true
      VITE_GITHUB_TOKEN: ${{ secrets.VITE_GITHUB_TOKEN }} # 이 부분이 토큰을 빌드에 주입합니다.
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Set up Node
        uses: actions/setup-node@v4
        with:
          node-version: 24
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

## 🔐 Environment Variables

The application requires a GitHub Personal Access Token to broadcast files.

1. **Local Development**: Create a `.env` file and add `VITE_GITHUB_TOKEN=your_token`.
2. **GitHub Pages runtime**: The token must be accessible to the browser. 
   - **Note**: Since this is a client-side app on GitHub Pages, the token in `import.meta.env` will be bundled into the JavaScript. 
   - **Security Warning**: Only use a token with minimal permissions (fine-grained repo access to `hmcmsite` only) if you plan to share the URL publicly.

## Features

- **GitHub API Integration**: Lists and commits files directly to your repository.
- **Dark Mode UI**: Technical aesthetic with glass-morphism.
- **Fast Sync**: Drag-and-drop file upload zone.
- **Secure Access**: Admin terminal login interface.

