import { useState, useEffect } from "react";
import { useSignIn, useUser } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Auth.css";

export default function SignIn() {
    const { signIn, setActive } = useSignIn();
    const { isSignedIn } = useUser();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    // If already signed in (from Google OAuth or session), redirect to dashboard
    useEffect(() => {
        if (isSignedIn) {
            navigate("/dashboard");
        }
    }, [isSignedIn, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError("");
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (!formData.email || !formData.password) {
                setError("Email and password are required");
                setLoading(false);
                return;
            }

            const result = await signIn.create({
                identifier: formData.email,
                password: formData.password,
            });

            if (result.status === "complete") {
                await setActive({ session: result.createdSessionId });
                navigate("/dashboard");
            } else {
                setError("Authentication failed. Please try again.");
            }
        } catch (err) {
            setError(err.errors?.[0]?.message || "Invalid email or password");
        }
        setLoading(false);
    };

    const handleGoogleSignIn = async () => {
        try {
            await signIn.authenticateWithRedirect({
                strategy: "oauth_google",
                redirectUrl: window.location.origin + "/auth-callback",
                redirectUrlComplete: window.location.origin + "/dashboard",
            });
        } catch (err) {
            setError(err.errors?.[0]?.message || "Google sign in failed");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Welcome Back</h1>
                    <p>Sign in to access your personalized health insights</p>
                </div>

                <form onSubmit={handleSignIn} className="auth-form-custom">
                    {error && <div className="error-message">{error}</div>}

                    {/* Google OAuth Button */}
                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className="google-btn"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        </svg>
                        Continue with Google
                    </button>

                    <div className="divider">or</div>

                    {/* Email Field */}
                    <div className="form-group">
                        <label className="form-label">Email address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email address"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="form-input"
                            required
                        />
                    </div>

                    {/* Password Field */}
                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="form-input"
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="submit-btn"
                    >
                        {loading ? "Signing in..." : "Continue"}
                    </button>
                </form>

                {/* Footer */}
                <div className="auth-footer">
                    <span>Don't have an account? </span>
                    <Link to="/sign-up" className="auth-link">Sign up</Link>
                </div>

                <div className="clerk-badge">
                    <span>Secured by</span>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7V12C2 18.16 7.16 23.35 12 24C16.84 24.65 22 19.16 22 12V7L12 2Z" fill="#6366F1"/>
                    </svg>
                    <span className="clerk-text">clerk</span>
                </div>
            </div>
        </div>
    );
}
