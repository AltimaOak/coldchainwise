
# ColdchainWise

> AI-powered cold-chain logistics route intelligence platform built with React, TypeScript, Firebase, Google Maps, and Google Gemini AI.

ColdchainWise is a modern web application that helps logistics operators plan and analyze temperature-sensitive shipments before dispatch. It combines route planning, AI-powered risk analysis, and cold-chain compliance guidance to support the transportation of products such as vaccines, pharmaceuticals, dairy products, seafood, frozen food,fruits and fresh produce.

---

# Features

## Route Planning

- Select shipment origin and destination
- View optimized transportation routes
- Calculate travel distance and estimated duration
- Interactive Google Maps visualization

## Cold Chain Analysis

- Cargo-specific temperature recommendations
- Temperature risk assessment
- Spoilage risk analysis
- Cold-chain handling guidance

## AI-Powered Insights

Using Google Gemini AI, the application can generate:

- Route risk assessment
- Shipment recommendations
- Compliance guidance
- Operational insights
- Temperature management suggestions

## Authentication

- Secure user registration
- User login
- Protected dashboard
- Session persistence

## Dashboard

- Shipment overview
- Route information
- Analytics and charts
- Responsive UI
- Interactive data visualization

---

# Technology Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 |
| Language | TypeScript |
| Build Tool | Vite |
| Routing | React Router v7 |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Charts | Recharts |
| Icons | React Icons |
| Authentication | Firebase Authentication |
| Database | Firebase Realtime Database |
| Maps | Google Maps JavaScript API |
| Routing API | Google Maps Directions API |
| AI | Google Gemini AI |
| Linting | OxLint |

---

# Google Services Used

ColdchainWise integrates several Google services to provide mapping, route intelligence, and AI-assisted shipment analysis.

## Google Maps JavaScript API

The Google Maps JavaScript API is used to display interactive maps within the application.

**Used for**

- Rendering shipment routes
- Displaying origin and destination markers
- Interactive map controls
- Route visualization

---

## Google Maps Directions API

The Directions API calculates the optimal road route between two locations.

**Used for**

- Distance calculation
- Estimated travel time
- Route generation
- ETA estimation
- Route polyline rendering

---

## Google Gemini AI

Google Gemini AI analyzes shipment details and generates logistics insights before dispatch.

**Used for**

- Shipment risk assessment
- Temperature exposure analysis
- Cold-chain compliance guidance
- Cargo handling recommendations
- AI-generated logistics insights

---

# Firebase Services

## Firebase Authentication

Provides secure authentication for users.

**Features**

- User registration
- Secure login
- Session management
- Protected routes
- Authentication state persistence

---

## Firebase Realtime Database

Stores application data and synchronizes it in real time.

**Used for**

- User information
- Shipment records
- Dashboard data
- Application state
- Real-time synchronization

---

# Project Structure

```
LogisPro/
│
├── public/
│
├── src/
│   ├── assets/
│   │
│   ├── components/
│   │   ├── Navbar
│   │   ├── Hero
│   │   ├── Features
│   │   ├── Cards
│   │   ├── FAQ
│   │   ├── Footer
│   │   └── Shared Components
│   │
│   ├── pages/
│   │   ├── Landing
│   │   ├── Login
│   │   ├── Signup
│   │   └── Dashboard
│   │
│   ├── contexts/
│   │   └── AuthContext
│   │
│   ├── hooks/
│   │   └── useAuth
│   │
│   ├── services/
│   │   ├── maps.ts
│   │   ├── directions.ts
│   │   └── gemini.ts
│   │
│   ├── firebase/
│   │   ├── auth.ts
│   │   ├── database.ts
│   │   └── config.ts
│   │
│   ├── interfaces/
│   │   ├── Shipment.ts
│   │   ├── Vehicle.ts
│   │   └── User.ts
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── .env.example
├── package.json
└── README.md
```

---

# Installation

Clone the repository

```bash
git clone <repository-url>
```

Move into the project directory

```bash
cd LogisPro
```

Install dependencies

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the project root.

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

If Google Maps, Firebase, or Gemini credentials are not configured, the application automatically switches to **Demo Mode** using simulated data where applicable.

---

# Running the Project

Start the development server

```bash
npm install
npm run dev
```

Build the project

```bash
npm run build
```

Preview the production build

```bash
npm run preview
```

Run lint checks

```bash
npm run lint
```

---

# Application Flow

```
User
   │
   ▼
Landing Page
   │
   ▼
Login / Signup
   │
   ▼
Firebase Authentication
   │
   ▼
Protected Dashboard
   │
   ├────────────► Google Maps JavaScript API
   │                  │
   │                  ▼
   │           Interactive Map
   │
   ├────────────► Google Maps Directions API
   │                  │
   │                  ▼
   │        Distance • Duration • Route
   │
   ├────────────► Google Gemini AI
   │                  │
   │                  ▼
   │      Risk Analysis & AI Recommendations
   │
   └────────────► Firebase Realtime Database
                      │
                      ▼
               Store & Retrieve Data
```

---

# Available Scripts

| Command | Description |
|----------|-------------|
| `npm run dev` | Starts the Vite development server |
| `npm run build` | Creates the production build |
| `npm run preview` | Runs the production build locally |
| `npm run lint` | Runs OxLint checks |

---

# Demo Mode

To simplify development, ColdchainWise supports a built-in Demo Mode.

When Firebase or Gemini API credentials are unavailable, the application automatically uses simulated data so the UI and application flow remain functional without requiring cloud services.

---

# Future Enhancements

- Live GPS vehicle tracking
- Fleet management dashboard
- Driver mobile application
- IoT temperature sensor integration
- Shipment history
- Weather-aware route analysis
- Predictive delay detection
- Email and notification support
- Administrative analytics
- Multi-warehouse management

---

# License

This project is intended for educational purposes.

---

# Developed With

- React 19
- TypeScript
- Vite
- Tailwind CSS
- Firebase Authentication
- Firebase Realtime Database
- Google Maps JavaScript API
- Google Maps Directions API
- Google Gemini AI
- Framer Motion
- Recharts
- React Router
- OxLint
````
