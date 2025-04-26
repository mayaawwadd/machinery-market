import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { registerUser } from '../../../services/authService';
import { useAuth } from '../../../context/AuthContext';
import { showSuccess, showError } from '../../../utils/toast';
import { handleApiError } from '../../../utils/errorHandler';
import Image from '../../../assets/machineryImage.png';
import styles from './register.module.css';

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;

    const newUser = {
      username: form.username.value,
      email: form.email.value,
      password: form.password.value,
      phone: form.phone.value,
    };

    const confirmPassword = form.confirmPassword.value;

    if (newUser.password != confirmPassword) {
      showError('Passwords do not match');
      return;
    }

    try {
      const data = await registerUser(newUser);
      login(
        {
          _id: data._id,
          username: data.username,
          email: data.email,
          role: data.role,
          profileImage: data.profileImage,
        },
        data.token,
        true
      );

      showSuccess('Registration successful!');
      navigate('/profile');
    } catch (error) {
      console.log(error);
      handleApiError(error, 'Registration failed.');
    }
  };

  return (
    <div className={styles.container}>
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
            <form onSubmit={handleRegisterSubmit}>
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
                name="email"
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
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm Password"
                    name="confirmPassword"
                    required
                  />

                  {showConfirmPassword ? (
                    <FaEyeSlash
                      onClick={() => {
                        setShowConfirmPassword(!showConfirmPassword);
                      }}
                    />
                  ) : (
                    <FaEye
                      onClick={() => {
                        setShowConfirmPassword(!showConfirmPassword);
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
