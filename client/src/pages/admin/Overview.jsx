import React, { useEffect, useState } from 'react';
import {
    Grid,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Box,
} from '@mui/material';
import axiosInstance from '../../services/axiosInstance';

export default function AdminOverview() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axiosInstance
            .get('/admin/stats')
            .then(res => setStats(res.data))
            .catch(err => console.error('Failed to load admin stats', err))
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Total Users</Typography>
                        <Typography variant="h4">{stats?.totalUsers ?? 0}</Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Active Listings</Typography>
                        <Typography variant="h4">{stats?.activeListings ?? 0}</Typography>
                    </CardContent>
                </Card>
            </Grid>

            <Grid item xs={12} md={4}>
                <Card>
                    <CardContent>
                        <Typography variant="h6">Transactions</Typography>
                        <Typography variant="h4">{stats?.totalTransactions ?? 0}</Typography>
                    </CardContent>
                </Card>
            </Grid>
        </Grid>
    );
}
