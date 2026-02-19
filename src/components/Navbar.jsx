export default function Navbar() {
    return (
        <nav style={navStyle}>
            <div style={logoStyle}>
                <span style={{ fontSize: "22px" }}>🛡️</span>
                <span style={{ color: "#0f172a" }}>PharmaGuard</span>
            </div>

            <div style={centerStyle}>Clinical Dashboard</div>

            <div style={rightStyle}>
                v1.0.0
            </div>
        </nav>
    );
}

const navStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 40px",
    background: "white",
    borderBottom: "1px solid #e2e8f0",
};

const logoStyle = {
    fontWeight: "800",
    fontSize: "20px",
    display: "flex",
    gap: "10px",
    alignItems: "center",
    letterSpacing: "-0.5px"
};

const centerStyle = {
    fontWeight: "600",
    color: "#64748b",
    fontSize: "15px"
};

const rightStyle = {
    fontSize: "13px",
    fontWeight: "500",
    color: "#94a3b8",
    background: "#f1f5f9",
    padding: "4px 10px",
    borderRadius: "20px"
};