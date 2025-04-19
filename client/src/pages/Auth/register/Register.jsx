import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { loginUser } from '../../../services/authService';
import { useAuth } from '../../../context/AuthContext';
import { showSuccess, showInfo } from '../../../utils/toast';
import { handleApiError } from '../../../utils/errorHandler';
import Image from '../../../assets/machineryImage.png';
import styles from './register.module.css';

function Register() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={styles.registerMain}>
      <div className={styles.registerLeft}>
        <img src={Image} alt="Machinery Illustration" />
      </div>
      <div className={styles.registerRight}>
        <div className={styles.registerRightContainer}>
          <div className={styles.registerLogo}>
            <h4>.MACHINERY MARKET</h4>
          </div>
          <div className={styles.registerCenter}>
            <h2>Welcome to our website!</h2>
            <p>Please enter your details</p>
            <form action="">
              {/* <div className={styles.nameDiv}>
                <input
                  type="text"
                  placeholder="First Name"
                  name="firstName"
                  required={true}
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  name="lastName"
                  required={true}
                />
              </div> */}

              <div className={styles.inputGroup}>
                <input
                  className={styles.formInput}
                  type="text"
                  placeholder="Username"
                  name="username"
                  required
                />
                <input
                  className={styles.formInput}
                  type="tel"
                  placeholder="Phone Number"
                  name="phone"
                  required
                />
              </div>

              <input
                className={styles.formInput}
                type="email"
                placeholder="Email"
                name="Email"
                required
              />

              <div className={styles.inputGroup}>
                <div className={styles.passwordInputDiv}>
                  <input
                    className={styles.formInput}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Password"
                    name="password"
                    required
                  />

                  {showPassword ? (
                    <FaEyeSlash
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                    />
                  ) : (
                    <FaEye
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                    />
                  )}
                </div>

                <div className={styles.passwordInputDiv}>
                  <input
                    className={styles.formInput}
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    required
                  />

                  {showPassword ? (
                    <FaEyeSlash
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                    />
                  ) : (
                    <FaEye
                      onClick={() => {
                        setShowPassword(!showPassword);
                      }}
                    />
                  )}
                </div>
              </div>

              <div className={styles.registerCenterButtons}>
                <button type="submit">Sign Up</button>
                <button type="button">
                  <FcGoogle />
                  Sign Up with Google
                </button>
              </div>
            </form>
          </div>

          <p className={styles.registerBottomP}>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
