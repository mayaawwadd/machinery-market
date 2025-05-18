import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function CompletePayment() {
  return (
    <Box sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h4" gutterBottom>Payment successful!</Typography>
      <Typography>Your purchase is complete. Thank you!</Typography>
      <Button component={Link} to="/" sx={{ mt: 4 }}>Back to home</Button>
    </Box>
  );
}
