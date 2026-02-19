import { useState } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import "../styles/Navbar.css";

export default function Navbar() {
    const { user, isSignedIn } = useUser();
    const { signOut } = useClerk();
    const navigate = useNavigate();
    const [showDropdown, setShowDropdown] = useState(false);
    const [showHistory, setShowHistory] = useState(false);

    const handleLogout = async () => {
        await signOut();
        setShowDropdown(false);
        navigate("/");
    };

    const handleViewHistory = () => {
        setShowHistory(true);
        setShowDropdown(false);
    };

    const history = JSON.parse(localStorage.getItem(`history_${user?.id}`) || "[]");
    const usageCount = history.length;

    return (
        <>
            <nav className="navbar-glass">
                <div className="nav-logo">
                    <span style={{ fontSize: "24px" }}>🧬</span>
                    <span>PharmaGuard</span>
                </div>

                <div className="nav-center">Clinical Analysis Engine</div>

                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    {isSignedIn && user && (
                        <div className="profile-section">
                            {/* Usage Counter */}
                            <div className="usage-badge">
                                <span className="usage-icon">📊</span>
                                <span className="usage-text">{usageCount} analyses</span>
                            </div>

                            {/* Profile Dropdown */}
                            <div className="profile-dropdown-container">
                                <button
                                    onClick={() => setShowDropdown(!showDropdown)}
                                    className="profile-btn"
                                    title={user.firstName || user.emailAddresses[0]?.emailAddress}
                                >
                                    <div className="profile-avatar">
                                        {(user.firstName?.charAt(0) || user.emailAddresses[0]?.emailAddress?.charAt(0) || "U").toUpperCase()}
                                    </div>
                                </button>

                                {showDropdown && (
                                    <div className="dropdown-menu">
                                        <div className="dropdown-header">
                                            <div className="dropdown-avatar">
                                                {(user.firstName?.charAt(0) || user.emailAddresses[0]?.emailAddress?.charAt(0) || "U").toUpperCase()}
                                            </div>
                                            <div className="dropdown-user-info">
                                                <p className="dropdown-name">{user.firstName || "User"}</p>
                                                <p className="dropdown-email">{user.emailAddresses[0]?.emailAddress}</p>
                                            </div>
                                        </div>

                                        <div className="dropdown-divider"></div>

                                        <button className="dropdown-item" onClick={handleViewHistory}>
                                            <span className="dropdown-icon">📋</span>
                                            <span>View History</span>
                                            <span className="dropdown-badge">{usageCount}</span>
                                        </button>

                                        <div className="dropdown-divider"></div>

                                        <button className="dropdown-item logout-item" onClick={handleLogout}>
                                            <span className="dropdown-icon">🚪</span>
                                            <span>Logout</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </nav>

            {/* History Modal */}
            {showHistory && (
                <div className="history-modal-overlay" onClick={() => setShowHistory(false)}>
                    <div className="history-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="history-header">
                            <h2>Analysis History</h2>
                            <button className="close-btn" onClick={() => setShowHistory(false)}>✕</button>
                        </div>

                        <div className="history-content">
                            {history.length === 0 ? (
                                <div className="history-empty">
                                    <span className="empty-icon">📊</span>
                                    <p>No analyses yet</p>
                                    <p className="empty-subtitle">Start by uploading a VCF file</p>
                                </div>
                            ) : (
                                <div className="history-list">
                                    {history.map((item, index) => (
                                        <div key={index} className="history-item">
                                            <div className="history-item-left">
                                                <div className="history-index">{history.length - index}</div>
                                                <div className="history-details">
                                                    <p className="history-patient">Patient ID: {item.patientId || "Unknown"}</p>
                                                    <p className="history-meds">Medications: {item.medications?.length || 0}</p>
                                                    <p className="history-time">{new Date(item.timestamp).toLocaleString()}</p>
                                                </div>
                                            </div>
                                            <div className="history-item-right">
                                                <span className="history-status">✓</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="history-footer">
                            <p className="history-stats">
                                Total Analyses: <strong>{usageCount}</strong>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}