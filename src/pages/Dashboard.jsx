import { useState, useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import UploadCard from "../components/UploadCard";
import MedicationCard from "../components/MedicationCard";
import ResultsView from "../components/ResultsView";
import "../styles/Dashboard.css";

export default function Dashboard() {
    const { user } = useUser();
    const [file, setFile] = useState(null);
    const [results, setResults] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    return (
        <div className="dashboard-container">
            <div className="welcome-section">
                <h2>Welcome, {user?.firstName || "User"}!</h2>
                <p>Upload your genetic data to get personalized medication recommendations</p>
            </div>

            <div className="dashboard-layout">
                {/* Left Pane: Controls */}
                <div className="left-column">
                    <UploadCard
                        file={file}
                        setFile={setFile}
                        setResults={setResults}
                    />

                    <MedicationCard
                        file={file}
                        setResults={setResults}
                        isAnalyzing={isAnalyzing}
                        setIsAnalyzing={setIsAnalyzing}
                    />
                </div>

                {/* Right Pane: Results */}
                <div className="right-column">
                    {results ? (
                        <ResultsView results={results} />
                    ) : (
                        <div className="card empty-state">
                            <span style={{ fontSize: "32px", marginBottom: "16px", display: "block" }}>📊</span>
                            <h3 className="med-title" style={{ textAlign: "center" }}>Waiting for Data</h3>
                            <p className="subtitle" style={{ textAlign: "center", margin: 0 }}>
                                Upload a patient VCF file and select targeted medications to generate the comprehensive clinical assessment.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
