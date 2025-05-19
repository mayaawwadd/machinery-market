import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    CircularProgress,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Avatar,
    Link,
    Alert,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';

export default function MyListings() {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMyListings = async () => {
            try {
                const { data } = await axiosInstance.get('/api/machinery/my');
                setListings(data);
            } catch (err) {
                console.error(err);
                setError(err.response?.data?.message || 'Failed to load listings');
            } finally {
                setLoading(false);
            }
        };
        fetchMyListings();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mt: 4 }}>
                {error}
            </Alert>
        );
    }

    if (listings.length === 0) {
        return (
            <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
                You have no machinery listings yet.
            </Typography>
        );
    }

    return (
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
                My Machinery Listings
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Image</TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Condition</TableCell>
                            <TableCell align="right">Used Hours</TableCell>
                            <TableCell align="right">Price</TableCell>
                            <TableCell>Category</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {listings.map((item) => (
                            <TableRow key={item._id} hover>
                                <TableCell>
                                    <Avatar
                                        variant="square"
                                        src={item.images?.[0] || '/placeholder.png'}
                                        sx={{ width: 56, height: 56 }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Link
                                        component={RouterLink}
                                        to={`/machinery/${item._id}`}
                                        underline="hover"
                                    >
                                        {item.title}
                                    </Link>
                                </TableCell>
                                <TableCell>{item.condition.charAt(0).toUpperCase() + item.condition.slice(1)}</TableCell>
                                <TableCell align="right">{item.usedHours.toLocaleString()}</TableCell>
                                <TableCell align="right">
                                    {new Intl.NumberFormat('en-JO', {
                                        style: 'currency',
                                        currency: 'JOD',
                                    }).format(item.priceCents / 100)}
                                </TableCell>
                                <TableCell sx={{ textTransform: 'capitalize' }}>{item.category}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
