import { useState, useEffect } from "react";
import { useSignUp, useUser } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";
import "../styles/Auth.css";

export default function SignUp() {
    const { signUp, setActive } = useSignUp();
    const { isSignedIn } = useUser();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [verifyEmail, setVerifyEmail] = useState(false);
    const [verificationCode, setVerificationCode] = useState("");

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

    const handleSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            if (!formData.email || !formData.password) {
                setError("Email and password are required");
                setLoading(false);
                return;
            }

            await signUp.create({
                email: formData.email,
                password: formData.password,
                firstName: formData.firstName,
                lastName: formData.lastName,
            });

            // Email verification
            await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
            setVerifyEmail(true);
        } catch (err) {
            setError(err.errors?.[0]?.message || "Failed to create account");
        }
        setLoading(false);
    };

    const handleVerification = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await signUp.attemptEmailAddressVerification({
                code: verificationCode,
            });

            await setActive({ session: signUp.createdSessionId });
            navigate("/dashboard");
        } catch (err) {
            setError(err.errors?.[0]?.message || "Invalid verification code");
        }
        setLoading(false);
    };

    const handleGoogleSignUp = async () => {
        try {
            await signUp.authenticateWithRedirect({
                strategy: "oauth_google",
                redirectUrl: window.location.origin + "/auth-callback",
                redirectUrlComplete: window.location.origin + "/dashboard",
            });
        } catch (err) {
            setError(err.errors?.[0]?.message || "Google sign up failed");
        }
    };

    if (verifyEmail) {
        return (
            <div className="auth-container">
                <div className="auth-card">
                    <div className="auth-header">
                        <h1>Verify Email</h1>
                        <p>Enter the verification code sent to {formData.email}</p>
                    </div>

                    <form onSubmit={handleVerification} className="auth-form-custom">
                        {error && <div className="error-message">{error}</div>}
                        
                        <div className="form-group">
                            <input
                                type="text"
                                placeholder="Enter verification code"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                className="form-input"
                                maxLength="6"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="submit-btn"
                        >
                            {loading ? "Verifying..." : "Verify Email"}
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h1>Create Account</h1>
                    <p>Join PharmaGuard and discover personalized medication insights</p>
                </div>

                <form onSubmit={handleSignUp} className="auth-form-custom">
                    {error && <div className="error-message">{error}</div>}

                    {/* Google OAuth Button */}
                    <button
                        type="button"
                        onClick={handleGoogleSignUp}
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

                    {/* Name Fields */}
                    <div className="form-row">
                        <div className="form-group">
                            <label className="form-label">First name <span className="optional">Optional</span></label>
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First name"
                                value={formData.firstName}
                                onChange={handleInputChange}
                                className="form-input"
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Last name <span className="optional">Optional</span></label>
                            <input
                                type="text"
                                name="lastName"
                                placeholder="Last name"
                                value={formData.lastName}
                                onChange={handleInputChange}
                                className="form-input"
                            />
                        </div>
                    </div>

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
                        {loading ? "Creating account..." : "Continue"}
                    </button>
                </form>

                {/* Footer */}
                <div className="auth-footer">
                    <span>Already have an account? </span>
                    <Link to="/sign-in" className="auth-link">Sign in</Link>
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
