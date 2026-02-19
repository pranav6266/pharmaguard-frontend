# 🏗️ PharmaGuard Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      BROWSER / CLIENT                       │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │          React Application (Vite)                      │ │
│  │                                                        │ │
│  │  ┌──────────────────────────────────────────────────┐ │ │
│  │  │  Clerk Provider                                  │ │ │
│  │  │  (Authentication Context)                        │ │ │
│  │  │                                                  │ │ │
│  │  │  ┌────────────────────────────────────────────┐ │ │ │
│  │  │  │  Browser Router                            │ │ │ │
│  │  │  │                                            │ │ │ │
│  │  │  │  Routes:                                   │ │ │ │
│  │  │  │  • / (Landing or Dashboard)               │ │ │ │
│  │  │  │  • /sign-up (Signup Page)                 │ │ │ │
│  │  │  │  • /sign-in (Signin Page)                 │ │ │ │
│  │  │  │  • /dashboard (Protected Dashboard)       │ │ │ │
│  │  │  │                                            │ │ │ │
│  │  │  │  ┌──────────────────────────────────────┐ │ │ │
│  │  │  │  │  Components                          │ │ │ │
│  │  │  │  │  ├── Navbar                          │ │ │ │
│  │  │  │  │  ├── Landing                         │ │ │ │
│  │  │  │  │  ├── SignUp                          │ │ │ │
│  │  │  │  │  ├── SignIn                          │ │ │ │
│  │  │  │  │  ├── Dashboard                       │ │ │ │
│  │  │  │  │  │   ├── UploadCard                  │ │ │ │
│  │  │  │  │  │   ├── MedicationCard              │ │ │ │
│  │  │  │  │  │   └── ResultsView                 │ │ │ │
│  │  │  │  │  └── ...                             │ │ │ │
│  │  │  │  └──────────────────────────────────────┘ │ │ │
│  │  │  └────────────────────────────────────────────┘ │ │ │
│  │  └──────────────────────────────────────────────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTPS
                              │
┌─────────────────────────────────────────────────────────────┐
│              CLERK AUTHENTICATION SERVICE                   │
│                   (Cloud Platform)                          │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌────────────────────────────────────────────────────────┐ │
│  │  User Authentication                                  │ │
│  │  ├── Email + Password                                │ │
│  │  ├── Google OAuth                                    │ │
│  │  ├── Session Management                             │ │
│  │  └── User Data Storage                              │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## Authentication Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    USER ACTIONS                              │
└──────┬──────────────────────────────────────────────────────┘
       │
       ├─── Visits /, Not Logged In
       │         ↓
       │    [LANDING PAGE]
       │    • Features overview
       │    • Sign Up button
       │    • Sign In link
       │
       ├─── Clicks "Sign Up Now"
       │         ↓
       │    Navigate to /sign-up
       │         ↓
       │    [SIGNUP PAGE]
       │    • Clerk SignUp Component
       │    • Google button
       │    • Email/Password form
       │
       ├─── Enters Email & Password (or Google)
       │         ↓
       │    Clerk Validates
       │         │
       │         ├─ Valid ─→ Create Account ─→ Auth Token
       │         │                                    │
       │         └─ Invalid ─→ Show Error Message ──┘
       │
       ├─── Account Created Successfully
       │         ↓
       │    Redirect to /dashboard
       │         ↓
       │    useUser() hook → { isSignedIn: true }
       │         ↓
       │    [DASHBOARD - PROTECTED]
       │    • Navbar shows (isSignedIn = true)
       │    • Welcome message with user name
       │    • VCF upload functionality
       │    • Medication analysis
       │    • Results display
       │
       ├─── Clicks Logout
       │         ↓
       │    handleLogout() → signOut()
       │         ↓
       │    Session Cleared
       │    Auth Token Invalidated
       │         ↓
       │    Navigate to /
       │         ↓
       │    useUser() hook → { isSignedIn: false }
       │         ↓
       │    Redirect to Landing Page
       │
       └─── Cycle repeats...
```

---

## Component Hierarchy

```
App
├── ClerkProvider (from main.jsx)
│   └── BrowserRouter
│       ├── Navbar (conditional - only if isSignedIn)
│       └── Routes
│           ├── Route: /
│           │   └── Landing (if not signed in)
│           │   └── Dashboard (if signed in)
│           │
│           ├── Route: /sign-up
│           │   └── SignUp
│           │       └── ClerkSignUp (Clerk component)
│           │
│           ├── Route: /sign-in
│           │   └── SignIn
│           │       └── ClerkSignIn (Clerk component)
│           │
│           └── Route: /dashboard
│               └── Dashboard (protected)
│                   ├── UploadCard
│                   ├── MedicationCard
│                   └── ResultsView
```

---

## State Management

```
Global State (Clerk)
├── user: {
│   ├── id: "user_123"
│   ├── firstName: "John"
│   ├── lastName: "Doe"
│   ├── emailAddresses: [{emailAddress: "john@example.com"}]
│   ├── profileImageUrl: "..."
│   └── createdAt: "2024-..."
│}
├── isSignedIn: true/false
└── isLoaded: true/false

Local State (Dashboard)
├── file: File object or null
├── results: Analysis results or null
└── isAnalyzing: true/false
```

---

## Data Flow

```
┌──────────────────────────────────────────────────┐
│         Landing Page (Entry Point)               │
└────┬──────────────────────────────────────────┬──┘
     │                                          │
     ▼                                          ▼
[Sign Up Button]                        [Sign In Link]
     │                                          │
     ▼                                          ▼
