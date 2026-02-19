import { useState } from "react";
import Navbar from "./components/Navbar";
import UploadCard from "./components/UploadCard";
import MedicationCard from "./components/MedicationCard";
import ResultsView from "./components/ResultsView";

function App() {
    const [file, setFile] = useState(null);
    const [results, setResults] = useState(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    return (
        <>
            <Navbar />
            <div className="container">
                <div className="column">
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

                    {results && <ResultsView results={results} />}
                </div>
            </div>
        </>
    );
}

export default App;