import React, { useState, useEffect } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import {
    Container,
    Typography,
    CircularProgress,
    Box,
    Avatar,
    Button,
    Grid,
} from '@mui/material';
import axiosInstance from '../services/axiosInstance';
import { MachinerySpecs } from '../components/MachinerySpecs';

/**
 * MachineryDetail page fetches and renders a single machinery listing.
 */
export default function MachineryDetail() {
    const { id } = useParams();
    const [machine, setMachine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axiosInstance.get(`/machinery/${id}`);
                setMachine(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load listing');
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

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

    const { seller } = machine; // populated via .populate('seller','username email phone avatarUrl')

    return (
        <Container sx={{ py: 6 }}>
            <MachinerySpecs machine={machine} />

            <Box sx={{ mt: 6 }}>
                <Typography variant="h5" gutterBottom>
                    Seller Information
                </Typography>
                <Grid container spacing={2} alignItems="center">
                    <Grid item>
                        <Avatar
                            src={seller.profileImage}
                            alt={seller.username}
                            sx={{ width: 64, height: 64 }}
                        />
                    </Grid>
                    <Grid item>
                        <Typography variant="subtitle1">{seller.username}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            {seller.email}
                        </Typography>
                        {seller.phone && (
                            <Typography variant="body2" color="text.secondary">
                                {seller.phone}
                            </Typography>
                        )}
                    </Grid>
                </Grid>
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                    <Button
                        variant="contained"
                        size="large"
                        component={RouterLink}
                        to={`/machinery/${machine._id}/purchase`}
                    >
                        Purchase Now
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
