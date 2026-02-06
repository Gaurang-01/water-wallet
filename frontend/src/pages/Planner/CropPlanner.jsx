import React, { useState } from 'react';
import './CropPlanner.css';

const CropPlanner = () => {
  const [selectedCrop, setSelectedCrop] = useState('mustard');
  const [area, setArea] = useState(1);
  const [village, setVillage] = useState('Punade'); // Default value for demo

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheck = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('http://localhost:5000/api/water/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          village: village,  // Changed from locationName
          crop: selectedCrop,
          area: Number(area)
        })
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Could not connect to Water Engine. Ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  // Helper to visualize the score bar
  const getScoreWidth = (score) => Math.min((score / 1000) * 100, 100) + "%";
  const getScoreColor = (score) => {
    if(score < 300) return '#ef4444'; // Red
    if(score < 600) return '#eab308'; // Yellow
    return '#22c55e'; // Green
  };

  return (
    <div className="page-content">
      <div className="planner-header">
        <h1>🚜 Crop Solvency Planner</h1>
        <p>AI-driven viability check based on Soil Moisture & Aquifer Depth.</p>
      </div>

      {/* INPUT SECTION */}
      <div className="planner-form-card">
        <div className="input-group">
          <label>Village Name</label>
          <input
            placeholder="e.g. Punade, Akola"
            value={village}
            onChange={(e) => setVillage(e.target.value)}
          />
        </div>

        <div className="row-group">
          <div className="input-group">
            <label>Crop</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
            >
              <option value="lentil">Lentil (Low Water)</option>
              <option value="chickpea">Chickpea (Med)</option>
              <option value="mustard">Mustard (Med)</option>
              <option value="paddy">Paddy (High)</option>
              <option value="sugarcane">Sugarcane (Extreme)</option>
            </select>
          </div>

          <div className="input-group">
            <label>Area (Acres)</label>
            <input
              type="number"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </div>
        </div>

        <button onClick={handleCheck} disabled={loading} className="analyze-btn">
          {loading ? 'Analyzing Soil & Water...' : 'Run Simulation'}
        </button>
        
        {error && <p className="error-msg">{error}</p>}
      </div>

      {/* RESULTS SECTION */}
      {result && (
        <div className="results-container">
          
          {/* 1. MAIN STATUS CARD */}
          <div className={`status-banner ${result.cropResult.status.toLowerCase()}`}>
            <h2>{result.cropResult.status === 'PASS' ? '✅ VIABLE' : '⚠️ HIGH RISK'}</h2>
            <p>
              {result.cropResult.status === 'PASS' 
                ? `Conditions are safe for ${selectedCrop}.` 
                : `Water deficit detected. ${selectedCrop} requires more water than available.`}
            </p>
          </div>

          {/* 2. WATER SCORE VISUALIZATION */}
          <div className="score-card">
            <div className="score-header">
              <span>Water Availability Score</span>
              <strong>{result.analysis.waterScore} / 1000</strong>
            </div>
            <div className="progress-bar-bg">
              <div 
                className="progress-bar-fill" 
                style={{ 
                  width: getScoreWidth(result.analysis.waterScore),
                  backgroundColor: getScoreColor(result.analysis.waterScore)
                }}
              ></div>
            </div>
            
            <div className="metrics-row">
              <div className="metric">
                <span className="label">Groundwater</span>
                <span className="value">{result.analysis.predictedDepth}</span>
              </div>
              <div className="metric">
                <span className="label">Soil Moisture</span>
                <span className="value">{result.analysis.soilMoisture}</span>
              </div>
              <div className="metric">
                <span className="label">Rain Forecast</span>
                <span className="value">{result.analysis.rainForecast}</span>
              </div>
            </div>
          </div>

          {/* 3. SUGGESTIONS */}
          {result.suggestions.length > 0 && (
            <div className="suggestions-section">
              <h3>💡 Smart Swaps (Maximize Profit)</h3>
              <div className="suggestions-list">
                {result.suggestions.map((s, i) => (
                  <div key={i} className="suggestion-item">
                    <div className="s-left">
                      <strong>{s.crop.toUpperCase()}</strong>
                      <small>Requires: {s.required} pts</small>
                    </div>
                    <div className="s-right">
                      <span>₹{s.profit.toLocaleString()}</span>
                      <small>Est. Profit</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CropPlanner;