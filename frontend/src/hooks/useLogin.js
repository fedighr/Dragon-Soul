import { useState } from "react";
import { loginUser } from "../services/Login";
import { useNavigate } from "react-router-dom";

export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    if (!email) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email format is invalid";

    if (!password) newErrors.password = "Password is required";
    else if (password.length < 6) newErrors.password = "Password must be at least 6 characters";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    setMessage("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const data = await loginUser(email, password);

      if (data.access && data.refresh) {
        setMessage("Welcome back, Dragon Master! 🐉");

        setTimeout(() => {
          console.log("Timeout finished!");
          navigate("/");
        }, 1000);

      } else {
        setMessage(data.detail || "Login failed. Please try again.");
      }
    } catch (err) {
      console.log(err);
      if (err.code === "token_not_valid" || err.detail?.includes("No active account")) {
        setMessage("Invalid email or password. Please try again.");
      } else if (err.error) {
        setMessage(err.error);
      } else {
        setMessage("Network or server error. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
};
