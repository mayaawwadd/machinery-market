// src/pages/AuctionDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
    Container,
    Typography,
    Box,
    CircularProgress,
    Button,
    TextField,
    List,
    ListItem,
    ListItemText,
    Divider,
} from '@mui/material';
import axiosInstance from '../services/axiosInstance';
import { MachinerySpecs } from '../components/MachinerySpecs';

export default function AuctionDetails() {
    const { id } = useParams();
    const [auction, setAuction] = useState(null);
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [bidAmount, setBidAmount] = useState('');

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axiosInstance.get(`/auctions/${id}`);
                setAuction(data.auction);
                setBids(data.bids);
            } catch (err) {
                console.error(err);
                setError('Unable to load auction');
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);

    const handlePlaceBid = async () => {
        try {
            await axiosInstance.post(`/auctions/${id}/bid`, { amount: Number(bidAmount) });
            // re-fetch bids & auction
            const { data } = await axiosInstance.get(`/auctions/${id}`);
            setAuction(data.auction);
            setBids(data.bids);
            setBidAmount('');
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.message || 'Bid failed');
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
            <CircularProgress />
        </Box>
    );
    if (error) return (
        <Container sx={{ mt: 4 }}>
            <Typography color="error">{error}</Typography>
        </Container>
    );

    const isLive = auction.isActive && new Date() < new Date(auction.endTime);

    return (
        <Container sx={{ py: 6 }}>
            <Typography variant="h4" gutterBottom>
                Auction: {auction.machine.title}
            </Typography>

            {/* Reuse your machinery specs panel */}
            <MachinerySpecs machine={auction.machine} />

            <Box sx={{ my: 4 }}>
                <Typography variant="h5">
                    Current Bid: {(auction.currentBid || auction.startingPrice) / 100} JOD
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Ends: {new Date(auction.endTime).toLocaleString()}
                </Typography>
            </Box>

            {isLive ? (
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', mb: 4 }}>
                    <TextField
                        label="Your Bid (JOD)"
                        type="number"
                        value={bidAmount}
                        onChange={e => setBidAmount(e.target.value)}
                        size="small"
                    />
                    <Button
                        variant="contained"
                        onClick={handlePlaceBid}
                        disabled={!bidAmount}
                    >
                        Place Bid
                    </Button>
                </Box>
            ) : (
                <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                    {auction.currentBidBy
                        ? `Winner: ${auction.currentBidBy.username} at ${(auction.currentBid / 100).toFixed(2)} JOD`
                        : 'No bids were placed.'}
                </Typography>
            )}

            <Box>
                <Typography variant="h6" gutterBottom>Bid History</Typography>
                {bids.length ? (
                    <List>
                        {bids.map(b => (
                            <React.Fragment key={b._id}>
                                <ListItem>
                                    <ListItemText
                                        primary={`${b.bidder.username} — ${(b.amount / 100).toFixed(2)} JOD`}
                                        secondary={new Date(b.bidTime).toLocaleString()}
                                    />
                                </ListItem>
                                <Divider component="li" />
                            </React.Fragment>
                        ))}
                    </List>
                ) : (
                    <Typography>No bids yet.</Typography>
                )}
            </Box>
        </Container>
    );
}
