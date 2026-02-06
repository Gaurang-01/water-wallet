import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const [lang, setLang] = useState('hi');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // 1 = phone, 2 = otp
  const [loading, setLoading] = useState(false);

  const toggleLang = () => {
    setLang(lang === 'hi' ? 'en' : 'hi');
  };

  const content = {
    hi: {
      welcome: "स्वागत है किसान भाई",
      subtitle: "अपने खेत का पानी बचाएं, मुनाफा बढ़ाएं",
      phonePlaceholder: "मोबाइल नंबर (10 अंक)",
      otpPlaceholder: "6 अंकों का OTP",
      sendOtp: "OTP भेजें",
      verify: "लॉगिन करें",
      resend: "OTP दोबारा भेजें",
      newUser: "नए यूजर हैं?",
      signup: "साइनअप करें",
      tagline: "NASA & WRIS डेटा का उपयोग करते हुए",
      brandName: "जल वॉलेट"
    },
    en: {
      welcome: "Welcome Farmer",
      subtitle: "Save water, increase profit",
      phonePlaceholder: "Mobile Number (10 digits)",
      otpPlaceholder: "6-digit OTP",
      sendOtp: "Send OTP",
      verify: "Login",
      resend: "Resend OTP",
      newUser: "New user?",
      signup: "Sign Up",
      tagline: "Using NASA & WRIS Data",
      brandName: "WaterWallet"
    }
  };

  const t = content[lang];

  const handleSendOtp = (e) => {
  e.preventDefault();

  if (phone.length !== 10) {
    alert("Enter 10 digit number");
    return;
  }

  // demo → directly move to OTP
  setStep(2);
};
const handleVerify = (e) => {
  e.preventDefault();

  // always login (hackathon mode)
  localStorage.setItem('userPhone', phone);
  navigate('/app');
};

  const handleResendOtp = () => {
    setOtp('');
    setStep(1);
  };

  return (
    <div className="login-container">
      
      {/* LEFT SIDE - BRANDING */}
      <div className="login-left">
        <div className="brand-section">
          <div className="logo-large">
            <span>💧</span>
            <h2>{t.brandName}</h2>
          </div>
          <p className="tagline">{t.tagline}</p>
          
          <div className="farmer-illustration">
            <span className="illustration-icon">🌾</span>
            <span className="illustration-icon">💧</span>
            <span className="illustration-icon">📊</span>
          </div>

          <div className="trust-badges">
            <div className="badge">NASA</div>
            <div className="badge">WRIS</div>
            <div className="badge">OpenWeather</div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE - LOGIN FORM */}
      <div className="login-right">
        <button className="lang-toggle-login" onClick={toggleLang}>
          {lang === 'hi' ? 'EN' : 'हिं'}
        </button>

        <div className="login-form-wrap">
          <h1>{t.welcome}</h1>
          <p className="subtitle">{t.subtitle}</p>

          {step === 1 ? (
            <form onSubmit={handleSendOtp}>
              <div className="input-group">
                <span className="input-icon">📱</span>
                <div className="phone-input-wrapper">
                  <span className="country-code">+91</span>
                  <input
                    type="tel"
                    placeholder={t.phonePlaceholder}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                    required
                    disabled={loading}
                  />
                </div>
              </div>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? (lang === 'hi' ? 'भेज रहे हैं...' : 'Sending...') : t.sendOtp}
                <span className="arrow">→</span>
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify}>
              <div className="otp-info">
                <p>{lang === 'hi' ? 'OTP भेजा गया' : 'OTP sent to'}: +91 {phone}</p>
                <button type="button" className="edit-phone" onClick={() => setStep(1)}>
                  {lang === 'hi' ? 'बदलें' : 'Edit'}
                </button>
              </div>
              <div className="input-group">
                <span className="input-icon">🔒</span>
                <input
                  type="text"
                  placeholder={t.otpPlaceholder}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  required
                  disabled={loading}
                  autoFocus
                />
              </div>
              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? (lang === 'hi' ? 'जांच रहे हैं...' : 'Verifying...') : t.verify}
                <span className="arrow">✓</span>
              </button>
              <button type="button" className="btn-resend" onClick={handleResendOtp} disabled={loading}>
                {t.resend}
              </button>
            </form>
          )}

          <div className="signup-link">
            {t.newUser} <span onClick={() => navigate('/signup')}>{t.signup}</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default LoginPage;