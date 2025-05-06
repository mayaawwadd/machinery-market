import React from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  IconButton,
  Divider,
  Link as MuiLink,
  useTheme,
} from '@mui/material';
import { Link } from 'react-router-dom';
import FacebookIcon from '@mui/icons-material/Facebook';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import InstagramIcon from '@mui/icons-material/Instagram';

function Footer() {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: theme.palette.grey[900],
        color: theme.palette.common.white,
        pt: 6,
        pb: 3,
        mt: 3,
      }}
    >
      <Container maxWidth="lg">
        {/* Top Section */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent='space-between'
          alignItems='center'
          spacing={4}
          pb={3}
          sx={{ textAlign: { xs: 'center', md: 'left' } }}
        >
          {/* Logo / App Name */}
          <Typography variant="h6" fontWeight={700}>
            .MACHINERY MARKET
          </Typography>

          {/* Navigation Links */}
          <Stack direction="row" spacing={3}>
            <MuiLink component={Link} to="/" color="inherit" underline="hover">
              Home
            </MuiLink>
            <MuiLink component={Link} to="/buy" color="inherit" underline="hover">
              Buy
            </MuiLink>
            <MuiLink component={Link} to="/sell" color="inherit" underline="hover">
              Sell
            </MuiLink>
            <MuiLink component={Link} to="/auctions" color="inherit" underline="hover">
              Auctions
            </MuiLink>
          </Stack>
        </Stack>

        <Divider sx={{ borderColor: theme.palette.grey[800], mb: 3 }} />

        {/* Bottom Section */}
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          justifyContent='space-between'
          alignItems='center'
          spacing={2}
          sx={{ textAlign: { xs: 'center', md: 'left' } }}
        >
          {/* Contact Info */}
          <Typography variant="body2">
            Contact: info@machinerymarket.jo | +962 7 9000 0000
          </Typography>

          {/* Social Media */}
          <Stack direction="row" spacing={1}>
            <IconButton
              component="a"
              href="#"
              target="_blank"
              rel="noopener"
              sx={{ color: 'inherit' }}
            >
              <FacebookIcon />
            </IconButton>
            <IconButton
              component="a"
              href="#"
              target="_blank"
              rel="noopener"
              sx={{ color: 'inherit' }}
            >
              <LinkedInIcon />
            </IconButton>
            <IconButton
              component="a"
              href="#"
              target="_blank"
              rel="noopener"
              sx={{ color: 'inherit' }}
            >
              <InstagramIcon />
            </IconButton>
          </Stack>
        </Stack>

        {/* Copyright */}
        <Typography variant="caption" display="block" align="center" sx={{ mt: 4, opacity: 0.6 }}>
          © {new Date().getFullYear()} Machinery Market. All rights reserved.
        </Typography>
      </Container>
    </Box >
  );
}

export default Footer;
