import React from 'react';

const DataTile = ({ title, value, unit, trend }) => {
  return (
    <div className="data-tile">
      <p className="tile-title">{title}</p>
      <div className="tile-main">
        <h2 className="tile-value">{value}</h2>
        <span className="tile-unit">{unit}</span>
      </div>
      <p className={`tile-trend ${trend.startsWith('+') ? 'up' : 'down'}`}>
        {trend} from last month
      </p>
    </div>
  );
};

export default DataTile;