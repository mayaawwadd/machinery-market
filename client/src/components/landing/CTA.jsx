import React from 'react';
import { Box, Button, Container, Stack, Typography, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import { useTheme as useAppTheme } from '../../context/ThemeContext';

function CTA() {
    const theme = useTheme();
    const { mode } = useAppTheme();
    const color = mode === 'light' ? theme.palette.primary[700] : theme.palette.primary[300];

    return (
        <Box
            sx={{
                py: { xs: 6, md: 10 },
                backgroundColor: color,
                color: theme.palette.primary.contrastText,
                textAlign: 'center',
            }}
        >
            <Container maxWidth="md">
                <Typography variant="h4" fontWeight={700} mb={2}>
                    Ready to buy or sell industrial machinery?
                </Typography>
                <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
                    Join Jordan's first dedicated machinery marketplace and connect with verified users today.
                </Typography>

                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    justifyContent="center"
                >
                    <Button
                        variant="contained"
                        size="large"
                        component={Link}
                        to="/buy"
                        sx={{ fontWeight: 'bold', borderRadius: '999px', px: 5 }}
                        color="secondary"
                    >
                        Browse Listings
                    </Button>
                    <Button
                        variant="outlined"
                        size="large"
                        component={Link}
                        to="/sell"
                        sx={{ fontWeight: 'bold', borderRadius: '999px', color: 'inherit', borderColor: 'inherit' }}
                    >
                        List Your Machinery
                    </Button>
                </Stack>
            </Container>
        </Box>
    );
}

export default CTA;
