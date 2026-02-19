import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

export default function AuthCallback() {
    const navigate = useNavigate();
    const { isSignedIn, isLoaded } = useUser();

    useEffect(() => {
        if (isLoaded) {
            if (isSignedIn) {
                // User authenticated successfully, redirect to dashboard
                navigate("/dashboard");
            } else {
                // User not authenticated, redirect to sign-in
                navigate("/sign-in");
            }
        }
    }, [isLoaded, isSignedIn, navigate]);

    return (
        <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100vh",
            background: "linear-gradient(135deg, #e0e7ff 0%, #f0e7ff 100%)",
        }}>
            <div style={{
                textAlign: "center",
            }}>
                <div style={{
                    fontSize: "48px",
                    marginBottom: "16px",
                    animation: "spin 1s linear infinite",
                }}>
                    🧬
                </div>
                <p style={{
                    fontSize: "16px",
                    color: "#64748b",
                    fontWeight: "500",
                }}>
                    Completing authentication...
                </p>
            </div>
            <style>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
