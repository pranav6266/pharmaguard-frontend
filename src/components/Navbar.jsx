export default function Navbar() {
    return (
        <nav className="navbar-glass">
            <div className="nav-logo">
                <span style={{ fontSize: "24px" }}>🧬</span>
                <span>PharmaGuard</span>
            </div>

            <div className="nav-center">Clinical Analysis Engine</div>

            <div className="nav-badge">
                v1.0.0
            </div>
        </nav>
    );
}