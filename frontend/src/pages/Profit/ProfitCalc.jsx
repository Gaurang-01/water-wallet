import React, { useState } from 'react';
import './ProfitCalc.css';

const ProfitCalc = () => {
  const [investment, setInvestment] = useState(15000);
  const [marketPrice, setMarketPrice] = useState(3200);

  // Simple ROI Logic for demo
  const revenue = (marketPrice * 12); // Assumed yield
  const profit = revenue - investment;
  const roi = ((profit / investment) * 100).toFixed(1);

  return (
    <div className="profit-page">
      <header className="page-header">
        <h1>💰 Profit Calculator</h1>
        <p>Estimate your Return on Investment (ROI) before sowing.</p>
      </header>

      <div className="calc-container">
        {/* INPUTS */}
        <div className="calc-card inputs">
            <h3>Cost Inputs</h3>
            
            <div className="input-group">
                <label>Input Cost (Seeds/Fertilizer) ₹</label>
                <input 
                    type="number" 
                    value={investment} 
                    onChange={(e) => setInvestment(Number(e.target.value))} 
                />
            </div>

            <div className="input-group">
                <label>Market Price (per Quintal) ₹</label>
                <input 
                    type="number" 
                    value={marketPrice} 
                    onChange={(e) => setMarketPrice(Number(e.target.value))} 
                />
            </div>
            
            <div className="slider-group">
                <label>Expected Yield: <strong>12 Quintals</strong></label>
                <input type="range" disabled value="12" />
            </div>
        </div>

        {/* RESULTS */}
        <div className="calc-card results">
            <h3>Projected ROI</h3>
            <div className="roi-circle">
                <span>{roi}%</span>
                <small>Return</small>
            </div>
            
            <div className="summary-row">
                <span>Net Profit:</span>
                <span className="profit-val">+₹{profit.toLocaleString()}</span>
            </div>
            
            <button className="btn-export">
                <span className="material-icons">download</span> Download Report
            </button>
        </div>
      </div>
    </div>
  );
};

export default ProfitCalc;