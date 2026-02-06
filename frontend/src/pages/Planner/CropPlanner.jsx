import React, { useState } from 'react';
import './CropPlanner.css';

const CropPlanner = () => {
  const [selectedCrop, setSelectedCrop] = useState('mustard');
  const [area, setArea] = useState(1);
  const [location, setLocation] = useState('Pune');

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCheck = async () => {
    try {
      setLoading(true);

      const res = await fetch('http://localhost:5000/api/water/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          locationName: location,
          crop: selectedCrop,
          area: Number(area)
        })
      });

      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-content">
      <h1>Crop Solvency Planner</h1>

      {/* INPUTS */}
      <div className="planner-form">

        <input
          placeholder="Village / City"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />

        <select
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
        >
          <option value="sugarcane">Sugarcane</option>
          <option value="paddy">Paddy</option>
          <option value="mustard">Mustard</option>
          <option value="lentil">Lentil</option>
        </select>

        <input
          type="number"
          value={area}
          onChange={(e) => setArea(e.target.value)}
          placeholder="Acres"
        />

        <button onClick={handleCheck}>
          {loading ? 'Checking...' : 'Check Viability'}
        </button>
      </div>

      {/* RESULTS */}
      {result && (
        <div className="planner-result">

          <h2>Status: {result.cropResult.status}</h2>

          <p>Available Water: {result.waterAvailable} mm</p>

          {result.cropResult.deficit && (
            <p>Deficit: {result.cropResult.deficit.toFixed(1)} mm</p>
          )}

          {/* SOWING WINDOW */}
          {result.sowingWindow && (
            <div className="sowing-box">
              🌱 Best Sowing Window:
              <br />
              {new Date(result.sowingWindow.start).toLocaleString()}
              {" → "}
              {new Date(result.sowingWindow.end).toLocaleString()}
            </div>
          )}

          {/* SUGGESTIONS */}
          <h3>Smart Suggestions</h3>

          {result.suggestions.map((s, i) => (
            <div key={i} className="suggest-card">
              <b>{s.crop}</b>
              <span>Water: {s.water} mm</span>
              <span>Profit: ₹{s.profit.toLocaleString()}</span>
              <span>Score: {s.score.toFixed(2)}</span>
            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default CropPlanner;
