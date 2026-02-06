import React, { createContext, useContext, useState } from 'react';

const WaterContext = createContext();

export const WaterProvider = ({ children }) => {
  const [region, setRegion] = useState({ state: 'Uttar Pradesh', district: 'Prayagraj', block: 'Chaka' });
  const [balance, setBalance] = useState(420); // mm
  const [language, setLanguage] = useState('en');

  return (
    <WaterContext.Provider value={{ region, setRegion, balance, setBalance, language, setLanguage }}>
      {children}
    </WaterContext.Provider>
  );
};

export const useWater = () => useContext(WaterContext);