import React from 'react';
import {
    Container,
    Typography,
    Stack,
    Button,
    Box,
    useTheme,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useTheme as useAppTheme } from '../../context/ThemeContext';
import lightImage from '../../assets/deliveriesLight.png';
import darkImage from '../../assets/deliveriesDark.png';

function Hero() {
    const theme = useTheme();
    const { mode } = useAppTheme();
    const image = mode === 'light' ? lightImage : darkImage;

    const highlightColor = mode === 'light' ? theme.palette.primary[500] : theme.palette.primary[700];

    return (
        <Container
            maxWidth="lg"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: { xs: 'column-reverse', md: 'row' },
                justifyContent: { xs: 'center', md: 'space-between' },
                alignItems: 'center',
                textAlign: { xs: 'center', md: 'left' },
                gap: 4,
                py: 3,
            }}
        >
            {/* Left: Text and CTA */}
            <Box
                flex={1}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                }}
            >
                <Typography variant="h3" fontWeight={700} gutterBottom>
                    Buy & Sell Used Industrial Machinery with Confidence
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                    A{' '}
                    <Box component="span" sx={{ color: highlightColor, fontWeight: 'bold' }}>
                        transparent
                    </Box>
                    ,{' '}
                    <Box component="span" sx={{ color: highlightColor, fontWeight: 'bold' }}>
                        secure
                    </Box>{' '}
                    and{' '}
                    <Box component="span" sx={{ color: highlightColor, fontWeight: 'bold' }}>
                        user-friendly
                    </Box>{' '}
                    platform tailored for Jordan&apos;s industrial sector. Join hundreds of verified buyers and sellers today.
                </Typography>
                <Stack direction="row" spacing={2} justifyContent={{ xs: 'center', md: 'start' }} flexWrap="wrap" sx={{ mt: 2 }}>
                    <Button
                        variant="contained"
                        size="large"
                        component={Link}
                        to="/buy"
                        sx={{ borderRadius: '999px', fontWeight: 'bold' }}
                    >
                        Browse Listings
                    </Button>
                    <Button
                        variant="outlined"
                        size="large"
                        component={Link}
                        to="/register"
                        sx={{ borderRadius: '999px', px: 5 }}
                    >
                        Get Started
                    </Button>
                </Stack>
            </Box >

            {/* Right: Image */}
            < Box
                flex={1}
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }
                }
            >
                <img
                    src={image}
                    alt="Delivery Illustration"
                    style={{ width: '100%', maxHeight: 400, objectFit: 'contain' }}
                />
            </Box >
        </Container >
    );
}

export default Hero;
