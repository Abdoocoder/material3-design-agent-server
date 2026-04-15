import React, { useState, useEffect } from "react";
import { useApp } from "@modelcontextprotocol/ext-apps/react";
import "./mcp-app.css";

interface Finding {
  title: string;
  severity: "error" | "warning" | "info";
  message: string;
  suggestion?: string;
}

interface ReviewResult {
  componentName: string;
  overallScore: number;
  compliance: {
    material3Adherence: number;
    accessibilityScore: number;
    consistencyScore: number;
  };
  findings: Finding[];
  recommendations: string[];
}

export default function Material3DesignAgent() {
  const app = useApp<ReviewResult>();
  const [result, setResult] = useState<ReviewResult | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    app.ontoolresult = async (toolResult) => {
      if (toolResult.result && typeof toolResult.result === "object") {
        setResult(toolResult.result as ReviewResult);
        setLoading(false);
      }
    };

    app.ontoolinput = async () => {
      setLoading(true);
    };

    app.onteardown = async () => {
      return {};
    };
  }, [app]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "error":
        return "#c41c3b";
      case "warning":
        return "#f57c00";
      case "info":
        return "#1976d2";
      default:
        return "#666";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "error":
        return "✕";
      case "warning":
        return "⚠";
      case "info":
        return "ℹ";
      default:
        return "•";
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "#4caf50"; // Green
    if (score >= 70) return "#ff9800"; // Orange
    return "#c41c3b"; // Red
  };

  const ScoreGauge = ({ score, label }: { score: number; label: string }) => (
    <div className="score-gauge">
      <div className="gauge-label">{label}</div>
      <div className="gauge-container">
        <div
          className="gauge-fill"
          style={{
            width: `${score}%`,
            backgroundColor: getScoreColor(score)
          }}
        >
          <span className="gauge-text">{score}%</span>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="container loading">
        <div className="spinner"></div>
        <p>Analyzing design...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="container empty-state">
        <div className="empty-icon">🎨</div>
        <h2>Material 3 Design Agent</h2>
        <p>Submit a component design for review to see analysis results here.</p>
        <div className="info-box">
          <strong>How to use:</strong>
          <ul>
            <li>Describe your Material 3 component</li>
            <li>Include details about colors, typography, accessibility</li>
            <li>Get instant feedback and recommendations</li>
          </ul>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>Design Review: {result.componentName}</h1>
        <div className="overall-score">
          <div
            className="score-circle"
            style={{ color: getScoreColor(result.overallScore) }}
          >
            {result.overallScore}%
          </div>
        </div>
      </div>

      <div className="scores-section">
        <h2>Compliance Breakdown</h2>
        <div className="scores-grid">
          <ScoreGauge
            score={result.compliance.material3Adherence}
            label="Material 3 Adherence"
          />
          <ScoreGauge
            score={result.compliance.accessibilityScore}
            label="Accessibility"
          />
          <ScoreGauge
            score={result.compliance.consistencyScore}
            label="Consistency"
          />
        </div>
      </div>

      {result.findings.length > 0 && (
        <div className="findings-section">
          <h2>Findings</h2>
          <div className="findings-list">
            {result.findings.map((finding, index) => (
              <div
                key={index}
                className="finding-card"
                style={{
                  borderLeftColor: getSeverityColor(finding.severity)
                }}
              >
                <div className="finding-header">
                  <span className="severity-badge" style={{ color: getSeverityColor(finding.severity) }}>
                    {getSeverityIcon(finding.severity)} {finding.severity.toUpperCase()}
                  </span>
                  <h3>{finding.title}</h3>
                </div>
                <p className="finding-message">{finding.message}</p>
                {finding.suggestion && (
                  <div className="suggestion">
                    <strong>Suggestion:</strong> {finding.suggestion}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {result.recommendations.length > 0 && (
        <div className="recommendations-section">
          <h2>Recommendations</h2>
          <ul className="recommendations-list">
            {result.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="footer-info">
        <p>Material 3 Design System Reference: <a href="https://m3.material.io" target="_blank" rel="noopener noreferrer">m3.material.io</a></p>
      </div>
    </div>
  );
}
