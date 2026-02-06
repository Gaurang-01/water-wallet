import React, { useEffect, useState } from 'react';
import MetricCard from '../../components/common/MetricCard'; // Keeping your component
import './Dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // You might want to let users pick this in the UI later, 
  // but for now we keep state so we can easily switch it.
  const [selectedCrop, setSelectedCrop] = useState("chickpea"); 

  const fetchData = async () => {
    const location = localStorage.getItem("location") || "Punade"; // Default village
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/water/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Mapping your frontend "location" to backend "village"
        body: JSON.stringify({
          village: location, 
          crop: selectedCrop,
          area: 1
        })
      });

      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error("Failed to fetch water data", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    window.addEventListener("locationChanged", fetchData);
    return () => window.removeEventListener("locationChanged", fetchData);
  }, [selectedCrop]); // Re-run if crop changes

  if (loading) return <div className="page-content">Analyzing Soil & Aquifers...</div>;
  if (!data) return <div className="page-content">No Data Found</div>;

  // Helper to color-code the score
  const getScoreColor = (score) => {
    if (score < 300) return 'var(--danger, #ef4444)';
    if (score < 600) return 'var(--warning, #eab308)';
    return 'var(--success, #22c55e)';
  };

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Aquifer Inventory</h1>
        <p>
          Real-time groundwater audit for Village: 
          <strong> {data.analysis.village || "Unknown"}</strong>
        </p>
      </div>

      {/* --- TOP METRICS GRID --- */}
      <div className="dashboard-grid">
        {/* Metric 1: The New "Water Score" */}
        <MetricCard
          title="Water Availability Score"
          value={data.analysis.waterScore}
          unit="/ 1000"
          trend={data.cropResult.status === 'PASS' ? 'High' : 'Low'}
        />

        {/* Metric 2: Groundwater (Predicted) */}
        <MetricCard
          title="Predicted Depth"
          value={data.analysis.predictedDepth}
          unit="" // Unit is part of the string in new backend
        />

        {/* Metric 3: Soil Moisture (The new API feature) */}
        <MetricCard
          title="Soil Moisture"
          value={data.analysis.soilMoisture}
          unit=""
        />
        
        {/* Metric 4: Rainfall Forecast */}
        <MetricCard
            title="3-Day Rainfall"
            value={data.analysis.rainForecast}
            unit=""
        />
      </div>

      {/* --- CROP VIABILITY CARD (New Section) --- */}
      <div className="analysis-section" style={{ marginTop: '2rem' }}>
        <div 
            className={`status-card ${data.cropResult.status.toLowerCase()}`}
            style={{
                padding: '20px',
                borderRadius: '12px',
                background: data.cropResult.status === 'PASS' ? '#dcfce7' : '#fee2e2',
                border: `2px solid ${data.cropResult.status === 'PASS' ? '#22c55e' : '#ef4444'}`,
                textAlign: 'center'
            }}
        >
            <h2 style={{ margin: 0, color: data.cropResult.status === 'PASS' ? '#166534' : '#991b1b' }}>
                {selectedCrop.toUpperCase()}: {data.cropResult.status}
            </h2>
            
            {data.cropResult.status === 'FAIL' ? (
                <p style={{ color: '#991b1b' }}>
                   ⚠️ Water Deficit: <strong>{data.cropResult.deficit} points</strong>. 
                   Groundwater is too deep and soil is too dry for this crop.
                </p>
            ) : (
                <p style={{ color: '#166534' }}>
                   ✅ Safe to sow. Moisture levels are adequate.
                </p>
            )}
        </div>
      </div>

      {/* --- SMART SUGGESTIONS (New Section) --- */}
      {data.suggestions && data.suggestions.length > 0 && (
        <div className="suggestions-box" style={{ marginTop: '20px' }}>
          <h3>💡 Recommended Swaps</h3>
          <div className="suggestion-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
            {data.suggestions.map((s, idx) => (
                <div key={idx} style={{ background: 'white', padding: '15px', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                    <strong>{s.crop.toUpperCase()}</strong>
                    <div style={{ fontSize: '0.9rem', color: '#666' }}>Profit: ₹{s.profit}</div>
                </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;