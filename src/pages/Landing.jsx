import { Link } from "react-router-dom";
import "../styles/Landing.css";

export default function Landing() {
    return (
        <div className="landing-container">
            <div className="landing-content">
                <div className="landing-header">
                    <h1 className="landing-title">
                        <span className="glow-letter">P</span>harma<span className="glow-letter">G</span>uard
                    </h1>
                    <p className="landing-subtitle">
                        AI-powered pharmacogenomic analysis for personalized medication insights
                    </p>
                </div>

                <div className="landing-features">
                    <div className="feature">
                        <span className="feature-icon">🧬</span>
                        <h3>Genetic Analysis</h3>
                        <p>Advanced VCF file processing for comprehensive pharmacogenomic insights</p>
                    </div>
                    <div className="feature">
                        <span className="feature-icon">💊</span>
                        <h3>Smart Recommendations</h3>
                        <p>Personalized medication recommendations based on your genetic profile</p>
                    </div>
                    <div className="feature">
                        <span className="feature-icon">🛡️</span>
                        <h3>Safety First</h3>
                        <p>Identify potential drug interactions and adverse reactions proactively</p>
                    </div>
                </div>

                <div className="landing-cta">
                    <p className="cta-text">Get started with personalized pharmacogenomic insights</p>
                    <Link to="/sign-up" className="btn btn-primary btn-lg">
                        Sign Up Now
                    </Link>
                    <p className="login-link">
                        Already have an account?{" "}
                        <Link to="/sign-in" className="link">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
