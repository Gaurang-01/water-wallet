import React, { useEffect, useState } from 'react';
import MetricCard from '../../components/common/MetricCard'; 
import './Dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  
  // Default to standard crop for the dashboard view
  const [selectedCrop, setSelectedCrop] = useState("mustard"); 

  const fetchData = async () => {
    const location = localStorage.getItem("location") || "Punade"; 
    setLoading(true);
    setError(false);

    try {
      const res = await fetch("http://localhost:5000/api/water/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          village: location, 
          crop: selectedCrop,
          area: 1
        })
      });

      const result = await res.json();
      
      // Safety check: Ensure result has the expected structure
      if (!result || !result.analysis) {
          throw new Error("Invalid Data Structure");
      }
      
      setData(result);
    } catch (err) {
      console.error("Failed to fetch water data", err);
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    window.addEventListener("locationChanged", fetchData);
    return () => window.removeEventListener("locationChanged", fetchData);
  }, [selectedCrop]);

  if (loading) return <div className="page-content">Connecting to Water Satellites...</div>;
  if (error) return <div className="page-content">⚠️ Connection Error. Ensure Backend is running.</div>;
  if (!data) return <div className="page-content">No Data Found</div>;

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>🏦 Solvency Dashboard</h1>
        <p>
           Credit Risk Audit for Village: 
           <strong> {localStorage.getItem("location") || "Punade"}</strong>
           <span style={{marginLeft: '10px', fontSize:'0.8em', color:'#666'}}>
             (Source: {data.meta?.source || 'Hybrid'})
           </span>
        </p>
      </div>

      {/* --- TOP METRICS GRID --- */}
      <div className="dashboard-grid">
        {/* Metric 1: Solvency Score (The USP) */}
        <MetricCard
          title="Solvency Score"
          value={data.score?.value || 0}
          unit="/ 100"
          trend={data.score?.value > 75 ? 'High' : 'Low'}
        />

        {/* Metric 2: Groundwater Depth */}
        <MetricCard
          title="Water Depth"
          value={data.analysis?.depth || "N/A"}
          unit="" 
        />

        {/* Metric 3: Water Assets (New Metric) */}
        <MetricCard
          title="Water Assets"
          value={data.analysis?.waterAssets || 0}
          unit="pts"
        />
        
        {/* Metric 4: Crop Liability (Cost) */}
        <MetricCard
            title="Crop Liability"
            value={data.analysis?.cropLiability || 0}
            unit="pts"
        />
      </div>

      {/* --- SOWING WINDOW (New Feature) --- */}
      {data.sowingWindow && (
        <div className="analysis-section" style={{marginTop: '20px'}}>
             <div style={{
                 background: '#f0f9ff', 
                 padding: '15px', 
                 borderRadius: '12px', 
                 border: '1px solid #bae6fd',
                 display: 'flex', alignItems: 'center', gap: '15px'
             }}>
                 <span style={{fontSize: '24px'}}>🗓️</span>
                 <div>
                     <strong style={{color:'#0369a1'}}>Recommended Sowing Window</strong>
                     <div style={{color:'#0c4a6e'}}>
                        {data.sowingWindow.start ? new Date(data.sowingWindow.start).toLocaleDateString() : 'Pending Forecast'} 
                        {' ➔ '} 
                        {data.sowingWindow.end ? new Date(data.sowingWindow.end).toLocaleDateString() : ''}
                     </div>
                 </div>
             </div>
        </div>
      )}

      {/* --- STATUS CARD --- */}
      <div className="analysis-section" style={{ marginTop: '2rem' }}>
        <div 
            className="status-card"
            style={{
                padding: '20px',
                borderRadius: '12px',
                background: data.score?.category.includes("Approved") ? '#dcfce7' : '#fee2e2',
                border: `2px solid ${data.score?.category.includes("Approved") ? '#22c55e' : '#ef4444'}`,
                textAlign: 'center'
            }}
        >
            <h2 style={{ margin: 0, color: data.score?.category.includes("Approved") ? '#166534' : '#991b1b' }}>
                {selectedCrop.toUpperCase()}: {data.score?.category}
            </h2>
            <p style={{marginTop:'10px'}}>
                {data.score?.category.includes("Approved") 
                    ? "Credit Approved. Water assets exceed crop liabilities." 
                    : "High Risk. Consider swapping crops to improve solvency."}
            </p>
        </div>
      </div>

      {/* --- SUGGESTIONS --- */}
      {data.suggestions && data.suggestions.length > 0 && (
        <div className="suggestions-box" style={{ marginTop: '20px' }}>
          <h3>💡 Low-Risk Alternatives</h3>
          <div className="suggestion-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '15px' }}>
            {data.suggestions.map((s, idx) => (
                <div key={idx} style={{ background: 'white', padding: '15px', borderRadius: '8px', border:'1px solid #e5e7eb' }}>
                    <strong>{s.crop.toUpperCase()}</strong>
                    <div style={{ fontSize: '0.9rem', color: '#15803d', fontWeight:'bold' }}>Cost: {s.cost} pts</div>
                </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;