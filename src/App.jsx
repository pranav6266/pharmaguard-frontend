import UploadCard from "./components/UploadCard.jsx";
import MedicationCard from "./components/MedicationCard.jsx";
import Navbar from "./components/Navbar.jsx";
import ResultsView from "./components/ResultsView.jsx";
import {useState} from "react";

export default function App() {
    const [file, setFile] = useState(null);
    const [results, setResults] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    return (
        <>
            <Navbar />
            <div className="container">
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
        </>
    );
}