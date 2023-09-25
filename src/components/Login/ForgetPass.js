import React, { useState } from 'react';
import './forget.css';
const ForgetPass = () => {
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Ở đây bạn có thể thực hiện xác thực email và gửi mã xác thực
    // Sau đó, đặt verificationSent thành true để hiển thị trường nhập mã xác thực
    setVerificationSent(true);
  };

  const handleVerificationSubmit = (e) => {
    e.preventDefault();
    // Ở đây bạn có thể kiểm tra mã xác thực
    // Nếu hợp lệ, thực hiện các hành động cần thiết
  };

  return (
    <div className="container-forget">
      {verificationSent ? (
        <form onSubmit={handleVerificationSubmit}>
          <div>
            <label>Check Your Email</label>
            <p>We're sent you a code to verify your email address</p>
            <input
              type="text"
              placeholder="Enter verification code"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
            />
          </div>
          <button type="submit">Submit</button>
        </form>
      ) : (
        <form onSubmit={handleEmailSubmit}>
          <div>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button type="submit">Send Verification Code</button>
        </form>
      )}
    </div>
  );
};

export default ForgetPass;
