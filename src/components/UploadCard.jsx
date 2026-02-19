import { useState, useRef } from "react";

const MAX_SIZE = 5 * 1024 * 1024; // 5MB limit

// Accept file and setFile as props
export default function UploadCard({ file, setFile, setResults }) {
    const [error, setError] = useState("");
    const [status, setStatus] = useState("idle");
    const [progress, setProgress] = useState(0);

    const fileInputRef = useRef(null);

    const handleFile = (e) => {
        const selected = e.target.files[0];
        if (!selected) return;

        setError("");
        setStatus("validating");

        const fileExtension = selected.name.split('.').pop().toLowerCase();
        if (fileExtension !== "vcf") {
            setError("Invalid file format. Only .vcf files are permitted.");
            setStatus("error");
            setFile(null); // Uses the prop function
            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        if (selected.size > MAX_SIZE) {
            setError("File is too large. Maximum allowed size is 5MB.");
            setStatus("error");
            setFile(null); // Uses the prop function

            if (fileInputRef.current) fileInputRef.current.value = "";
            return;
        }

        setFile(selected); // Uses the prop function
        setResults(null);
        setStatus("idle");
    };

    const handleRemove = () => {
        setFile(null); // Uses the prop function
        setResults(null)
        setProgress(0);
        setStatus("idle");
        setError("");
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setStatus("uploading");
        setProgress(0);

        // Simulated progress for UI testing:
        let value = 0;
        const interval = setInterval(() => {
            value += 15;
            if (value >= 100) {
                value = 100;
                clearInterval(interval);
                setStatus("success");
            }
            setProgress(value);
        }, 200);
    };

    return (
        <div className="card upload-card">
            <h2 className="upload-title">Upload Patient VCF File</h2>
            <p className="subtitle">
                Drag and drop your genomic data file here or click to browse.
            </p>

            <label className="drop-zone">
                <input
                    type="file"
                    accept=".vcf,.VCF"
                    hidden
                    onChange={handleFile}
                    disabled={status === "uploading"}
                    ref={fileInputRef}
                />
                <div className="upload-icon">📄</div>
                <p className="drop-text">Drop VCF file here</p>
                <p className="drop-small">Maximum file size: 5MB | Format: .vcf</p>
            </label>

            {file && (
                <div className="file-preview">
                    <div className="file-info">
                        <span className="file-name">{file.name}</span>
                        <span className="file-size">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                        </span>
                    </div>
                    <span className={`status ${status}`}>
                        {status.toUpperCase()}
                    </span>
                </div>
            )}

            {status === "uploading" && (
                <div className="progress-container">
                    <div
                        className="progress-bar"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            )}

            {error && <div className="error">{error}</div>}

            <div className="button-row">
                <button
                    className="btn-secondary"
                    disabled={!file || status === "uploading"}
                    onClick={handleRemove}
                >
                    Remove File
                </button>

                <button
                    className="btn-primary"
                    disabled={!file || status === "uploading" || status === "success"}
                    onClick={handleUpload}
                >
                    {status === "uploading" ? `Uploading... ${progress}%` : "Submit File"}
                </button>
            </div>
        </div>
    );
}