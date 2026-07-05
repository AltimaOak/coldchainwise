# LogisPro

LogisPro is a React + TypeScript web app for cold-chain logistics route intelligence. It helps operators analyze shipping routes, estimate temperature risk, and review compliance guidance before dispatching sensitive cargo.

## Overview

The application provides a polished experience for:

- entering an origin and destination for route analysis
- viewing estimated distance and duration
- checking cargo-specific temperature limits
- generating AI-assisted risk, spoilage, and compliance insights
- signing in and using a protected dashboard experience

The UI is designed around cold-chain transport use cases such as vaccines, medicine, dairy, seafood, frozen food, and fresh produce.

## Tech Stack

- React 19
- TypeScript
- Vite
- React Router
- Firebase Authentication and Realtime Database
- Google Maps Directions API
- Google Gemini AI
- Framer Motion and Recharts

## Project Structure

- src/pages: landing page, login, signup, and dashboard views
- src/components: reusable UI sections such as navbar, cards, FAQ, and previews
- src/services: route analysis, directions, and Gemini AI integrations
- src/firebase: Firebase initialization and environment-based configuration
- src/contexts and src/hooks: authentication state and app-wide hooks

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a local environment file:
   ```bash
   cp .env.example .env
   ```
   If you do not have the required API credentials yet, the app can still run in demo/simulation mode.

3. Add the following environment variables to your .env file:
   ```env
   VITE_GEMINI_API_KEY=your_gemini_api_key
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_DATABASE_URL=https://your_project-default-rtdb.firebaseio.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Available Scripts

- npm run dev: start the Vite development server
- npm run build: build the production bundle
- npm run preview: preview the production build locally
- npm run lint: run the Oxlint checks

## Notes

- The app uses Gemini AI for route analysis when a valid API key is configured.
- If Firebase or Gemini credentials are missing, the app gracefully falls back to simulated/demo behavior.
- For full route and map functionality, ensure your Google Maps configuration is set up correctly.
