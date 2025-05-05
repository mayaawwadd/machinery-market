import React from 'react';
import {
    Container,
    Typography,
    Paper,
    Box,
    Stack,
    useTheme,
} from '@mui/material';
import GavelIcon from '@mui/icons-material/Gavel';
import SecurityIcon from '@mui/icons-material/Security';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import TranslateIcon from '@mui/icons-material/Translate';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import { useTheme as useAppTheme } from '../../context/ThemeContext'

const features = [
    {
        icon: <LocalShippingIcon fontSize="large" />,
        title: 'Jordan’s Exclusive Marketplace',
        description: 'The first and only dedicated online platform for trading used industrial machinery in Jordan.',
    },
    {
        icon: <CheckCircleIcon fontSize="large" />,
        title: 'Verified Listings',
        description: 'Browse trusted machinery listings with verified sellers and accurate specifications.',
    },
    {
        icon: <SecurityIcon fontSize="large" />,
        title: 'Secure Transactions',
        description: 'Buy and sell with peace of mind through our encrypted and protected platform.',
    },
    {
        icon: <GavelIcon fontSize="large" />,
        title: 'Live Auctions',
        description: 'Participate in real-time auctions to get the best market value for machinery.',
    },
    {
        icon: <TranslateIcon fontSize="large" />,
        title: 'Multilingual Support',
        description: 'Available in Arabic and English for broader accessibility.',
    },
    {
        icon: <SmartToyIcon fontSize="large" />,
        title: 'AI Suggestions',
        description: 'Coming soon: Smart recommendations based on your preferences and activity.',
    },
];

function Features() {
    const theme = useTheme();
    const { mode } = useAppTheme();
    const color = mode === 'light' ? theme.palette.primary.main : theme.palette.primary[600];

    return (
        <Box sx={{ py: 3, backgroundColor: theme.palette.background.default }}>
            <Container maxWidth="lg">
                <Typography
                    variant="h4"
                    align="center"
                    sx={{ fontWeight: 'bold', mb: 6 }}
                >
                    Why Choose Machinery Market?
                </Typography>

                <Stack
                    spacing={2}
                    direction="row"
                    flexWrap="wrap"
                    justifyContent="space-between"
                    gap={2}
                >
                    {features.map((feature, index) => (
                        <Paper
                            key={index}
                            elevation={3}
                            sx={{
                                width: { xs: '100%', md: '45%' },
                                display: 'flex',
                                justifyContent: 'start',
                                alignItems: 'center',
                                p: 3,
                                borderRadius: 3,
                                minHeight: 120,
                                marginLeft: '0 !important',
                            }}
                        >
                            <Box
                                sx={{
                                    minWidth: 56,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    mr: 2,
                                    color: { color },
                                }}
                            >
                                {feature.icon}
                            </Box>
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    {feature.title}
                                </Typography>
                                <Typography variant="body2" sx={{ mt: 0.5 }}>
                                    {feature.description}
                                </Typography>
                            </Box>
                        </Paper>
                    ))}
                </Stack>
            </Container>
        </Box >
    );
}

export default Features;
