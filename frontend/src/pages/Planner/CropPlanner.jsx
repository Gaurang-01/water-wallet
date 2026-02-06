import React, { useState } from 'react';
import './CropPlanner.css';

const CropPlanner = () => {
  const [selectedCrop, setSelectedCrop] = useState('Sugarcane');
  const [showResult, setShowResult] = useState(false);

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>Crop Solvency Planner</h1>
        <p>Check if your land has enough water budget for your crop.</p>
      </div>

      <div className="planner-container">
        {/* Input Section */}
        <div className="input-card">
          <h3>Sowing Details</h3>
          <div className="form-group">
            <label>Select Crop</label>
            <select 
              value={selectedCrop} 
              onChange={(e) => {
                setSelectedCrop(e.target.value);
                setShowResult(false);
              }}
            >
              <option value="Sugarcane">Sugarcane (High Water)</option>
              <option value="Paddy">Paddy (Basmati)</option>
              <option value="Mustard">Mustard (Low Water)</option>
            </select>
          </div>
          <div className="form-group">
            <label>Land Area (Acres)</label>
            <input type="number" placeholder="e.g. 2.5" />
          </div>
          <button className="btn-primary" onClick={() => setShowResult(true)}>
            Check Viability
          </button>
        </div>

        {/* Results Section */}
        {showResult && (
          <div className="result-area">
            {selectedCrop === 'Sugarcane' ? (
              // INSOLVENT SCENARIO
              <div className="alert-card danger">
                <div className="alert-header">
                  <span className="material-icons">warning</span>
                  <h2>INSOLVENT: High Risk of Failure</h2>
                </div>
                <p>Your borewell will run dry in <strong>86 days</strong>.</p>
                <div className="water-math">
                  <div className="math-row">
                    <span>Available Water:</span> <span>420 mm</span>
                  </div>
                  <div className="math-row red">
                    <span>Required:</span> <span>- 1200 mm</span>
                  </div>
                  <div className="math-row total">
                    <span>Deficit:</span> <span>780 mm</span>
                  </div>
                </div>
                
                <div className="smart-swap">
                  <h3>💡 Smart-Swap Recommendation</h3>
                  <div className="swap-card">
                    <div className="swap-info">
                      <h4>Switch to Mustard</h4>
                      <p>Requires only 300mm water.</p>
                    </div>
                    <div className="swap-profit">
                      <span>Est. Profit</span>
                      <strong>₹45,000/acre</strong>
                    </div>
                    <button className="btn-outline">View Plan</button>
                  </div>
                </div>
              </div>
            ) : (
              // SOLVENT SCENARIO
              <div className="alert-card safe">
                <div className="alert-header">
                  <span className="material-icons">check_circle</span>
                  <h2>SOLVENT: Safe to Grow</h2>
                </div>
                <p>You have excess water budget for this season.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CropPlanner;