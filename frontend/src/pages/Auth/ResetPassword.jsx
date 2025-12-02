import React from "react";
import { useResetPassword } from "../../hooks/useResetPassword";
import "./ResetPassword.css";
import car6 from "../../assets/images/car6.jpg";

const ResetPassword = () => {
  const {
    step,
    email,
    setEmail,
    code,
    setCode,
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    showNewPassword,
    setShowNewPassword,
    showConfirmPassword,
    setShowConfirmPassword,
    errors,
    touched,
    message,
    loading,
    resendLoading,
    canResend,
    countdown,
    verifyingEmail,
    handleBlur,
    clearError,
    handleSendCode,
    handleVerifyCode,
    handleResendCode,
    handleResetPassword,
  } = useResetPassword();

  const getMessageType = () => {
    if (message.includes("successfully")) return "success";
    if (message.includes("Invalid") || message.includes("failed") || message.includes("error") || message.includes("not found")) return "error";
    return "info";
  };

  return (
    <div className="reset-password-page">
      <div className="reset-password-container">
        <div className="reset-password-form-section">
          <div className="reset-password-form-container">
            <div className="reset-password-header">
              <h1 className="reset-password-title">
                {step === 1 && "Reset Password"}
                {step === 2 && "Verify Code"}
                {step === 3 && "New Password"}
              </h1>
              <p className="reset-password-subtitle">
                {step === 1 && "Enter your email to receive a verification code"}
                {step === 2 && "Enter the verification code sent to your email"}
                {step === 3 && "Enter your new password"}
              </p>
            </div>


            {step === 1 && (
              <form onSubmit={handleSendCode} className="reset-password-form" noValidate>
                <div className={`form-step ${step === 1 ? 'active' : ''}`}>
                  <div className="form-group">
                    <label htmlFor="resetEmail" className="form-label">Email Address</label>
                    <div className={`input-container ${errors.email && touched.email ? 'error' : ''} ${verifyingEmail ? 'verifying' : ''}`}>
                      <input
                        type="email"
                        id="resetEmail"
                        value={email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (errors.email) clearError('email');
                        }}
                        onBlur={() => handleBlur('email')}
                        className="form-input"
                        placeholder="Enter your email"
                        required
                        disabled={loading || verifyingEmail}
                      />
                      <i className="bi bi-envelope input-icon"></i>
                      {verifyingEmail && (
                        <div className="verifying-spinner">
                          <div className="spinner"></div>
                        </div>
                      )}
                      {errors.email && touched.email && !verifyingEmail && (
                        <div className="error-icon"><i className="bi bi-exclamation-circle"></i></div>
                      )}
                    </div>
                    {verifyingEmail && <div className="verifying-message">Checking email...</div>}
                    {errors.email && touched.email && !verifyingEmail && (
                      <div className="error-message animate-error">{errors.email}</div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className={`reset-continue-btn ${loading ? 'loading' : ''}`}
                    disabled={loading  || errors.email}
                  >
                    {loading ? "Sending Code..." : "Continue"}
                    {!loading && <i className="bi bi-arrow-right"></i>}
                  </button>
                </div>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyCode} className="reset-password-form" noValidate>
                <div className={`form-step ${step === 2 ? 'active' : ''}`}>
                  <div className="form-group">
                    <label htmlFor="verificationCode" className="form-label">Verification Code</label>
                    <div className={`input-container ${errors.code && touched.code ? 'error' : ''}`}>
                      <input
                        type="text"
                        id="verificationCode"
                        value={code}
                        onChange={(e) => {
                          setCode(e.target.value);
                          if (errors.code) clearError('code');
                        }}
                        onBlur={() => handleBlur('code')}
                        className="form-input verification-code-input"
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                        required
                        disabled={loading}
                      />
                      <i className="bi bi-shield-lock input-icon"></i>
                      {errors.code && touched.code && <div className="error-icon"><i className="bi bi-exclamation-circle"></i></div>}
                    </div>
                    {errors.code && touched.code && <div className="error-message animate-error">{errors.code}</div>}
                  </div>

                  <div className="reset-password-buttons">
                    <button
                      type="submit"
                      className={`reset-verify-btn ${loading ? 'loading' : ''}`}
                      disabled={loading}
                    >
                      {loading ? "Verifying..." : "Confirm"}
                      {!loading && <i className="bi bi-check-circle"></i>}
                    </button>

                    <button
                      type="button"
                      className={`reset-resend-btn ${!canResend || resendLoading ? 'disabled' : ''}`}
                      onClick={handleResendCode}
                      disabled={!canResend || resendLoading}
                    >
                      {resendLoading ? (
                        "Sending..."
                      ) : (
                        `Resend Code ${!canResend ? `(${countdown}s)` : ''}`
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleResetPassword} className="reset-password-form" noValidate>
                <div className={`form-step ${step === 3 ? 'active' : ''}`}>
                  <div className="form-group">
                    <label htmlFor="newPassword" className="form-label">New Password</label>
                    <div className={`input-container ${errors.newPassword && touched.newPassword ? 'error' : ''}`}>
                      <input
                        type={showNewPassword ? "text" : "password"}
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                          if (errors.newPassword) clearError('newPassword');
                        }}
                        onBlur={() => handleBlur('newPassword')}
                        className="form-input"
                        placeholder="Enter new password"
                        required
                        disabled={loading}
                      />
                      <i className="bi bi-lock input-icon"></i>
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        disabled={loading}
                      >
                        <i className={`bi ${showNewPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                      {errors.newPassword && touched.newPassword && <div className="error-icon"><i className="bi bi-exclamation-circle"></i></div>}
                    </div>
                    {errors.newPassword && touched.newPassword && <div className="error-message animate-error">{errors.newPassword}</div>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <div className={`input-container ${errors.confirmPassword && touched.confirmPassword ? 'error' : ''}`}>
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          if (errors.confirmPassword) clearError('confirmPassword');
                        }}
                        onBlur={() => handleBlur('confirmPassword')}
                        className="form-input"
                        placeholder="Confirm new password"
                        required
                        disabled={loading}
                      />
                      <i className="bi bi-lock input-icon"></i>
                      <button
                        type="button"
                        className="password-toggle"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={loading}
                      >
                        <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                      </button>
                      {errors.confirmPassword && touched.confirmPassword && <div className="error-icon"><i className="bi bi-exclamation-circle"></i></div>}
                    </div>
                    {errors.confirmPassword && touched.confirmPassword && <div className="error-message animate-error">{errors.confirmPassword}</div>}
                  </div>

                  <button
                    type="submit"
                    className={`reset-password-btn ${loading ? 'loading' : ''}`}
                    disabled={loading}
                  >
                    {loading ? "Updating..." : "Reset Password"}
                    {!loading && <i className="bi bi-arrow-right"></i>}
                  </button>
                </div>
              </form>
            )}

            {message && (
              <div className={`message-container message-${getMessageType()} ${getMessageType() === 'error' ? 'backend-error' : ''}`}>
                {getMessageType() === 'success' && (
                  <span className="success-checkmark">✅</span>
                )}
                {getMessageType() === 'error' && (
                  <span className="error-icon">⚠️</span>
                )}
                {message}
              </div>
            )}

            <div className="reset-password-links">
              <a href="/login" className="reset-password-link">
                Back to Login
              </a>
            </div>
          </div>
        </div>

        <div className="reset-password-image-section">
          <div className="reset-password-image" style={{ backgroundImage: `url(${car6})` }}>
            <div className="image-overlay">
              <h1 className="brand-title">DRAGON SOUL</h1>
              <p className="brand-tagline">Secure Your Account</p>
              <p className="brand-tagline" style={{ marginTop: '20px', fontSize: '1rem' }}>
                Password Recovery
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;