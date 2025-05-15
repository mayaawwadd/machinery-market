import React, { useEffect, useState } from 'react';
import {
    Container,
    Typography,
    Tabs,
    Tab,
    Box,
    Grid,
    CircularProgress,
} from '@mui/material';
import axiosInstance from '../services/axiosInstance';
import AuctionCard from '../components/AuctionCard';

export default function AuctionsPage() {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tabIndex, setTabIndex] = useState(0);

    useEffect(() => {
        const load = async () => {
            try {
                const { data } = await axiosInstance.get('/auctions');
                setAuctions(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load auctions');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const live = auctions.filter(a => a.isActive);
    const closed = auctions.filter(a => !a.isActive);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }
    if (error) {
        return (
            <Container sx={{ mt: 4 }}>
                <Typography color="error">{error}</Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 4, mb: 8, minHeight: 'calc(100vh - 12rem)' }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
                Auctions
            </Typography>

            <Tabs value={tabIndex} onChange={(e, v) => setTabIndex(v)}>
                <Tab label={`Live (${live.length})`} />
                <Tab label={`Completed (${closed.length})`} />
            </Tabs>

            <Box sx={{ mt: 3 }} hidden={tabIndex !== 0}>
                {live.length > 0 ? (
                    <Grid container spacing={3}>
                        {live.map(a => (
                            <Grid item key={a._id} xs={12} sm={6} md={4}>
                                <AuctionCard auction={a} />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box sx={{ textAlign: 'center', mt: 8 }}>
                        <Typography>No live auctions available.</Typography>
                    </Box>
                )}
            </Box>

            <Box sx={{ mt: 3 }} hidden={tabIndex !== 1}>
                {closed.length > 0 ? (
                    <Grid container spacing={3}>
                        {closed.map(a => (
                            <Grid item key={a._id} xs={12} sm={6} md={4}>
                                <AuctionCard auction={a} />
                            </Grid>
                        ))}
                    </Grid>
                ) : (
                    <Box sx={{ textAlign: 'center', mt: 8 }}>
                        <Typography>No completed auctions yet.</Typography>
                    </Box>
                )}
            </Box>
        </Container>
    );
}
