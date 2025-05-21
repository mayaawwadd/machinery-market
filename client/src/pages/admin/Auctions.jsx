import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    CircularProgress,
    Chip,
    Alert,
    Link,
    Button,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import { showSuccess, showError } from '../../utils/toast';

export default function AdminAuctions() {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAuctions();
    }, []);

    const fetchAuctions = async () => {
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

    const handleCloseAuction = async (auctionId) => {
        try {
            await axiosInstance.patch(`/auctions/${auctionId}/closeAuction`);
            showSuccess('Auction closed successfully');
            fetchAuctions();
        } catch (err) {
            console.error(err);
            showError(err.response?.data?.message || 'Could not close auction');
        }
    };

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

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 3 }}>
                All Auctions
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Seller</TableCell>
                            <TableCell align="right">Current Bid</TableCell>
                            <TableCell align="right">Ends In</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {auctions.map((auction) => (
                            <TableRow key={auction._id} hover>
                                <TableCell>
                                    <Link
                                        component={RouterLink}
                                        to={`/auctions/${auction._id}`}
                                        underline="hover"
                                    >
                                        {auction.machine?.title || 'Untitled'}
                                    </Link>
                                </TableCell>
                                <TableCell>{auction.seller?.username || 'Unknown'}</TableCell>
                                <TableCell align="right">
                                    {auction.currentBid ? `${auction.currentBid / 100} JOD` : `${auction.startingPrice / 100} JOD`}
                                </TableCell>
                                <TableCell align="right">
                                    {new Date(auction.endTime).toLocaleDateString()}
                                </TableCell>
                                <TableCell>
                                    <Chip
                                        label={auction.isActive ? 'Active' : 'Closed'}
                                        color={auction.isActive ? 'success' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        color="error"
                                        disabled={!auction.isActive}
                                        onClick={() => handleCloseAuction(auction._id)}
                                    >
                                        Close Auction
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
