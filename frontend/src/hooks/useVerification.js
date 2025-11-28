import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {VerifyAuthCode, ResendAuthCode} from "../services/verification.js"

export const useVerification = () => {
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);

  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || "";

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

  const validateForm = () => {
    const newErrors = {};

    if (!code) {
      newErrors.code = "Verification code is required";
    } else if (code.length !== 6) {
      newErrors.code = "Code must be 6 digits";
    } else if (!/^\d+$/.test(code)) {
      newErrors.code = "Code must contain only numbers";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateForm();
  };

  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const startResendCooldown = () => {
    setCanResend(false);
    setCountdown(30);
  };


  const handleVerify = async (e) => {
    e.preventDefault();
    setTouched({ code: true });
    setMessage("");

    if (!validateForm()) return;

    setLoading(true);
    let data;
    try {
      data = await VerifyAuthCode(email,code);
      setMessage(data.message || "Email verified successfully!");
      console.log(data.success);

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      const status = error.response?.status;
      if (status === 408) {
        setMessage(error.response?.data?.error || "Your verification code has expired. We will send you a new one shortly.");
      } else if (status) {
        setMessage(error.response?.data?.error || "Invalid verification code. Please try again.");
      } else {
        console.log("Error object:", error);
        setMessage(error.message || "Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setResendLoading(true);
    setMessage("");

    try {
      const data = await ResendAuthCode(email);
      setMessage(data.message || "Verification email sent!");
      startResendCooldown();
    } catch (err) {
      setMessage(err.error || "Failed to resend email. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return {
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
  };
};