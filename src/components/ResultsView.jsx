import { useState } from "react";

export default function ResultsView({ results }) {
    const [expandedIndex, setExpandedIndex] = useState(0);
    const [showJsonModal, setShowJsonModal] = useState(false);
    const [copyBtnText, setCopyBtnText] = useState("View & Copy JSON");

    const toggleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const getRiskColor = (label) => {
        if (!label) return "risk-unknown";
        const lowerLabel = label.toLowerCase();
        if (lowerLabel.includes("safe") || lowerLabel.includes("normal")) return "risk-safe";
        if (lowerLabel.includes("adjust") || lowerLabel.includes("moderate")) return "risk-adjust";
        if (lowerLabel.includes("toxic") || lowerLabel.includes("ineffective") || lowerLabel.includes("high") || lowerLabel.includes("critical")) return "risk-danger";
        return "risk-unknown";
    };

    const handleCopyJSON = () => {
        const jsonStr = JSON.stringify(results, null, 2);
        navigator.clipboard.writeText(jsonStr);
        setCopyBtnText("Copied!");
        setShowJsonModal(true);
        setTimeout(() => setCopyBtnText("View & Copy JSON"), 2000);
    };

    const handleDownloadJSON = () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(results, null, 2));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "pharmacogenomic_report.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    };

    // Ensure results is an array to map over
    const safeResults = Array.isArray(results)
        ? results
        : results?.drug
            ? [results]
            : [];


    return (
        <div className="card results-card">
            <div className="results-header-row">
                <h3 className="med-title" style={{ marginBottom: 0 }}>Comprehensive Assessment</h3>
                <div className="button-row">
                    <button className="btn-secondary text-sm" onClick={handleCopyJSON}>{copyBtnText}</button>
                    <button className="btn-primary text-sm" onClick={handleDownloadJSON}>Download Report</button>
                </div>
            </div>

            <div className="results-list">
                {safeResults.length === 0 && <p className="med-desc">No assessment results available.</p>}

                {safeResults.map((item, index) => {
                    const risk = item.risk_assessment || {};
                    const profile = item.pharmacogenomic_profile || {};
                    const rec = item.clinical_recommendation || {};
                    const llm = item.llm_generated_explanation || {};

                    return (
                        <div key={index} className={`accordion-item ${expandedIndex === index ? 'expanded' : ''}`}>
                            <div className="accordion-header" onClick={() => toggleExpand(index)}>
                                <div className="accordion-title">
                                    <span className="drug-name">{item.drug || "Unknown Drug"}</span>
                                    <span className={`risk-badge ${getRiskColor(risk.risk_label)}`}>
                                        {risk.risk_label || "Unknown Risk"}
                                    </span>
                                </div>
                                <span className="expand-icon">{expandedIndex === index ? "−" : "+"}</span>
                            </div>

                            {expandedIndex === index && (
                                <div className="accordion-body">
                                    <div className="grid-2-col">
                                        <div>
                                            <p className="section-subtitle">Risk Assessment</p>
                                            <div className="detail-row">
                                                <span className="detail-label">Severity:</span>
                                                <span className="detail-value capitalize">{risk.severity || "N/A"}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Confidence:</span>
                                                <span className="detail-value">
                                                    {risk.confidence_score !== undefined ? `${(risk.confidence_score * 100).toFixed(0)}%` : "N/A"}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="section-subtitle">Pharmacogenomic Profile</p>
                                            <div className="detail-row">
                                                <span className="detail-label">Primary Gene:</span>
                                                <span className="detail-value font-mono">{profile.primary_gene || "N/A"}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Phenotype:</span>
                                                <span className="detail-value">{profile.phenotype || "N/A"}</span>
                                            </div>
                                            <div className="detail-row">
                                                <span className="detail-label">Diplotype:</span>
                                                <span className="detail-value">{profile.diplotype || "N/A"}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {llm.summary && (
                                        <div className="llm-explanation-box">
                                            <p className="llm-title">✨ AI-Generated Clinical Explanation</p>
                                            <p className="llm-text">{llm.summary}</p>
                                        </div>
                                    )}

                                    <div className="recommendation-box">
                                        <p className="rec-title">Clinical Recommendation ({rec.guideline_source || "CPIC"})</p>
                                        <p className="rec-text">{rec.recommendation_summary || "No specific recommendation provided."}</p>
                                        {rec.dose_adjustment && <p className="rec-subtext"><strong>Dose Adjustment:</strong> {rec.dose_adjustment}</p>}
                                        {rec.monitoring_advice && <p className="rec-subtext"><strong>Monitoring:</strong> {rec.monitoring_advice}</p>}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {/* JSON Modal Viewer */}
            {showJsonModal && (
                <div className="modal-overlay" onClick={() => setShowJsonModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h4>Raw JSON Output (Copied to Clipboard)</h4>
                            <button className="close-btn" onClick={() => setShowJsonModal(false)}>×</button>
                        </div>
                        <pre className="json-viewer">
                            {JSON.stringify(results, null, 2)}
                        </pre>
                    </div>
                </div>
            )}
        </div>
    );
}