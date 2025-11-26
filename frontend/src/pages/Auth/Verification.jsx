import React from "react";
import { useVerification } from "../../hooks/useVerification";
import "./Verification.css";
import car2 from "../../assets/images/car2.jpg";

const Verification = () => {
  const {
    code,
    setCode,
    errors,
    touched,
    message,
    loading,
    resendLoading,
    canResend,
    countdown,
    handleBlur,
    clearError,
    handleVerify,
    handleResendEmail,
  } = useVerification();

  return (
    <div className="email-verification-page">
      <div className="email-verification-container">
        <div className="email-verification-form-section">
          <div className="email-verification-form-container">
            <div className="email-verification-header">
              <h1 className="email-verification-title">Verify Your Email</h1>
              <p className="email-verification-subtitle">
                Enter the verification code sent to your email
              </p>
            </div>

            <form onSubmit={handleVerify} className="email-verification-form" noValidate>
              <div className="email-verification-group">
                <label htmlFor="emailVerificationCode" className="email-verification-label">
                  Verification Code
                </label>
                <div className={`email-verification-input-container ${errors.code && touched.code ? 'email-verification-error' : ''}`}>
                  <input
                    type="text"
                    id="emailVerificationCode"
                    value={code}
                    onChange={(e) => {
                      setCode(e.target.value);
                      if (errors.code) clearError('code');
                    }}
                    onBlur={() => handleBlur('code')}
                    className="email-verification-input"
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    required
                    disabled={loading}
                  />
                  <i className="bi bi-shield-lock email-verification-input-icon"></i>
                  {errors.code && touched.code && (
                    <div className="email-verification-error-icon">
                      <i className="bi bi-exclamation-circle"></i>
                    </div>
                  )}
                </div>
                {errors.code && touched.code && (
                  <div className="email-verification-error-message email-verification-animate-error">{errors.code}</div>
                )}
              </div>

              <div className="email-verification-buttons">
                <button
                  type="submit"
                  className={`email-verify-btn ${loading ? 'email-verification-loading' : ''}`}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <div className="email-verification-button-spinner"></div>
                      Verifying...
                    </>
                  ) : (
                    <>
                      Verify Email <i className="bi bi-check-circle"></i>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  className={`email-resend-btn ${!canResend || resendLoading ? 'email-resend-disabled' : ''}`}
                  onClick={handleResendEmail}
                  disabled={!canResend || resendLoading}
                >
                  {resendLoading ? (
                    <>
                      <div className="email-verification-button-spinner"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      Resend Email {!canResend && `(${countdown}s)`}
                    </>
                  )}
                </button>
              </div>

              {/* Message Display */}
              {message && (
                <div className={`email-verification-message-container ${
                  message.includes('successfully') ? 'email-verification-message-success' : 
                  message.includes('Invalid') ? 'email-verification-message-error' : 'email-verification-message-info'
                }`}>
                  {message.includes('successfully') && (
                    <span className="email-verification-success-checkmark">✅</span>
                  )}
                  {message.includes('Invalid') && (
                    <span className="email-verification-error-icon">⚠️</span>
                  )}
                  {message}
                </div>
              )}

              <div className="email-verification-links">
                <p className="email-verification-help">
                  Didn't receive the code? Check your spam folder or try resending.
                </p>
                <a href="/login" className="email-verification-link">
                  Back to Login
                </a>
              </div>
            </form>
          </div>
        </div>

        <div className="email-verification-image-section">
          <div className="email-verification-image" style={{ backgroundImage: `url(${car2})` }}>
            <div className="email-verification-image-overlay">
              <h1 className="email-verification-brand-title">DRAGON SOUL</h1>
              <p className="email-verification-brand-tagline">Secure Your Journey</p>
              <p className="email-verification-brand-subtitle">
                Verification in Progress
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Verification;