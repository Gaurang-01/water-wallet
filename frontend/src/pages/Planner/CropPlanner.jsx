import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import './CropPlanner.css';

const CropPlanner = () => {
  const { t } = useLanguage();
  
  // State for inputs
  const [village, setVillage] = useState('Punade');
  const [selectedCrop, setSelectedCrop] = useState('Sugarcane'); // Default to risky crop to show demo
  const [area, setArea] = useState('1');
  
  // State for results
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheck = () => {
    setLoading(true);
    // Simulating an API check (Wait 1 second for "thinking" effect)
    setTimeout(() => {
      setShowResult(true);
      setLoading(false);
    }, 800);
  };

  // Helper to determine if the result is safe or risky (Mock Logic)
  // In a real app, this would come from your backend API
  const isRisky = selectedCrop === 'Sugarcane' || selectedCrop === 'Paddy';

  return (
    <div className="page-content">
      <div className="page-header">
        <h1>{t.planner_title}</h1>
        <p>{t.planner_subtitle}</p>
      </div>

      <div className="planner-container">
        {/* --- INPUT CARD --- */}
        <div className="input-card">
          
          {/* Village Input */}
          <div className="form-group">
            <label>Village / गाँव</label>
            <input 
              type="text" 
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              placeholder="e.g. Punade"
            />
          </div>

          {/* Crop Selector */}
          <div className="form-group">
            <label>{t.input_crop}</label>
            <select 
              value={selectedCrop} 
              onChange={(e) => {
                setSelectedCrop(e.target.value);
                setShowResult(false);
              }}
            >
              <option value="Sugarcane">{t.crop_sugarcane}</option>
              <option value="Paddy">{t.crop_paddy}</option>
              <option value="Mustard">{t.crop_mustard}</option>
            </select>
          </div>

          {/* Area Input */}
          <div className="form-group">
            <label>{t.input_area}</label>
            <input 
              type="number" 
              value={area}
              onChange={(e) => setArea(e.target.value)}
              placeholder="1.0" 
            />
          </div>

          <button 
            className="btn-primary" 
            onClick={handleCheck}
            disabled={loading}
          >
            {loading ? '...' : t.btn_check}
          </button>
        </div>

        {/* --- RESULTS AREA --- */}
        {showResult && (
          <div className="result-area">
            {isRisky ? (
              // --- DANGER RESULT (INSOLVENT) ---
              <div className="alert-card danger">
                <div className="alert-header">
                  <span className="material-icons icon-lg">warning</span>
                  <h2>{t.result_insolvent}</h2>
                </div>
                
                <p className="result-desc">{t.result_desc_risk}</p>
                
                {/* Visual Water Math */}
                <div className="water-math">
                  <div className="math-row">
                    <span>{t.math_avail}</span> <span>420 mm</span>
                  </div>
                  <div className="math-row red">
                    <span>{t.math_req}</span> <span>- 1200 mm</span>
                  </div>
                  <hr className="divider"/>
                  <div className="math-row total">
                    <span>{t.math_deficit}</span> <span>780 mm</span>
                  </div>
                </div>
                
                {/* Smart Swap Recommendation */}
                <div className="smart-swap">
                  <h3>{t.swap_title}</h3>
                  <div className="swap-card">
                    <div className="swap-icon">💡</div>
                    <div className="swap-info">
                      <h4>{t.swap_rec}</h4>
                      <p>{t.swap_reason}</p>
                    </div>
                    <div className="swap-profit">
                      <span>{t.swap_profit}</span>
                      <strong>₹45,000 /acre</strong>
                    </div>
                    <button className="btn-outline small">{t.btn_view_plan}</button>
                  </div>
                </div>
              </div>
            ) : (
              // --- SAFE RESULT (SOLVENT) ---
              <div className="alert-card safe">
                <div className="alert-header">
                  <span className="material-icons icon-lg">check_circle</span>
                  <h2>{t.result_solvent}</h2>
                </div>
                <p className="result-desc">{t.result_desc_safe}</p>
                
                <div className="water-math safe-border">
                  <div className="math-row">
                    <span>{t.math_avail}</span> <span>420 mm</span>
                  </div>
                  <div className="math-row green">
                    <span>{t.math_req}</span> <span>- 300 mm</span>
                  </div>
                  <hr className="divider"/>
                  <div className="math-row total green-text">
                    <span>Surplus:</span> <span>+ 120 mm</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CropPlanner;