export default function ResultsCard({ results }) {
    if (!results || results.length === 0) return null;

    const getRiskColor = (label) => {
        switch(label.toLowerCase()) {
            case 'safe': return 'status success'; // Green
            case 'adjust dosage': return 'status validating'; // Yellow/Orange
            case 'toxic':
            case 'ineffective': return 'status error'; // Red
            default: return 'status idle'; // Gray
        }
    };

    return (
        <div className="card results-card" style={{ width: "100%", maxWidth: "650px", marginTop: "10px" }}>
            <h2 className="med-title">Clinical Recommendations</h2>
            <p className="subtitle">Based on detected variants and CPIC guidelines.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {results.map((item, index) => (
                    <div key={index} style={resultBoxStyle}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                            <h4 style={{ fontSize: "16px", color: "#0f172a" }}>{item.drug}</h4>
                            <span className={getRiskColor(item.risk_label)}>
                                {item.risk_label.toUpperCase()}
                            </span>
                        </div>

                        <div style={{ fontSize: "14px", color: "#475569", background: "white", padding: "12px", borderRadius: "8px", border: "1px solid #e2e8f0" }}>
                            <strong>Recommendation: </strong>
                            {item.clinical_recommendation?.recommendation_summary || "No specific recommendation available."}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

const resultBoxStyle = {
    background: "#f8fafc",
    border: "1px solid #cbd5e1",
    borderRadius: "10px",
    padding: "16px"
};