import React, { useEffect, useState } from 'react';
import MetricCard from '../../components/common/MetricCard';
import './Dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState(null);

  const fetchData = async () => {
    const location = localStorage.getItem("location") || "Pune";

    const res = await fetch("http://localhost:5000/api/water/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        locationName: location,
        crop: "mustard"
      })
    });

    const result = await res.json();
    setData(result);
  };

  useEffect(() => {
    fetchData();

    window.addEventListener("locationChanged", fetchData);
    return () => window.removeEventListener("locationChanged", fetchData);
  }, []);

  if (!data) return <div className="page-content">Loading...</div>;

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Aquifer Inventory</h1>
        <p>
          Real-time groundwater audit for Block:
          <strong> {data.location?.district}</strong>
        </p>
      </div>

      <div className="dashboard-grid">
        <MetricCard
          title="Effective Water Balance"
          value={Math.round(data.waterAvailable)}
          unit="mm"
        />

        <MetricCard
          title="Groundwater Level"
          value={Math.round(data.groundwater)}
          unit="mm"
        />

        <MetricCard
          title="Rainfall"
          value={data.rainfall}
          unit="mm"
        />
      </div>

      {data.sowingWindow && (
        <div className="advisory-box">
          🌱 Best sowing window:
          <strong>
            {" "}
            {data.sowingWindow.start} → {data.sowingWindow.end}
          </strong>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
