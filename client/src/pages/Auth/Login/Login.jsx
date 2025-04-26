import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { loginUser } from '../../../services/authService';
import { useAuth } from '../../../context/AuthContext';
import { showSuccess, showInfo } from '../../../utils/toast';
import { handleApiError } from '../../../utils/errorHandler';
import Image from '../../../assets/machineryImage.png';
import styles from '../Login/login.module.css';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const data = await loginUser(email, password);

      // Separate token and user data
      const { token, message, ...userWithoutToken } = data;

      login(userWithoutToken, token, rememberMe);
      showSuccess('Login successful!');

      navigate('/profile');
    } catch (error) {
      handleApiError(error, 'Login failed. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginLeft}>
        <img src={Image} alt="" />
      </div>
      <div className={styles.loginRight}>
        <div className={styles.loginRightContainer}>
          <div className={styles.loginLogo}>
            <h4>.MACHINERY MARKET</h4>
          </div>
          <div className={styles.loginCenter}>
            <h2>Welcome back!</h2>
            <p>Please enter your details</p>

            <form action="" onSubmit={handleLoginSubmit}>
              <input
                className={styles.formInput}
                type="email"
                placeholder="Email"
                name="email"
                required
              />
              <div className={styles.passwordInputDiv}>
                <input
                  className={styles.formInput}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  name="password"
                  required
                />

                {showPassword ? (
                  <FaEyeSlash onClick={() => setShowPassword(!showPassword)} />
                ) : (
                  <FaEye onClick={() => setShowPassword(!showPassword)} />
                )}
              </div>

              <div className={styles.loginCenterOptions}>
                <div className={styles.rememberDiv}>
                  <input
                    type="checkbox"
                    id="remember-checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember-checkbox">
                    Remember for 30 days
                  </label>
                </div>
                <a href="#" className={styles.forgotPasswordLink}>
                  Forgot Password?
                </a>
              </div>

              <div className={styles.loginCenterButtons}>
                <button type="submit">Log In</button>
                <button
                  type="button"
                  onClick={() => showInfo('Google login coming soon!')}
                >
                  <FcGoogle />
                  Log In with Google
                </button>
              </div>
            </form>
          </div>

          <p className={styles.loginBottomP}>
            Don't have an account? <Link to="/register">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
