# PharmaGuard - Clerk Authentication Setup Guide

## Overview

Your PharmaGuard application now has complete Clerk authentication integrated with:
- ✅ Google OAuth login
- ✅ Email + Password authentication
- ✅ Custom clean minimal signin/signup pages
- ✅ Landing page with signup CTA
- ✅ Protected dashboard
- ✅ User profile display in navbar
- ✅ Logout functionality

## Project Structure

```
src/
├── pages/
│   ├── Landing.jsx        # Landing page with signup CTA
│   ├── SignUp.jsx         # Sign up page
│   ├── SignIn.jsx         # Sign in page
│   └── Dashboard.jsx      # Protected dashboard (main app)
├── components/
│   ├── Navbar.jsx         # Updated with auth status & logout
│   ├── UploadCard.jsx     # File upload component
│   ├── MedicationCard.jsx # Medication selection
│   └── ResultsView.jsx    # Results display
├── styles/
│   ├── Landing.css        # Landing page styles
│   ├── Auth.css           # Authentication page styles
│   └── Dashboard.css      # Dashboard styles
├── App.jsx                # Updated with routing
├── main.jsx               # Updated with Clerk provider
└── index.css              # Existing styles (unchanged)
```

## Environment Setup

### 1. Clerk Configuration

Your Clerk public key is already configured in `.env.local`:

```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_aG9wZWZ1bC1taW5rLTI0LmNsZXJrLmFjY291bnRzLmRldiQ
```

### 2. Required Dependencies Installed

- `@clerk/clerk-react` - Clerk React components
- `react-router-dom` - Client-side routing
- `axios` - HTTP client (optional, for API calls)

## Authentication Flow

### User Journey:

1. **Landing Page** (`/`)
   - Unauthenticated users see the landing page
   - Features overview with emojis
   - "Sign Up Now" button leading to signup page
   - "Sign In" link for existing users

2. **Sign Up** (`/sign-up`)
   - Email + Password registration
   - Google OAuth option
   - Auto-redirects to dashboard after signup

3. **Sign In** (`/sign-in`)
   - Email + Password login
   - Google OAuth option
   - Auto-redirects to dashboard after signin

4. **Dashboard** (`/dashboard`)
   - Protected route - only accessible when signed in
   - Shows welcome message with user's first name
   - Original PharmaGuard functionality (upload, analyze, results)
   - Navbar shows user info and logout button

5. **Logout**
   - Clicking logout redirects to landing page
   - Session is cleared

## Running the Application

### Development Mode

```bash
npm run dev
```

The app will be available at `http://localhost:5173/`

### Production Build

```bash
npm run build
npm run preview
```

## Key Features

### 1. Landing Page
- Beautiful hero section with gradients
- Feature cards highlighting benefits
- Call-to-action for signup
- Responsive design

### 2. Authentication Pages
- Clerk's pre-built components (customized styling)
- Google OAuth integration
- Email/password forms
- Error handling
- Form validation

### 3. Navigation
- Floating navbar (fixed position)
- User display (first name or email)
- Logout button with hover effects
- Responsive on mobile

### 4. Protected Routes
- Dashboard only accessible when signed in
- Landing page shown to unauthenticated users
- Automatic redirects on auth state changes

## Customization Guide

### Modify Clerk Appearance

Edit `SignUp.jsx` and `SignIn.jsx` `appearance` prop to customize:

```jsx
appearance={{
    elements: {
        socialButtonsBlockButton: "social-btn",
        formButtonPrimary: "btn btn-primary",
        // Add more customizations
    },
}}
```

### Change Colors

Edit `src/index.css` CSS variables:

```css
:root {
    --primary: #2563eb;           /* Main color */
    --primary-hover: #1d4ed8;     /* Hover state */
    --danger: #ef4444;            /* Logout button */
    --success: #10b981;           /* Success messages */
}
```

### Update Landing Page Content

Edit `src/pages/Landing.jsx`:
- Modify features (icons, text)
- Change CTA text
- Update subtitle

### Customize Navbar

Edit `src/components/Navbar.jsx`:
- Change user display format
- Modify logout button style
- Add additional navigation items

## Clerk Console Configuration

To enable Google OAuth and other auth methods in Clerk:

1. Go to https://dashboard.clerk.com
2. Select your application
3. Go to **Authentication** → **Social connections**
4. Enable desired providers (Google is usually pre-configured)
5. Configure additional settings as needed

## Troubleshooting

### Issue: "Missing Clerk Publishable Key"
- Ensure `.env.local` contains the correct key
- Restart the dev server after adding the key
- Check that the key starts with `pk_test_` or `pk_live_`

### Issue: Blank Auth Pages
- Verify Clerk publishable key is correct
- Check browser console for errors
- Ensure Clerk account has the app configured

### Issue: Google Login Not Working
- Verify OAuth provider is enabled in Clerk dashboard
- Clear browser cache and cookies
- Check that redirect URLs are configured correctly

## API Integration (Optional)

The dashboard is ready for API integration. To add backend calls:

```jsx
import axios from 'axios';

// In components
const response = await axios.get('/api/analysis', {
    headers: {
        'Authorization': `Bearer ${await user.getIdToken()}`
    }
});
```

## Security Notes

- Never commit `.env.local` to version control
- The Clerk publishable key is safe to expose (it's public)
- Secret keys should never be in frontend code
- Use backend endpoints for sensitive operations

## Next Steps

1. Test the full authentication flow:
   - Visit `http://localhost:5173/`
   - Click "Sign Up Now"
   - Create account with email/password or Google
   - Upload a VCF file and test analysis
   - Test logout and login again

2. Configure your Clerk dashboard settings as needed

3. Deploy to your hosting platform

4. Update the live Clerk publishable key when moving to production

## Support

For issues with Clerk, visit: https://clerk.com/docs
For issues with React Router, visit: https://reactrouter.com/docs
