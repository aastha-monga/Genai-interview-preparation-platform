import React, { useState, useRef } from "react"
import "../style/home.scss"
import { useInterview } from "../hooks/useinterview.js"
import { useNavigate } from "react-router"

const Home = () => {
    const { loading, generateReport, reports } = useInterview()

    const [jobDescription, setJobDescription] = useState("")
    const [selfDescription, setSelfDescription] = useState("")
    const [resumeFileName, setResumeFileName] = useState("")

    const resumeInputRef = useRef()
    const navigate = useNavigate()

    const handleGenerateReport = async () => {
        const resumeFile = resumeInputRef.current.files[0]

        const data = await generateReport({
            jobDescription,
            selfDescription,
            resumeFile
        })

        console.log("GENERATED DATA:", data)

        if (data) {
            navigate(`/interview/${data._id}`)
        }
    }

    if (loading) {
        return (
            <main className='loading-screen'>
                <h1>Loading your interview plan...</h1>
            </main>
        )
   }

    return (
        <main className="home-page">
            <header className="page-header">
                <h1>
                    Build Your Personalized{" "}
                    <span className="highlight">Interview Strategy</span>
                </h1>

                <p>
                    Let our AI analyze your resume and target role to create
                    <br />
                    a personalized interview preparation plan.
                </p>
            </header>

            <section className="interview-card">
                <div className="interview-card__body">
                    <section className="panel panel--left">
                        <div className="panel__header">
                            <span className="panel__icon">▣</span>
                            <h2>Target Job Description</h2>
                            <span className="badge badge--required">
                                Required
                            </span>
                        </div>

                        <textarea
                            className="panel__textarea"
                            value={jobDescription}
                            onChange={(event) =>
                                setJobDescription(event.target.value)
                            }
                            placeholder="Paste the full job description here..."
                            maxLength={5000}
                        />

                        <div className="char-counter">
                            {jobDescription.length} / 5000 chars
                        </div>
                    </section>

                    <div className="panel-divider"></div>

                    <section className="panel panel--right">
                        <div className="panel__header">
                            <span className="panel__icon">♙</span>
                            <h2>Your Profile</h2>
                        </div>

                        <div className="upload-section">
                            <label className="section-label" htmlFor="resume">
                                Upload Resume
                                <span className="badge badge--best">
                                    Best Results
                                </span>
                            </label>

                            <label className="dropzone" htmlFor="resume">
                                <span className="dropzone__icon">⇧</span>

                                <p className="dropzone__title">
                                    {resumeFileName ||
                                        "Click to upload or drag & drop"}
                                </p>

                                <p className="dropzone__subtitle">
                                    PDF (Max 3MB)
                                </p>

                                <input
                                    ref={resumeInputRef}
                                    hidden
                                    type="file"
                                    id="resume"
                                    name="resume"
                                    accept=".pdf"
                                    onChange={(event) =>
                                        setResumeFileName(
                                            event.target.files?.[0]?.name || ""
                                        )
                                    }
                                />
                            </label>
                        </div>

                        <div className="or-divider">
                            <span>OR</span>
                        </div>

                        <div className="self-description">
                            <label
                                className="section-label"
                                htmlFor="selfDescription"
                            >
                                Quick Self-Description
                            </label>

                            <textarea
                                id="selfDescription"
                                name="selfDescription"
                                className="panel__textarea panel__textarea--short"
                                value={selfDescription}
                                onChange={(event) =>
                                    setSelfDescription(event.target.value)
                                }
                                placeholder="Briefly describe your experience, key skills, and years of experience..."
                            ></textarea>
                        </div>

                        <div className="info-box">
                            <span className="info-box__icon">ℹ</span>

                            <p>
                                Either a <strong>Resume</strong> or a{" "}
                                <strong>Self Description</strong> is required
                                to generate a personalized plan.
                            </p>
                        </div>
                    </section>
                </div>

                <footer className="interview-card__footer">
                    <span className="footer-info">
                        AI-Powered Strategy Generation &bull; Approx 30s
                    </span>

                    <button
                        type="button"
                        className="generate-btn"
                        onClick={handleGenerateReport}
                        disabled={loading}
                    >
                        <span>★</span>
                        {loading
                            ? "Generating..."
                            : "Generate My Interview Strategy"}
                    </button>
                </footer>
            </section>

            {/* Recent Reports List */}
            {reports.length > 0 && (
                <section className="recent-reports">
                    <h2>My Recent Interview Plans</h2>
                    <ul className="reports-list">
                        {reports.map(report => (
                            <li
                                key={report._id}
                                className="report-item"
                                onClick={() => navigate(`/interview/${report._id}`)}
                            >
                                <h3>{report.title || "Untitled Position"}</h3>
                                <p className="report-meta">
                                    Generated on {new Date(report.createdAt).toLocaleDateString()}
                                </p>
                                <p className = {`match-score ${report.matchScore >= 80 ? 'score--high' : report.matchScore >= 60 ? 'score--mid' : 'score--low'}`}>
                                    Match Score: {report.matchScore}%
                                </p>
                            </li>
                        ))}
                    </ul>
                </section>
            )}

            <footer className="page-footer">
                <a href="#privacy">Privacy Policy</a>
                <a href="#terms">Terms of Service</a>
                <a href="#help">Help Center</a>
            </footer>
        </main>
    )
}

export default Home