import React from "react";
import { useLogin } from "../../hooks/useLogin";
import "./Login.css";
import car6 from "../../assets/images/car6.jpg";
import { Link } from "react-router-dom";

const Login = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    setShowPassword,
    keepLoggedIn,
    setKeepLoggedIn,
    errors,
    touched,
    message,
    loading,
    handleBlur,
    clearError,
    handleSubmit,
  } = useLogin();

  // Determine message type for styling
  const getMessageType = () => {
    if (message.includes("Welcome back")) return "success";
    if (message.includes("Invalid") || message.includes("failed") || message.includes("error")) return "error";
    return "info";
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-form-section">
          <div className="login-form-container">
            <div className="login-header">
              <h1 className="login-title">Welcome Back</h1>
              <p className="login-subtitle">Sign in to your Dragon Soul account</p>
            </div>

            <form onSubmit={handleSubmit} className="login-form" noValidate>
              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <div className={`input-container ${errors.email && touched.email ? 'error' : ''}`}>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) clearError('email');
                    }}
                    onBlur={() => handleBlur('email')}
                    className="form-input"
                    placeholder="Enter your email"
                    required
                    disabled={loading}
                  />
                  <i className="bi bi-envelope input-icon"></i>
                  {errors.email && touched.email && <div className="error-icon"><i className="bi bi-exclamation-circle"></i></div>}
                </div>
                {errors.email && touched.email && <div className="error-message animate-error">{errors.email}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <div className={`input-container ${errors.password && touched.password ? 'error' : ''}`}>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) clearError('password');
                    }}
                    onBlur={() => handleBlur('password')}
                    className="form-input"
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                  />
                  <i className="bi bi-lock input-icon"></i>
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={loading}
                  >
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                  {errors.password && touched.password && <div className="error-icon"><i className="bi bi-exclamation-circle"></i></div>}
                </div>
                {errors.password && touched.password && <div className="error-message animate-error">{errors.password}</div>}
              </div>

              <div className="form-options">
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    checked={keepLoggedIn}
                    onChange={(e) => setKeepLoggedIn(e.target.checked)}
                    disabled={loading}
                  />
                  <span className="checkmark"></span>
                  Keep me logged in
                </label>
              </div>

              <button
                type="submit"
                className={`login-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                {loading ? "Signing In..." : "Sign In"}
                {!loading && <i className="bi bi-arrow-right"></i>}
              </button>

              {/* Enhanced Message Display */}
              {message && (
                <div className={`message-container message-${getMessageType()} ${getMessageType() === 'error' ? 'backend-error' : ''}`}>
                  {getMessageType() === 'success' && (
                    <span className="success-checkmark">✅</span>
                  )}
                  {getMessageType() === 'error' && (
                    <span className="error-icon">⚠️</span>
                  )}
                  {message.includes("Welcome back") ? (
                    <span>
                      {message.split("Dragon Master")[0]}
                      <span className="dragon-welcome">Dragon Master</span>
                      {message.split("Dragon Master")[1]}
                    </span>
                  ) : (
                    message
                  )}
                </div>
              )}

              <div className="login-links">
                <Link to="/reset-password" className="login-link">Forgot your password?</Link>
                <Link to="/SignUp" className="login-link register-link">
                  Don't have an account? <span>Create one</span>
                </Link>
              </div>
            </form>
          </div>
        </div>

        <div className="login-image-section">
          <div className="login-image" style={{ backgroundImage: `url(${car6})` }}>
            <div className="image-overlay">
              <h1 className="brand-title">DRAGON SOUL</h1>
              <p className="brand-tagline">Premium Automotive Excellence</p>
              <p className="brand-tagline" style={{ marginTop: '20px', fontSize: '1rem' }}>
                Where Legends Drive
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;