import React from 'react';
import { Box, Container, Grid, Typography, useTheme, Paper } from '@mui/material';
import GroupsIcon from '@mui/icons-material/Groups';
import InventoryIcon from '@mui/icons-material/Inventory';
import PublicIcon from '@mui/icons-material/Public';

const stats = [
    {
        icon: <GroupsIcon fontSize="large" color="primary" />,
        label: 'Verified Users',
        value: '500+',
    },
    {
        icon: <InventoryIcon fontSize="large" color="primary" />,
        label: 'Machinery Listings',
        value: '200+',
    },
    {
        icon: <PublicIcon fontSize="large" color="primary" />,
        label: 'Countries Served',
        value: '1',
    },
];

function Stats() {
    const theme = useTheme();

    return (
        <Box sx={{ py: 8, backgroundColor: theme.palette.background.default }}>
            <Container maxWidth="md">
                <Typography variant="h4" align="center" fontWeight={700} mb={6}>
                    Platform at a Glance
                </Typography>

                <Grid container spacing={4} justifyContent="center">
                    {stats.map((stat, index) => (
                        <Grid item xs={12} sm={4} key={index}>
                            <Paper
                                elevation={3}
                                sx={{
                                    p: 4,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    borderRadius: 3,
                                }}
                            >
                                <Box sx={{ mb: 2 }}>{stat.icon}</Box>
                                <Typography variant="h5" fontWeight={700}>
                                    {stat.value}
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                    {stat.label}
                                </Typography>
                            </Paper>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}

export default Stats;
