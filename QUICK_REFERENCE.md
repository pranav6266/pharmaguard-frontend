# PharmaGuard Auth - Quick Reference

## 🔗 Routes

| Route | Component | Auth Required | Description |
|-------|-----------|---|---|
| `/` | Landing or Dashboard | No | Redirects based on login status |
| `/sign-up` | SignUp | No | Create new account |
| `/sign-in` | SignIn | No | Login to existing account |
| `/dashboard` | Dashboard | ✅ Yes | Main app (protected) |

## 🎯 User State

```javascript
// In any component:
import { useUser } from "@clerk/clerk-react";

const { user, isSignedIn, isLoaded } = useUser();

// User object has:
user.firstName          // "John"
user.lastName           // "Doe"
user.emailAddresses     // [{emailAddress: "john@example.com"}]
user.primaryEmailAddress?.emailAddress  // "john@example.com"
```

## 🚪 Logout

```javascript
// In any component:
import { useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const { signOut } = useClerk();
const navigate = useNavigate();

const handleLogout = async () => {
    await signOut();
    navigate("/");
};
```

## 🔐 Protected Route Example

```javascript
// Wrap component to require auth
{isSignedIn ? <ProtectedComponent /> : <LandingPage />}
```

## 🎨 Customize Auth Pages

**SignUp.jsx** and **SignIn.jsx** have appearance customization:

```javascript
appearance={{
    elements: {
        rootBox: "auth-form",
        card: "auth-card-inner",
        socialButtonsBlockButton: "social-btn",
        formButtonPrimary: "btn btn-primary",
    },
}}
```

## 🌈 Color Scheme

Edit `src/index.css`:

```css
:root {
    --primary: #2563eb;         /* Blue */
    --primary-hover: #1d4ed8;   /* Darker blue */
    --danger: #ef4444;          /* Red (logout) */
    --success: #10b981;         /* Green */
    --text-main: #0f172a;       /* Dark text */
    --text-muted: #64748b;      /* Gray text */
}
```

## 📱 Responsive Breakpoints

```css
/* Mobile - up to 640px */
@media (max-width: 640px) { }

/* Tablet - up to 768px */
@media (max-width: 768px) { }

/* Desktop - up to 1200px */
@media (max-width: 1200px) { }
```

## 🚀 Common Tasks

### Add User Info to Navbar
```jsx
<span>{user?.firstName || user?.primaryEmailAddress?.emailAddress}</span>
```

### Check if Loading
```jsx
const { isLoaded } = useUser();
if (!isLoaded) return <div>Loading...</div>;
```

### Get User ID Token (for API)
```jsx
const { getToken } = useAuth();
const token = await getToken();
```

### Redirect After Signup
Already configured in SignUp.jsx:
```jsx
redirectUrl="/dashboard"
```

## 🐛 Debugging

### Check Auth State in Console
```javascript
// In browser console
const clerk = window.__clerk;
clerk.user  // Current user object
```

### Common Issues

**Issue**: Blank auth pages
- **Solution**: Check `.env.local` has correct Clerk key
- **Restart** dev server after adding env vars

**Issue**: Google login doesn't work
- **Solution**: Enable OAuth in Clerk dashboard
- **Check** redirect URLs are configured

**Issue**: Can't logout
- **Solution**: Use `useClerk()` hook, call `signOut()`
- **Navigate** after logout: `await signOut(); navigate("/")`

## 📚 Files Modified/Created

```
CREATED:
- src/pages/Landing.jsx
- src/pages/SignUp.jsx
- src/pages/SignIn.jsx
- src/pages/Dashboard.jsx
- src/styles/Landing.css
- src/styles/Auth.css
- src/styles/Dashboard.css
- .env.local

UPDATED:
- src/main.jsx              (Added ClerkProvider)
- src/App.jsx               (Added React Router)
- src/components/Navbar.jsx (Added auth features)
```

## ✅ Testing Checklist

- [ ] npm run dev starts without errors
- [ ] Landing page shows correctly
- [ ] Can sign up with email + password
- [ ] Can sign up with Google
- [ ] Redirects to dashboard after signup
- [ ] User name shows in navbar
- [ ] Can logout
- [ ] Logout redirects to landing
- [ ] Can sign in with existing account
- [ ] Dashboard works with VCF upload
- [ ] Mobile layout is responsive

## 🎓 Learn More

- Clerk Docs: https://clerk.com/docs
- React Router: https://reactrouter.com/docs
- Vite: https://vitejs.dev
- React: https://react.dev
