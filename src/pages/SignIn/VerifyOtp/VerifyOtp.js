import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import authApi from '../../../api/authApi';
import './index.css';

export default function VerifyOtp() {
  const [code, setCode] = useState('');
  const navigate = useNavigate();

  const handleSubmit = () => {
    const data = {
      otp: code,
      email: localStorage.getItem('emailSignUp'),
    };
    authApi
      .verifyOTP(data)
      .then((response) => {
        console.log(response);
        if (response.code === 0) {
          localStorage.clear('emailSignUp');
          return navigate('/signin');
        }
      })
      .catch((error) => {
        if (error.response.data.code === 1200 || error.response.data.code === 1300) {
          return window.alert(`OTP error: ${error.response.data.message}`);
        } else {
          return window.alert('OTP System Error');
        }
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
      .resendOTP(localStorage.getItem('emailSignUp'))
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
  return (
    <div className="enter-code-container">
      <h2>Enter Code</h2>
      <div>
        <input type="text" placeholder="Enter your code" value={code} onChange={(e) => setCode(e.target.value)} />{' '}
        <br />
        <button onClick={handleSubmit}>Submit</button>
        <button onClick={handleResendOTP} disabled={isButtonDisabled}>
          Resend OTP ({resendOTPTimer})
        </button>
        <button onClick={() => navigate('/signin')}>Back to Sign in</button>
      </div>
    </div>
  );
}
