// src/components/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import supabase from '../supabaseOperations/supabaseClient';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        const { user } = data;

        const { error: dbError } = await supabase
          .from('users')
          .upsert({
            id: user.id,
            email: user.email,
            updated_at: new Date().toISOString(),
          });

        if (dbError) throw dbError;

        navigate('/dashboard');
      } else {
        setError('Login failed: User data not found.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed');
    }
  };

  const handleForgotPassword = () => {
    navigate('/forgot-password');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="login-container">
      <div className="background-top-right">
        <img src="/images/top-right-bg.png" alt="Top Right Background" />
      </div>
      <div className="background-bottom-left">
        <img src="/images/bottom-left-bg.png" alt="Bottom Left Background" />
      </div>

      <div className="login-content">
        <div className="welcome-section">
          <h1>Welcome Back</h1>
          <p>Please login to continue to Creche Spots.</p>

          <div className="image-stack">
            <img src="/images/middle-image1.png" alt="Middle Image 1" className="image-top" />
            <img src="/images/middle-image2.png" alt="Middle Image 2" className="image-bottom" />
          </div>
        </div>

        <div className="login-form">
          <form onSubmit={handleSubmit}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <div className="checkbox-container">
              <label>
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                />
                I accept the <a href="https://crechespots.org.za/terms-and-conditions/" target="_blank">terms and conditions</a>
              </label>
            </div>
            <div className="checkbox-container">
              <label>
                <input
                  type="checkbox"
                  checked={acceptPrivacy}
                  onChange={(e) => setAcceptPrivacy(e.target.checked)}
                />
                I accept the <a href="https://crechespots.org.za/privacy-policy/" target="_blank">privacy policy</a>
              </label>
            </div>
            <button type="submit" disabled={!acceptTerms || !acceptPrivacy}>
              Login
            </button>
          </form>
          <button className="forgot-password-button" onClick={handleForgotPassword}>
            <i className="fas fa-key"></i> Forgot your password?
          </button>
          <button className="signup-button" onClick={handleSignup}>
            <i className="fas fa-user-plus"></i> Don't have an account?
          </button>
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;