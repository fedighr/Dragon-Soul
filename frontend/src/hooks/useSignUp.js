// hooks/useSignUp.js
import { useState, useRef, useEffect } from 'react';
import { EmailVerify, PhoneNumberVerify, RegisterUser } from '../services/SignUp.js'
import { useNavigate } from "react-router-dom";

export const useSignUp = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: ''
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [message, setMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verifyingEmail, setVerifyingEmail] = useState(false);
  const [verifyingPhone, setVerifyingPhone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessLoader, setShowSuccessLoader] = useState(false);
  const [countryCode, setCountryCode] = useState('+216');
  const [showCountryList, setShowCountryList] = useState(false);
  const navigate = useNavigate();

  // Refs for focusing on errors
  const firstNameRef = useRef(null);
  const lastNameRef = useRef(null);
  const emailRef = useRef(null);
  const phoneRef = useRef(null);
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const genderRef = useRef(null);
  const countryListRef = useRef(null);

  const countryCodes = [
    { code: '+213', name: 'Algeria', flag: '🇩🇿' },
    { code: '+216', name: 'Tunisia', flag: '🇹🇳' },
    { code: '+33', name: 'France', flag: '🇫🇷' }
  ];

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryListRef.current && !countryListRef.current.contains(event.target)) {
        setShowCountryList(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCountrySelect = (country) => {
    setCountryCode(country.code);
    setShowCountryList(false);
  };

  const getSelectedCountry = () => {
    return countryCodes.find(country => country.code === countryCode) || countryCodes[1]; // Default to Tunisia
  };

  const validateField = async (name, value) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'firstName':
        if (!value.trim()) {
          newErrors.firstName = 'First name is required';
        } else if (value.trim().length < 2) {
          newErrors.firstName = 'First name must be at least 2 characters';
        } else {
          delete newErrors.firstName;
        }
        break;

      case 'lastName':
        if (!value.trim()) {
          newErrors.lastName = 'Last name is required';
        } else if (value.trim().length < 2) {
          newErrors.lastName = 'Last name must be at least 2 characters';
        } else {
          delete newErrors.lastName;
        }
        break;

      case 'email': {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) {
          newErrors.email = 'Email is required';
        } else if (!emailRegex.test(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
          setVerifyingEmail(true);
          try {
            const data = await EmailVerify(value);
            if (data.message === "email is used") {
              newErrors.email = "Email is already used";
            } else if (data.message === "email not found") {
              delete newErrors.email;
            }
          } catch (err) {
            console.error(err);
            newErrors.email = "Email is already used";
          } finally {
            setVerifyingEmail(false);
          }
        }
        break;
      }

      case 'phone': {
        const fullPhoneNumber = countryCode + value;
        const phoneRegex = /^[+]?[1-9]\d{0,15}$/;
        if (!value) {
          newErrors.phone = 'Phone number is required';
        } else if (!phoneRegex.test(fullPhoneNumber.replace(/[\s\-()]/g, ''))) {
          newErrors.phone = 'Please enter a valid phone number';
        } else {
          delete newErrors.phone;
          setVerifyingPhone(true);
          try {
            const data = await PhoneNumberVerify(fullPhoneNumber);
            if (data.message === "phone is used") {
              newErrors.phone = "Phone number is already used";
            } else if (data.message === "phone not found") {
              delete newErrors.phone;
            }
          } catch (err) {
            console.error(err);
            newErrors.phone = "Phone number is already used";
          } finally {
            setVerifyingPhone(false);
          }
        }
        break;
      }

      case 'password':
        if (!value) {
          newErrors.password = 'Password is required';
        } else if (value.length < 6) {
          newErrors.password = 'Password must be at least 6 characters';
        } else {
          delete newErrors.password;
          if (formData.confirmPassword && value !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
          } else if (formData.confirmPassword) {
            delete newErrors.confirmPassword;
          }
        }
        break;

      case 'confirmPassword':
        if (!value) {
          newErrors.confirmPassword = 'Please confirm your password';
        } else if (value !== formData.password) {
          newErrors.confirmPassword = 'Passwords do not match';
        } else {
          delete newErrors.confirmPassword;
        }
        break;

      case 'gender':
        if (!value) {
          newErrors.gender = 'Please select your gender';
        } else {
          delete newErrors.gender;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      const newErrors = { ...errors };
      delete newErrors[name];
      setErrors(newErrors);
    }
  };

  const handleBlur = (name) => {
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));
    validateField(name, formData[name]);
  };

  const clearError = (name) => {
    const newErrors = { ...errors };
    delete newErrors[name];
    setErrors(newErrors);
  };

  const focusFirstError = () => {
    const errorFields = [
      { field: 'firstName', ref: firstNameRef },
      { field: 'lastName', ref: lastNameRef },
      { field: 'email', ref: emailRef },
      { field: 'phone', ref: phoneRef },
      { field: 'password', ref: passwordRef },
      { field: 'confirmPassword', ref: confirmPasswordRef },
      { field: 'gender', ref: genderRef }
    ];

    for (const { field, ref } of errorFields) {
      if (errors[field] && ref.current) {
        ref.current.focus();
        ref.current.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
        break;
      }
    }
  };

  const validateForm = () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'password', 'confirmPassword', 'gender'];
    const newTouched = {};
    let hasErrors = false;

    requiredFields.forEach(field => {
      newTouched[field] = true;
      if (!formData[field]) {
        setErrors(prev => ({
          ...prev,
          [field]: `${field === 'gender' ? 'Please select your gender' : `${field.charAt(0).toUpperCase() + field.slice(1)} is required`}`
        }));
        hasErrors = true;
      }
    });

    setTouched(newTouched);

    if (Object.keys(errors).length > 0) {
      hasErrors = true;
    }

    if (hasErrors) {
      focusFirstError();
    }

    return !hasErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setMessage('Please fix the errors above');
      return;
    }

    setIsSubmitting(true);
    setMessage('Creating your account...');

    try {
      const userData = {
        ...formData,
        phone: countryCode + formData.phone
      };

      const response = await RegisterUser(userData);
      console.log(response.data);

      setShowSuccessLoader(true);
      setMessage('');

      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (error) {
      console.error(error);
      setMessage('Signup failed. Please try again.');
      setIsSubmitting(false);
    }
  };

  return {
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
    handleSubmit
  };
};