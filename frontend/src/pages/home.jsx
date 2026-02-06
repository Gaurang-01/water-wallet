import React, { useState, useEffect } from 'react';
import DataTile from '../components/DataTile';

const Home = () => {
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsFetching(false), 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="home-container">
      <div className="home-header">
        <div>
          <h1 className="page-title">Ground Water Monitoring</h1>
          <p className="page-subtitle">National Data Analysis & GIS Management Portal</p>
        </div>
        <div className="action-btns">
          <button className="btn-sec">Filters</button>
          <button className="btn-pri">Generate Report</button>
        </div>
      </div>

      <div className="stats-grid">
        <DataTile title="Avg Water Level" value="12.4" unit="mbgl" trend="-0.4%" />
        <DataTile title="Total Basins" value="024" unit="active" trend="+2" />
        <DataTile title="Quality Index" value="88" unit="AQI" trend="+5%" />
      </div>

      <div className="gis-workspace">
        <div className="map-card">
          <div className="card-header">
            <h3>GIS Layer Editor - Interactive</h3>
            <div className="gis-controls">
               <span className="material-icons">room</span>
               <span className="material-icons">layers</span>
               <span className="material-icons">storage</span>
            </div>
          </div>
          <div className="map-view">
            {isFetching ? (
              <div className="map-loader">
                <div className="spinner"></div>
                <p>Fetching GeoJSON Layers for Basin [ID: 024A]</p>
              </div>
            ) : (
              <div className="map-ready">GIS Engine Online</div>
            )}
          </div>
        </div>

        <div className="active-layers-card">
          <h3>Active Layers</h3>
          <div className="layer-item">
            <input type="checkbox" defaultChecked />
            <label>Aquifer Boundaries</label>
          </div>
          <div className="layer-item">
            <input type="checkbox" defaultChecked />
            <label>Monitoring Stations</label>
          </div>
          <div className="layer-item">
            <input type="checkbox" />
            <label>Rainfall Grid (Daily)</label>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;