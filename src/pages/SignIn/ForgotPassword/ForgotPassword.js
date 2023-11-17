import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import authApi from '../../../api/authApi';
import './index.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOTP] = useState('');
  const [password, setPassword] = useState('');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formState, setFormState] = useState('email');

  const emailRegex = /^[a-zA-Z0-9]+[@]([a-z]+[.]){1,2}[a-z]+$/;
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    const sendEmail = {
      email,
    };
    if (!emailRegex.test(email)) {
      return window.alert('Error: Email invalidate!');
    }
    authApi
      .sendOTPForgotPassword(sendEmail)
      .then((response) => {
        if (response.code === 0) {
          setFormState('otp');
          window.alert('We are sent you a code to verify your email address');
        } else {
          return window.alert(`Error: ${response.message}`);
        }
      })
      .catch((error) => {
        return window.alert('Error: System Error');
      });
  };

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    const otpData = {
      otp,
      email,
      password,
    };
    if (!passwordRegex.test(password)) {
      return window.alert('Password must be at least 8 characters and uppercase, lowercase letter, number');
    }
    authApi
      .verifyOTPForgotPassword(otpData)
      .then((response) => {
        console.log(response);
        if (response.code === 0) {
          navigate('/signin');
          return window.alert('Forgot Password Successfully');
        }
      })
      .catch((error) => {
        return window.alert(`Error: ${error.response.data.message}`);
      });
  };

  const [resendOTPTimer, setResendOTPTimer] = useState(120);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      if (resendOTPTimer === 0) {
        clearInterval(interval);
        setIsButtonDisabled(false);
        return;
      }
      setResendOTPTimer(resendOTPTimer - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [resendOTPTimer]);

  const handleResendOTP = () => {
    authApi
      .resendOTP(searchParams.get('email'))
      .then((response) => {
        console.log(response);
        if (response.code === 0) {
          return window.alert('A new OTP has been sent to your email.');
        }
      })
      .catch((error) => {
        return window.alert('OTP System error');
      });
    setResendOTPTimer(120);
    setIsButtonDisabled(true);
  };

  const renderForm = () => {
    switch (formState) {
      case 'email':
        return (
          <form>
            <div>
              <label>Enter Your Email</label> <br />
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <button onClick={handleEmailSubmit}>Send Verification Code</button>
          </form>
        );
      case 'otp':
        return (
          <form>
            <div>
              <label>Enter OTP</label>
              <input
                type="text"
                placeholder="Enter verification code"
                value={otp}
                onChange={(e) => setOTP(e.target.value)}
              />
            </div>
            <div>
              <label>New Password</label>
              <input
                type="password"
                placeholder="Enter your new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button onClick={handleOTPSubmit}>Submit</button>
            <button onClick={handleResendOTP} disabled={isButtonDisabled}>
              Resend OTP ({resendOTPTimer})
            </button>
            <button onClick={() => navigate('/signin')}>Back to Login</button>
          </form>
        );
      default:
        return null;
    }
  };

  return <div className="container-forget">{renderForm()}</div>;
}
