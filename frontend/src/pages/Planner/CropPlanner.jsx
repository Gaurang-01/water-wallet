import React, { useState } from 'react';
import './CropPlanner.css';

const CropPlanner = () => {
  const [formData, setFormData] = useState({ village: 'Punade', crop: 'mustard', area: 1 });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleCheck = async () => {
    setLoading(true);
    setErrorMsg('');
    setResult(null); 
    
    try {
      const res = await fetch('http://localhost:5000/api/water/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server Error");
      setResult(data);
    } catch (err) {
      console.error(err);
      setErrorMsg("Ensure Backend is running & Files are in correct folder.");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
      if(!score) return '#e2e8f0'; 
      return score < 50 ? '#ef4444' : score < 75 ? '#eab308' : '#22c55e';
  };

  return (
    <div className="page-content">
      <div className="planner-header">
        <h1>🏦 Climate Credit Score</h1>
        <p>Evaluating Loan Eligibility based on Water Solvency</p>
      </div>

      <div className="planner-form-card">
        <div className="row-group">
            <div className="input-group">
                <label>Village Name</label>
                <input value={formData.village} onChange={(e)=>setFormData({...formData, village: e.target.value})} />
            </div>
            <div className="input-group">
                <label>Crop Plan</label>
                <select value={formData.crop} onChange={(e)=>setFormData({...formData, crop: e.target.value})}>
                    <option value="lentil">Lentil</option>
                    <option value="chickpea">Chickpea</option>
                    <option value="mustard">Mustard</option>
                    <option value="paddy">Paddy</option>
                    <option value="sugarcane">Sugarcane</option>
                </select>
            </div>
            <div className="input-group">
                <label>Acres</label>
                <input type="number" value={formData.area} onChange={(e)=>setFormData({...formData, area: Number(e.target.value)})} />
            </div>
        </div>
        <button onClick={handleCheck} disabled={loading} className="analyze-btn">
          {loading ? 'Calculating Risk...' : 'Check Credit Eligibility'}
        </button>
        
        {errorMsg && <div className="error-msg" style={{marginTop:'15px'}}>⚠️ {errorMsg}</div>}
      </div>

      {/* --- SAFE RENDER SECTION --- */}
      {result && (
        <div className="results-container">
          
          {/* 1. CREDIT SCORE CARD */}
          {result?.score && (
            <div className="credit-card" style={{
                background: `linear-gradient(135deg, ${getScoreColor(result.score.value)} 0%, #1e293b 100%)`,
                color: 'white', padding: '20px', borderRadius: '15px', marginBottom: '20px', boxShadow: '0 10px 20px rgba(0,0,0,0.2)'
            }}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                    <div>
                        <h3 style={{margin:0, opacity:0.9, fontSize:'0.8rem'}}>SOLVENCY SCORE</h3>
                        <h1 style={{fontSize:'3.5rem', margin:0, fontWeight:'800'}}>{result.score.value}</h1>
                    </div>
                    <div style={{textAlign:'right'}}>
                        <div style={{background:'rgba(255,255,255,0.2)', padding:'5px 12px', borderRadius:'6px', fontWeight:'bold'}}>
                            {result.score.category}
                        </div>
                        <p style={{marginTop:'10px', fontSize:'0.8rem'}}>Source: {result.meta?.source}</p>
                    </div>
                </div>
            </div>
          )}

          {/* 2. SOWING WINDOW (The part that was crashing!) */}
          {result?.sowingWindow && (
             <div className="sowing-card" style={{
                 background: '#f0f9ff', padding: '15px', borderRadius: '8px', marginBottom: '20px', 
                 border: '1px solid #bae6fd', display: 'flex', alignItems: 'center', gap: '15px'
             }}>
                 <span style={{fontSize: '24px'}}>🗓️</span>
                 <div>
                     <strong style={{color:'#0369a1'}}>Sowing Window (Next 14 Days)</strong>
                     <div style={{color:'#0c4a6e'}}>
                        {/* SAFE DATES: We check if they exist first */}
                        {result.sowingWindow.start ? new Date(result.sowingWindow.start).toLocaleDateString() : 'TBD'} 
                        {' ➔ '} 
                        {result.sowingWindow.end ? new Date(result.sowingWindow.end).toLocaleDateString() : 'TBD'}
                     </div>
                 </div>
             </div>
          )}

          {/* 3. METRICS */}
          <div className="score-card">
            <div className="metrics-row">
                <div className="metric">
                    <span className="label">Water Assets</span>
                    <span className="value" style={{color:'#22c55e'}}>+{result?.analysis?.waterAssets || 0}</span>
                </div>
                <div className="metric">
                    <span className="label">Crop Liability</span>
                    <span className="value" style={{color:'#ef4444'}}>-{result?.analysis?.cropLiability || 0}</span>
                </div>
                <div className="metric">
                    <span className="label">Groundwater</span>
                    <span className="value">{result?.analysis?.depth || 'N/A'}</span>
                </div>
            </div>
          </div>
          
          {/* 4. SUGGESTIONS */}
          {result?.suggestions?.length > 0 && (
              <div className="suggestions-section">
                  <h3>✅ Lower Risk Alternatives</h3>
                  {result.suggestions.map((s, i) => (
                      <div key={i} className="suggestion-item">
                          <strong>{s.crop.toUpperCase()}</strong>
                          <span className="save-tag">Cost: {s.cost} (Save {result.analysis.cropLiability - s.cost} pts)</span>
                      </div>
                  ))}
              </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CropPlanner;