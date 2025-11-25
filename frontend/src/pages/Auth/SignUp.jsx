import React from "react";
import { useSignUp } from "../../hooks/useSignUp";
import { ButtonLoadingSpinner } from "../../components/common/loader/LoadingSpinner";
import "./SignUp.css";
import car5 from "../../assets/images/car5.jpg";

const SignUp = () => {
  const {
    formData,
    errors,
    touched,
    message,
    showPassword,
    showConfirmPassword,
    verifyingEmail,
    verifyingPhone,
    isSubmitting,
    showSuccessLoader,
    countryCode,
    countryCodes,
    showCountryList,
    setShowCountryList,
    handleCountrySelect,
    getSelectedCountry,
    countryListRef,
    firstNameRef,
    lastNameRef,
    emailRef,
    phoneRef,
    passwordRef,
    confirmPasswordRef,
    genderRef,
    setShowPassword,
    setShowConfirmPassword,
    handleChange,
    handleBlur,
    clearError,
    handleSubmit,
  } = useSignUp();

  const selectedCountry = getSelectedCountry();

  return (
    <div className="signup-page">
      {showSuccessLoader && (
        <div className="success-loader-overlay">
          <div className="success-loader-content">
            <div className="success-dragon-loader">🐉</div>
            <h2 className="success-loader-text">Welcome to Dragon Soul!</h2>
            <p className="success-loader-subtext">
              Your account has been created successfully
            </p>
            <ButtonLoadingSpinner text="Redirecting to login..." />
            <p className="success-redirect-text">
              You will be redirected to the login page shortly
            </p>
          </div>
        </div>
      )}

      <div className="signup-container">
        <div className="signup-form-section">
          <div className="signup-form-container">
            <div className="signup-header">
              <h1 className="signup-title">Join Us</h1>
              <p className="signup-subtitle">Create your Dragon Soul account</p>
            </div>

            <form onSubmit={handleSubmit} className="signup-form" noValidate>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="firstName" className="form-label">First Name</label>
                  <div className={`input-container ${errors.firstName && touched.firstName ? 'error' : ''}`}>
                    <input
                      ref={firstNameRef}
                      type="text"
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleChange('firstName', e.target.value)}
                      onBlur={() => handleBlur('firstName')}
                      className="form-input"
                      placeholder="Enter your first name"
                      required
                    />
                    <i className="bi bi-person input-icon"></i>
                    {errors.firstName && touched.firstName && <div className="error-icon"><i className="bi bi-exclamation-circle"></i></div>}
                  </div>
                  {errors.firstName && touched.firstName && <div className="error-message animate-error">{errors.firstName}</div>}
                </div>

                <div className="form-group">
                  <label htmlFor="lastName" className="form-label">Last Name</label>
                  <div className={`input-container ${errors.lastName && touched.lastName ? 'error' : ''}`}>
                    <input
                      ref={lastNameRef}
                      type="text"
                      id="lastName"
                      value={formData.lastName}
                      onChange={(e) => handleChange('lastName', e.target.value)}
                      onBlur={() => handleBlur('lastName')}
                      className="form-input"
                      placeholder="Enter your last name"
                      required
                    />
                    <i className="bi bi-person input-icon"></i>
                    {errors.lastName && touched.lastName && <div className="error-icon"><i className="bi bi-exclamation-circle"></i></div>}
                  </div>
                  {errors.lastName && touched.lastName && <div className="error-message animate-error">{errors.lastName}</div>}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="email" className="form-label">Email Address</label>
                <div className={`input-container ${errors.email && touched.email ? 'error' : ''} ${verifyingEmail ? 'verifying' : ''}`}>
                  <input
                    ref={emailRef}
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    className="form-input"
                    placeholder="Enter your email"
                    required
                    disabled={verifyingEmail}
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
                {verifyingEmail && <div className="verifying-message">Verifying email...</div>}
                {errors.email && touched.email && !verifyingEmail && <div className="error-message animate-error">{errors.email}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="phone" className="form-label">Phone Number</label>
                <div className={`phone-input-container ${errors.phone && touched.phone ? 'error' : ''} ${verifyingPhone ? 'verifying' : ''}`} ref={countryListRef}>
                  <input
                    ref={phoneRef}
                    type="tel"
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    onBlur={() => handleBlur('phone')}
                    className="form-input"
                    placeholder="Enter your phone number"
                    required
                    disabled={verifyingPhone}
                  />
                  <i className="bi bi-phone input-icon"></i>

                  {/* Country Code Dropdown */}
                  <button
                    type="button"
                    className={`country-code-dropdown ${showCountryList ? 'open' : ''}`}
                    onClick={() => setShowCountryList(!showCountryList)}
                  >
                    <div className="country-code-display">
                      <span className="country-flag">{selectedCountry.flag}</span>
                      <span className="country-code-text">{selectedCountry.code}</span>
                      <i className="bi bi-chevron-down country-chevron"></i>
                    </div>
                  </button>

                  {showCountryList && (
                    <div className="country-code-list">
                      {countryCodes.map((country) => (
                        <div
                          key={country.code}
                          className={`country-code-option ${country.code === countryCode ? 'selected' : ''}`}
                          onClick={() => handleCountrySelect(country)}
                        >
                          <span className="country-option-flag">{country.flag}</span>
                          <span className="country-option-name">{country.name}</span>
                          <span className="country-option-code">{country.code}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {verifyingPhone && (
                    <div className="verifying-spinner">
                      <div className="spinner"></div>
                    </div>
                  )}
                  {errors.phone && touched.phone && !verifyingPhone && (
                    <div className="error-icon"><i className="bi bi-exclamation-circle"></i></div>
                  )}
                </div>
                {verifyingPhone && <div className="verifying-message">Verifying phone number...</div>}
                {errors.phone && touched.phone && !verifyingPhone && <div className="error-message animate-error">{errors.phone}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="gender" className="form-label">Gender</label>
                <div className={`input-container ${errors.gender && touched.gender ? 'error' : ''}`}>
                  <select
                    ref={genderRef}
                    id="gender"
                    value={formData.gender}
                    onChange={(e) => handleChange('gender', e.target.value)}
                    onBlur={() => handleBlur('gender')}
                    className="gender-select"
                    required
                  >
                    <option value="">Select your gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                  <i className="bi bi-gender-ambiguous input-icon"></i>
                  <i className="bi bi-chevron-down select-icon"></i>
                  {errors.gender && touched.gender && <div className="error-icon"><i className="bi bi-exclamation-circle"></i></div>}
                </div>
                {errors.gender && touched.gender && <div className="error-message animate-error">{errors.gender}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password</label>
                <div className={`input-container ${errors.password && touched.password ? 'error' : ''}`}>
                  <input
                    ref={passwordRef}
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={formData.password}
                    onChange={(e) => handleChange('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                    className="form-input"
                    placeholder="Enter your password"
                    required
                  />
                  <i className="bi bi-lock input-icon"></i>
                  <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                    <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                  {errors.password && touched.password && <div className="error-icon"><i className="bi bi-exclamation-circle"></i></div>}
                </div>
                {errors.password && touched.password && <div className="error-message animate-error">{errors.password}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                <div className={`input-container ${errors.confirmPassword && touched.confirmPassword ? 'error' : ''}`}>
                  <input
                    ref={confirmPasswordRef}
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange('confirmPassword', e.target.value)}
                    onBlur={() => handleBlur('confirmPassword')}
                    className="form-input"
                    placeholder="Confirm your password"
                    required
                  />
                  <i className="bi bi-lock input-icon"></i>
                  <button type="button" className="password-toggle" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    <i className={`bi ${showConfirmPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                  </button>
                  {errors.confirmPassword && touched.confirmPassword && <div className="error-icon"><i className="bi bi-exclamation-circle"></i></div>}
                </div>
                {errors.confirmPassword && touched.confirmPassword && <div className="error-message animate-error">{errors.confirmPassword}</div>}
              </div>

              <button
                type="submit"
                className={`signup-btn ${isSubmitting ? 'loading' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <ButtonLoadingSpinner text="Creating Account..." />
                ) : (
                  <>
                    Create Account <i className="bi bi-arrow-right"></i>
                  </>
                )}
              </button>

              {message && (
                <div className={`signup-message ${message.includes('successfully') ? 'success' : 'error'}`}>
                  {message}
                </div>
              )}

              <div className="signup-links">
                <a href="/login" className="signup-link login-link">
                  Already have an account? <span>Sign in</span>
                </a>
              </div>
            </form>
          </div>
        </div>

        <div className="signup-image-section">
          <div className="signup-image" style={{ backgroundImage: `url(${car5})` }}>
            <div className="image-overlay">
              <h1 className="brand-title">DRAGON SOUL</h1>
              <p className="brand-tagline">Join Dragon Soul Family</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;