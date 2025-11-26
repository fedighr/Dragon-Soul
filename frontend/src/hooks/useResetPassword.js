import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SendResetEmail, VerifyResetCode, ResendResetCode, SaveResetPassword, ResetEmailVerify } from '../services/ResetPassword.js'

export const useResetPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [canResend, setCanResend] = useState(true);
  const [countdown, setCountdown] = useState(0);
  const [verifyingEmail, setVerifyingEmail] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    let timer;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
    return () => clearTimeout(timer);
  }, [countdown, canResend]);

const checkEmailExists = async (email) => {
  setVerifyingEmail(true);
  try {
    const response = await ResetEmailVerify(email);
    if (response.success){
        return true;
    }
  } catch (error) {
    if (error.response && error.response.status === 400) {
      setErrors(prev => ({ ...prev, email: "This email is not registered in our system" }));
      return false;
    } else {
      console.error("Email verification failed:", error);
      return false;
    }
  } finally {
    setVerifyingEmail(false);
  }
};

    const validateStep1 = async () => {
      const newErrors = {};

      if (!email) {
        newErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        newErrors.email = "Email format is invalid";
      } else {
        // Check email existence
        const exists = await checkEmailExists(email);
        if (!exists) {
          newErrors.email = "This email is not registered in our system";
        }
      }

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };


  const validateStep2 = () => {
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

  const validateStep3 = () => {
    const newErrors = {};
    if (!newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleBlur = async (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    if (field === 'email' && email && /\S+@\S+\.\S+/.test(email)) {
      await checkEmailExists(email);
    }

    if (step === 1 && field === 'email') await  validateStep1();
    else if (step === 2) validateStep2();
    else if (step === 3) validateStep3();
  };

  const clearError = (field) => {
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const startResendCooldown = () => {
    setCanResend(false);
    setCountdown(30); // 30 seconds cooldown
  };

  const handleSendCode = async (e) => {
    e.preventDefault();
    setTouched({ email: true });
    setMessage("");

    if (!validateStep1()) return;

    const emailExists = await checkEmailExists(email);
    if (!emailExists) {
      return;
    }

    setLoading(true);

    try {
      const response = await SendResetEmail(email);
      console.log(response.success);
      setMessage("Verification code sent to your email!");
      setStep(2);
      startResendCooldown();
    } catch (error) {
      if (error.response?.status === 404) {
        setMessage("This email is not registered in our system.");
      } else {
        setMessage(error.response?.data?.error || "Failed to send verification code. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setTouched({ code: true });
    setMessage("");

    if (!validateStep2()) return;

    setLoading(true);

    try {
      const response = await VerifyResetCode(email, code);
      console.log(response.success);
      setMessage("Code verified successfully!");
      setStep(3);
    } catch (error) {
      setMessage(error.response?.data?.error || "Invalid verification code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setTouched({ newPassword: true, confirmPassword: true });
    setMessage("");

    if (!validateStep3()) return;

    setLoading(true);

    try {
      const response = await SaveResetPassword(email, newPassword);
      setMessage(response.message ||"Password updated successfully!");

      setTimeout(() => {
        navigate("/login", {
          state: { message: "Password reset successfully! You can now login with your new password." }
        });
      }, 2000);
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    setMessage("");

    try {
      const response = await ResendResetCode(email);
      setMessage(response.data.message || "Verification code resent!");
      startResendCooldown();
    } catch (error) {
      setMessage(error.response?.data?.error || "Failed to resend code. Please try again.");
    } finally {
      setResendLoading(false);
    }
  };

  return {
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
  };
};