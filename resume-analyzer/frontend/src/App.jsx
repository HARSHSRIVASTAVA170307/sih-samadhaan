import { useState } from "react";
import "./App.css";

const API_BASE_URL = "http://127.0.0.1:8000";

function App() {
  const [resumeFile, setResumeFile] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [analysisResult, setAnalysisResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");

  const handleAnalyze = async () => {
    if (!resumeFile) {
      setStatusMessage("Please upload a resume PDF first.");
      return;
    }

    if (!jobDescription.trim()) {
      setStatusMessage("Please paste a job description.");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resumeFile);
    formData.append("job_description", jobDescription);

    setLoading(true);
    setStatusMessage("");
    setAnalysisResult("");

    try {
      const response = await fetch(`${API_BASE_URL}/analyze`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Resume analysis failed.");
      }

      setAnalysisResult(data.result);
      setStatusMessage("Resume analysis completed successfully.");
    } catch (error) {
      setStatusMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setResumeFile(null);
    setJobDescription("");
    setAnalysisResult("");
    setStatusMessage("");
  };

  return (
    <main className="app-container">
      <section className="hero-section">
        <p className="eyebrow">AI Career Assistant</p>
        <h1>AI Resume Match Analyzer</h1>
        <p className="subtitle">
          Upload a resume, paste a job description, and get an AI-powered match
          analysis with missing skills, ATS keywords, resume improvement
          suggestions, and improved bullet points.
        </p>
      </section>

      <section className="card">
        <h2>1. Upload Resume</h2>
        <p className="section-text">
          Upload a PDF resume. The backend extracts readable text using pypdf.
        </p>

        <input
          type="file"
          accept="application/pdf"
          onChange={(event) => setResumeFile(event.target.files[0])}
        />

        {resumeFile && (
          <p className="file-name">Selected file: {resumeFile.name}</p>
        )}
      </section>

      <section className="card">
        <h2>2. Paste Job Description</h2>
        <p className="section-text">
          Paste the target job description to compare it against the uploaded
          resume.
        </p>

        <textarea
          value={jobDescription}
          onChange={(event) => setJobDescription(event.target.value)}
          placeholder="Paste the job description here..."
          rows="8"
        />

        <div className="button-row">
          <button onClick={handleAnalyze} disabled={loading}>
            Analyze Resume
          </button>

          <button className="secondary-button" onClick={handleClear}>
            Clear
          </button>
        </div>

        {loading && <p className="loading">Analyzing resume...</p>}
        {statusMessage && <p className="status">{statusMessage}</p>}
      </section>

      {analysisResult && (
        <section className="card result-card">
          <h2>Analysis Result</h2>
          <div className="result-box">{analysisResult}</div>
        </section>
      )}
    </main>
  );
}

export default App;