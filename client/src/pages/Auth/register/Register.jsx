import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  useTheme,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { FcGoogle } from 'react-icons/fc';
import { registerUser } from '../../../services/authService';
import { useAuth } from '../../../context/AuthContext';
import { useTheme as useAppTheme } from '../../../context/ThemeContext';
import { showSuccess, showError } from '../../../utils/toast';
import { handleApiError } from '../../../utils/errorHandler';
import welcomeImage from '../../../assets/welcomeImage.png';
import welcomeImageDark from '../../../assets/welcomeImageDark.png';

function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const { mode } = useAppTheme();
  const image = mode === 'dark' ? welcomeImageDark : welcomeImage;

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

    if (newUser.password !== confirmPassword) {
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
      handleApiError(error, 'Registration failed.');
    }
  };

  return (
    <Container
      maxWidth="lg"
      sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}
    >
      <Box
        flex={1}
        sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <img
          src={image}
          alt="Welcome to our website!"
          style={{ width: '75%', height: '75%', objectFit: 'cover' }}
        />
      </Box>

      <Container
        maxWidth="sm"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Link to="/" style={{ textDecoration: 'none' }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 700,
              mt: 2,
              mb: 1,
              color: theme.palette.text.primary,
            }}
          >
            .MACHINERY MARKET
          </Typography>
        </Link>

        <Box
          component="form"
          onSubmit={handleRegisterSubmit}
          sx={{ mt: 1, width: '100%', px: 4 }}
        >
          <Typography variant="h6" gutterBottom>
            Welcome to our website!
          </Typography>
          <Typography
            variant="body2"
            gutterBottom
            sx={{ lineHeight: 1.6, mb: 2 }}
          >
            Please enter your details
          </Typography>

          <Grid container spacing={1}>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required variant="outlined">
                <InputLabel htmlFor="username">Username</InputLabel>
                <OutlinedInput id="username" name="username" label="Username" />
              </FormControl>
            </Grid>

            <Grid item size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required variant="outlined">
                <InputLabel htmlFor="phone">Phone Number</InputLabel>
                <OutlinedInput
                  id="phone"
                  name="phone"
                  type="tel"
                  label="Phone Number"
                />
              </FormControl>
            </Grid>
          </Grid>

          <FormControl fullWidth required variant="outlined" sx={{ my: 2 }}>
            <InputLabel htmlFor="email">Email</InputLabel>
            <OutlinedInput
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              label="Email"
            />
          </FormControl>

          <Grid container spacing={1}>
            <Grid item size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required variant="outlined">
                <InputLabel htmlFor="password">Password</InputLabel>
                <OutlinedInput
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  label="Password"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        aria-label={
                          showPassword ? 'Hide password' : 'Show password'
                        }
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>

            <Grid item size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth required variant="outlined">
                <InputLabel htmlFor="confirmPassword">
                  Confirm Password
                </InputLabel>
                <OutlinedInput
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  label="Confirm Password"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        edge="end"
                        aria-label={
                          showConfirmPassword
                            ? 'Hide confirm password'
                            : 'Show confirm password'
                        }
                      >
                        {showConfirmPassword ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
                      </IconButton>
                    </InputAdornment>
                  }
                />
              </FormControl>
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, borderRadius: '999px', fontWeight: 'bold' }}
          >
            Sign Up
          </Button>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<FcGoogle />}
            sx={{ mb: 3, borderRadius: '999px' }}
            onClick={() => showError('Google registration coming soon!')}
          >
            Sign Up with Google
          </Button>

          <Typography variant="body2" align="center">
            Already have an account?{' '}
            <Link
              to="/login"
              style={{
                fontWeight: '500',
                fontSize: '0.9rem',
                color: theme.palette.primary.main,
                textDecoration: 'none',
              }}
            >
              Login
            </Link>
          </Typography>
        </Box>
      </Container>
    </Container>
  );
}

export default Register;
