import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  Container,
  InputLabel,
  FormControlLabel,
  IconButton,
  InputAdornment,
  FormControl,
  Typography,
  OutlinedInput,
  useTheme,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { FcGoogle } from 'react-icons/fc';
import { loginUser } from '../../../services/authService';
import { useAuth } from '../../../context/AuthContext';
import { useTheme as useAppTheme } from '../../../context/ThemeContext';
import { showSuccess, showInfo } from '../../../utils/toast';
import { handleApiError } from '../../../utils/errorHandler';
import welcomeImage from '../../../assets/welcomeImage.png';
import welcomeImageDark from '../../../assets/welcomeImageDark.png';

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();
  const theme = useTheme();
  const { mode } = useAppTheme();
  const image = mode === 'dark' ? welcomeImageDark : welcomeImage;

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
          alt="Welcome Back"
          style={{ width: '75%', height: '75%', objectFit: 'cover' }}
        />
      </Box>

      <Container
        maxWidth="sm"
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 700, mt: 2, mb: 1 }}>
          .MACHINERY MARKET
        </Typography>

        <Box
          component="form"
          onSubmit={handleLoginSubmit}
          sx={{ mt: 1, width: '100%', px: 4 }}
        >
          <Typography variant="h6" gutterBottom>
            Welcome back!
          </Typography>
          <Typography variant="body2" gutterBottom sx={{ lineHeight: 1.6 }}>
            Please enter your details
          </Typography>

          <FormControl fullWidth required variant="outlined" sx={{ my: 2 }}>
            <InputLabel htmlFor="email">Email</InputLabel>
            <OutlinedInput id="email" name="email" label="Email" />
          </FormControl>

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

          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mt: 1,
            }}
          >
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  color="primary"
                />
              }
              label="Remember for 30 days"
            />

            <Button
              variant="text"
              size="small"
              sx={{
                fontSize: '0.9rem',
                color: theme.palette.primary.main,
                textTransform: 'none',
              }}
              onClick={() => showInfo('Password reset coming soon!')}
            >
              Forgot Password?
            </Button>
          </Box>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, borderRadius: '999px', fontWeight: 'bold' }}
          >
            Log In
          </Button>

          <Button
            fullWidth
            variant="outlined"
            startIcon={<FcGoogle />}
            sx={{ mb: 3, borderRadius: '999px' }}
            onClick={() => showInfo('Google login coming soon!')}
          >
            Log In with Google
          </Button>

          <Typography variant="body2" align="center">
            Don’t have an account?{' '}
            <Link
              to="/register"
              style={{
                fontWeight: '500',
                fontSize: '0.9rem',
                color: theme.palette.primary.main,
                textDecoration: 'none',
              }}
            >
              Sign Up
            </Link>
          </Typography>
        </Box>
      </Container>
    </Container>
  );
}

export default Login;
