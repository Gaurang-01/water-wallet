import React, { useState } from 'react';
import './CropPlanner.css';

const CropPlanner = () => {
  const [selectedCrop, setSelectedCrop] = useState('mustard');
  const [area, setArea] = useState(1);
  const [village, setVillage] = useState('Punade'); // Default for demo

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheck = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      // Ensure your backend is running on port 5000
      const res = await fetch('http://localhost:5000/api/water/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          village: village,
          crop: selectedCrop,
          area: Number(area)
        })
      });

      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      
      setResult(data);
    } catch (err) {
      console.error(err);
      setError("Could not connect to Water Engine. Is the backend running?");
    } finally {
      setLoading(false);
    }
  };

  // Helper: Calculate Width of Score Bar (Max 100%)
  const getScoreWidth = (score) => Math.min((score / 1000) * 100, 100) + "%";

  // Helper: Color Code the Score
  const getScoreColor = (score) => {
    if(score < 300) return '#ef4444'; // Red (Danger)
    if(score < 600) return '#eab308'; // Yellow (Warning)
    return '#22c55e'; // Green (Safe)
  };

  return (
    <div className="page-content">
      <div className="planner-header">
        <h1>🚜 Crop Solvency Planner</h1>
        <p>AI-driven viability check based on Real-time Soil Moisture & Aquifer Depth.</p>
      </div>

      {/* --- INPUT SECTION --- */}
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
            <label>Crop Selection</label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
            >
              <option value="lentil">Lentil (Low Water)</option>
              <option value="chickpea">Chickpea (Medium)</option>
              <option value="mustard">Mustard (Medium)</option>
              <option value="paddy">Paddy (High Water)</option>
              <option value="sugarcane">Sugarcane (Extreme)</option>
            </select>
          </div>

          <div className="input-group">
            <label>Farm Area (Acres)</label>
            <input
              type="number"
              value={area}
              min="0.5"
              step="0.5"
              onChange={(e) => setArea(e.target.value)}
            />
          </div>
        </div>

        <button onClick={handleCheck} disabled={loading} className="analyze-btn">
          {loading ? 'Analyzing Soil & Water...' : 'Run Simulation'}
        </button>
        
        {error && <p className="error-msg">{error}</p>}
      </div>

      {/* --- RESULTS SECTION --- */}
      {result && (
        <div className="results-container">
          
          {/* 1. PASS/FAIL BANNER */}
          <div className={`status-banner ${result.cropResult.status.toLowerCase()}`}>
            <h2>
              {result.cropResult.status === 'PASS' ? '✅ VIABLE CROP' : '⚠️ HIGH RISK'}
            </h2>
            <p>
              {result.cropResult.status === 'PASS' 
                ? `Soil moisture and aquifer levels are sufficient for ${selectedCrop}.` 
                : `Water deficit detected! ${selectedCrop} requires more water than currently available.`}
            </p>
          </div>

          {/* 2. WATER SCORE GAUGE */}
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

          {/* 3. SMART SWAP SUGGESTIONS */}
          {result.suggestions && result.suggestions.length > 0 ? (
            <div className="suggestions-section">
              <h3>
                {result.cropResult.status === 'FAIL' 
                  ? '💡 Recommended Safer Swaps' 
                  : '💰 Higher Profit Alternatives'}
              </h3>
              
              <div className="suggestions-list">
                {result.suggestions.map((s, i) => (
                  <div key={i} className="suggestion-item">
                    <div className="s-left">
                      <strong>{s.crop.toUpperCase()}</strong>
                      <span className="save-tag">
                        {s.waterSaved > 0 
                          ? `Saves ${s.waterSaved} pts water` 
                          : 'Optimal Choice'}
                      </span>
                    </div>
                    <div className="s-right">
                      <span className="profit-text">₹{s.profit.toLocaleString()}</span>
                      <small>Est. Revenue</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
             <div className="suggestions-section">
               <p style={{textAlign:'center', color:'#888', fontStyle:'italic'}}>
                 No alternative crops recommended for these soil conditions.
               </p>
             </div>
          )}

        </div>
      )}
    </div>
  );
};

export default CropPlanner;