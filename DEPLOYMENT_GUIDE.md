# CoupleQuest Deployment Guide

This guide outlines the steps required to update the CoupleQuest React application after a feature update and deploy the new build to the Siteground website.

## Prerequisites

1.  Ensure you have the latest code changes locally.
2.  **Database Setup:** Ensure the `CQUsers` table is created in your Siteground MySQL database.
3.  Node.js and npm must be installed on your local machine.
4.  All project dependencies must be installed (`npm install`).

## Step 1: Commit and Push Changes

Since your React application is deployed via Vercel/GitHub, you must commit and push your local changes to trigger a new Vercel build.

1.  Open your terminal in the project root directory.
2.  Stage all modified files:
    ```bash
    git add .
    ```
3.  Commit the changes (use a descriptive message):
    ```bash
    git commit -m "feat: Implement email logging and fix build configuration"
    ```
4.  Push the changes to your GitHub repository (assuming your branch is `main` or `master`):
    ```bash
    git push origin main
    ```
    *Note: This step triggers the Vercel deployment for the React application.*

## Step 2: Build the Application

The `build` script in `package.json` is configured to compile Tailwind CSS locally and run the Vite build process, generating optimized production assets in the `dist/` directory.

5.  Open your terminal in the project root directory (`d:/CODING_Apps/CoupleQuest`).
6.  Run the build command:

    ```bash
    npm run build
    ```

    This command executes: `npx tailwindcss -i ./src/input.css -o ./dist/output.css --minify && vite build`.

3.  Verify the build output shows `✓ built in X.XXs` and confirms the creation of files in the `dist/` directory.

## Step 3: Deploy Backend Changes (PHP)

The email logging feature relies on the `api.php` file running on your Siteground server.

1.  Connect to your Siteground hosting environment (e.g., via FTP/SFTP or Siteground File Manager).
2.  Navigate to the web root directory where your application is served (e.g., `public_html`).
3.  **Upload `api.php`:** Upload the updated `api.php` file from your local project root to the web root directory on your server, overwriting the existing file.

## Step 4: Deploy Frontend Changes (React Build)

The frontend changes (in `App.tsx` and `services/geminiService.ts`) are bundled into the `dist/` directory.

1.  Locate the newly generated `dist/` folder in your project directory (created in Step 1).
2.  **Upload `dist/` Contents:** Upload the entire contents of the local `dist/` folder to the web root directory on your server, overwriting all existing files.

    *   **Important:** Ensure you upload the contents of `dist/` (e.g., `index.html`, `assets/`, `output.css`) and not the `dist/` folder itself, unless your server is configured to serve from a nested directory.

3.  Clear your browser cache and visit the website to confirm the new features and layout are working correctly, and that emails are being logged to the `CQUsers` table upon first login.