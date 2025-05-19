import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Link } from 'react-router-dom';

export default function CancelPayment() {
  return (
    <Box sx={{ mt: 4, minHeight: 'calc(100vh - 12rem)', textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>Payment canceled</Typography>
      <Typography>You did not complete your payment. Please try again.</Typography>
      <Button component={Link} to="/" sx={{ mt: 4 }}>Back to home</Button>
    </Box>
  );
}