┌──────────────────┐                 ┌──────────────────┐
│  SignUp Page     │                 │  SignIn Page     │
│  - Email Input   │                 │  - Email Input   │
│  - Password      │                 │  - Password      │
│  - Google OAuth  │                 │  - Google OAuth  │
└────┬─────────────┘                 └────┬─────────────┘
     │                                    │
     └──────────────────┬─────────────────┘
                        │
                    Send to Clerk
                        │
                        ▼
            ┌─────────────────────────┐
            │  Clerk Validates        │
            │  - Checks email         │
            │  - Verifies password    │
            │  - Creates session      │
            └────┬────────────────────┘
                 │
        ┌────────┴─────────┐
        │ Valid           │ Invalid
        ▼                 ▼
   Create Session    Show Error
        │
        ▼
   Return User Data
   + Auth Token
        │
        ▼
   Redirect to Dashboard
        │
        ▼
┌──────────────────────────────┐
│     Dashboard (Protected)    │
│     - useUser() hook checks  │
│     - { isSignedIn: true }   │
│     - Shows user name        │
│     - Upload/Analyze         │
│     - Display Results        │
└──────────────────────────────┘
        │
        ▼ (On logout)
    Clear Session
        │
        ▼
   Return to Landing
```

---

## File Organization

```
src/
├── pages/                    ← Route Components
│   ├── Landing.jsx          ├─ Landing page (hero + CTA)
│   ├── SignUp.jsx           ├─ Signup form
│   ├── SignIn.jsx           ├─ Login form
│   └── Dashboard.jsx        └─ Main app (protected)
│
├── components/              ← Reusable Components
│   ├── Navbar.jsx           ├─ Navigation (auth-aware)
│   ├── UploadCard.jsx       ├─ File upload
│   ├── MedicationCard.jsx   ├─ Med selection
│   └── ResultsView.jsx      └─ Results display
│
├── styles/                  ← Stylesheets
│   ├── Landing.css          ├─ Landing styles
│   ├── Auth.css             ├─ Auth pages styles
│   └── Dashboard.css        └─ Dashboard styles
│
├── App.jsx                  ← Main routing logic
├── main.jsx                 ← App entry point (Clerk provider)
└── index.css                └─ Global styles
```

---

## Request/Response Flow

```
Browser                    Clerk API              Backend (Optional)
  │                            │                          │
  ├─ User enters credentials   │                          │
  │                            │                          │
  ├──────────────────────────→ │                          │
  │   POST /signup             │                          │
  │   { email, password }      │                          │
  │                            │                          │
  │                      Validates                        │
  │                      Creates user                     │
  │                      Generates token                  │
  │                            │                          │
  │ ←──────────────────────────│                          │
  │   { user, session, token } │                          │
  │                            │                          │
  ├─ Redirect to /dashboard   │                          │
  │                            │                          │
  ├─ Load Dashboard           │                          │
  │  useUser() reads token    │                          │
  │                            │                          │
  ├─ Upload VCF file ─────────────────────────────────→  │
  │   Authorization header    │                      Analyze
  │   { token: user.token }   │                      file
  │                            │                          │
  │                      Pass-through                     │
  │                      (optional verification)         │
  │                            │ ←─────────────────────── │
  │                            │   Results               │
  │ ←─────────────────────────────────────────────────── │
  │   Display Results         │                          │
```

---

## Security & Session Management

```
┌─────────────────────────────────────────┐
│      User Authentication Process        │
└─────────────────────────────────────────┘

1. Signup/Login
   ├─ User provides credentials
   ├─ Sent to Clerk over HTTPS
   ├─ Clerk validates and hashes password
   └─ Session token generated

2. Session Creation
   ├─ Clerk creates secure session
   ├─ Returns session + token
   ├─ Token stored in browser
   └─ Auto-attached to requests

3. Protected Routes
   ├─ useUser() hook checks token
   ├─ If valid → Show dashboard
   ├─ If invalid → Show landing
   └─ Automatic redirect on state change

4. Logout
   ├─ signOut() called
   ├─ Token invalidated on Clerk
   ├─ Local session cleared
   ├─ Redirect to landing
   └─ Cannot use old token anymore

5. Security Features
   ├─ HTTPS only
   ├─ CSRF protection
   ├─ XSS prevention (React)
   ├─ Secure session storage
   ├─ OAuth 2.0 for Google
   └─ Password hashing (bcrypt)
```

---

## Deployment Architecture

```
Development
    ↓
Local: http://localhost:5173
    │
    ├─ npm run dev
    ├─ Clerk test key
    ├─ Hot reloading
    └─ Local testing
    │
    ↓
Production Build
    │
    ├─ npm run build
    ├─ Optimized output
    ├─ dist/ folder created
    └─ Minified & compressed
    │
    ↓
Deployment Platform (Choose one)
    │
    ├─ Vercel
    │  ├─ Connect GitHub
    │  ├─ Auto-deploy
    │  └─ Prod Clerk key
    │
    ├─ Netlify
    │  ├─ Connect GitHub
    │  ├─ Build script
    │  └─ Prod Clerk key
    │
    ├─ AWS / S3 + CloudFront
    │  ├─ Upload dist/
    │  ├─ CDN distribution
    │  └─ Prod Clerk key
    │
    └─ Self-hosted
       ├─ Docker container
       ├─ Own server
       └─ Prod Clerk key
    │
    ↓
Production
    │
    ├─ https://yourdomain.com
    ├─ Clerk production key
    ├─ Real users
    └─ Full VCF analysis
```

---

## Summary of Architecture

✅ **Frontend Only** - No backend required initially (Clerk handles auth)  
✅ **Scalable** - Ready for backend API integration  
✅ **Secure** - Industry-standard authentication (Clerk)  
✅ **Modern** - React + Vite + React Router  
✅ **Responsive** - Works on all devices  
✅ **Maintainable** - Clean component structure  
✅ **Documented** - Comprehensive guides included  

Ready to deploy! 🚀
