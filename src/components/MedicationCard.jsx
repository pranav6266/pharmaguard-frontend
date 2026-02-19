import { useState, useRef, useEffect } from "react";

const SUPPORTED_DRUGS = [
    "CODEINE",
    "WARFARIN",
    "CLOPIDOGREL",
    "SIMVASTATIN",
    "AZATHIOPRINE",
    "FLUOROURACIL"
];

export default function MedicationCard({ file, setResults, isAnalyzing, setIsAnalyzing }) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDrugs, setSelectedDrugs] = useState([]);
    const [error, setError] = useState("");
    const dropdownRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleDrug = (drug) => {
        setSelectedDrugs(prev =>
            prev.includes(drug)
                ? prev.filter(d => d !== drug)
                : [...prev, drug]
        );
    };

    const handleAnalysis = async () => {
        if (selectedDrugs.length === 0 || !file) return;

        setIsAnalyzing(true);
        setError("");
        setResults(null);

        try {
            const formData = new FormData();
            formData.append("file", file);
            selectedDrugs.forEach(drug => {
                formData.append("drugs", drug);
            });

            // UPDATED: Pointing to /full-analysis endpoint
            const response = await fetch("https://pharmaguard-production.up.railway.app/full-analysis", {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Server responded with status ${response.status}`);
            }

            const data = await response.json();
            // Assuming the backend returns an array directly, or an object with a "results" array
            const analysisResults = Array.isArray(data) ? data : (data.results || []);
            setResults(analysisResults);

        } catch (err) {
            console.error("Analysis failed:", err);
            setError("Failed to run full analysis on the VCF file. Please try again.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="card medication-card">
            <h3 className="med-title">Targeted Medications</h3>

            <p className="med-desc" style={{marginBottom: "16px"}}>
                Select one or more drugs to analyze against the patient's genomic markers.
            </p>

            <div className="dropdown-container" ref={dropdownRef}>
                <div
                    className={`dropdown-header ${isOpen ? "active" : ""}`}
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="selected-drugs-text">
                        {selectedDrugs.length === 0
                            ? "Select medications..."
                            : selectedDrugs.join(", ")}
                    </span>
                    <span>{isOpen ? "▲" : "▼"}</span>
                </div>

                {isOpen && (
                    <div className="dropdown-list">
                        {SUPPORTED_DRUGS.map((drug) => (
                            <div
                                key={drug}
                                className="dropdown-item"
                                onClick={() => toggleDrug(drug)}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedDrugs.includes(drug)}
                                    readOnly
                                />
                                <label>{drug}</label>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <p className="med-desc">
                Our algorithm cross-references variants in 6 critical genes (CYP2D6, CYP2C19, CYP2C9, SLCO1B1, TPMT, DPYD) to predict drug-specific risks and generate LLM explanations.
            </p>

            {error && <div className="error">{error}</div>}

            <button
                className="btn-primary med-btn"
                onClick={handleAnalysis}
                disabled={!file || selectedDrugs.length === 0 || isAnalyzing}
            >
                {isAnalyzing
                    ? "Running Full LLM Analysis..."
                    : (!file
                        ? "Upload VCF to enable analysis"
                        : selectedDrugs.length === 0
                            ? "Select drugs to analyze"
                            : "Generate Comprehensive Report")}
            </button>
        </div>
    );
}