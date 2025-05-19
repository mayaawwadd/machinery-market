import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link as RouterLink } from 'react-router-dom';
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
    Paper,
    Stack,
    useTheme,
    Chip
} from '@mui/material';
import axiosInstance from '../services/axiosInstance';
import { MachinerySpecs } from '../components/MachinerySpecs';
import { io } from 'socket.io-client';
import Countdown from '../components/CountDown';
import { showSuccess, showError } from '../utils/toast';
import { useAuth } from '../context/AuthContext';

export default function AuctionDetails() {
    const { id } = useParams();
    const { user } = useAuth();
    const [auction, setAuction] = useState(null);
    const [bids, setBids] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [bidAmount, setBidAmount] = useState('');
    const socket = useRef(null);

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

        socket.current = io(import.meta.env.VITE_API_URL, { withCredentials: true });
        socket.current.on('connect', () => {
            socket.current.emit('joinAuction', id);
        });
        socket.current.on('bidPlaced', ({ currentBid, bid }) => {
            setAuction(a => ({ ...a, currentBid }));
            setBids(bs => [bid, ...bs]);
        });
        socket.current.on('auctionClosed', ({ winner, winnerBid }) => {
            setAuction(a => ({ ...a, isActive: false, winner, currentBid: winnerBid }));
        });

        return () => {
            socket.current.emit('leaveAuction', id);
            socket.current.disconnect();
        };
    }, [id]);

    const handlePlaceBid = async () => {
        try {
            await axiosInstance.post(`/auctions/${id}/bid`, { amount: Number(bidAmount) });
            const { data } = await axiosInstance.get(`/auctions/${id}`);
            setAuction(data.auction);
            setBids(data.bids);
            setBidAmount('');
            showSuccess('Your bid was placed!');
        } catch (err) {
            console.error(err);
            const msg = err.response?.data?.message || 'Bid failed';
            showError(msg);
            setError(msg);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );
    }
    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    const isLive = auction.isActive && Date.now() < new Date(auction.endTime).getTime();

    return (
        <Container sx={{ py: 6 }}>
            <Stack spacing={4}>
                <MachinerySpecs machine={auction.machine} />

                <Stack spacing={2}>
                    {/* 1. Top message */}
                    {isLive ? (
                        <Box>
                            <Typography variant="h5">
                                Current Bid: {(auction.currentBid || auction.startingPrice) / 100} JOD
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                Ends in: <Countdown endTime={auction.endTime} />
                            </Typography>
                        </Box>
                    ) : auction.winner ? (
                        // there _is_ a winner
                        user?._id === auction.winner._id?.toString() ? (
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                🎉 Congratulations, {auction.winner.username}! You won with{' '}
                                {(auction.currentBid / 100).toFixed(2)} JOD.
                            </Typography>
                        ) : (
                            <Typography variant="h6" color="text.secondary">
                                This auction is closed. Winner:{' '}
                                <strong>{auction.winner.username}</strong> @{' '}
                                {(auction.currentBid / 100).toFixed(2)} JOD.
                            </Typography>
                        )
                    ) : (
                        // no bids placed
                        <Typography variant="h6" color="text.secondary">
                            This auction closed with <strong>no bids</strong>.
                        </Typography>
                    )}

                    {/* 2. Bid form (if live) or purchase button */}
                    {isLive ? (
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                            <TextField
                                label={`Your bid should be at least ${((auction.currentBid || auction.startingPrice) + auction.minimumIncrement) / 100} JOD`}
                                type="number"
                                value={bidAmount}
                                onChange={e => setBidAmount(e.target.value)}
                                size="small"
                                sx={{ flex: 1 }}
                            />
                            <Button
                                variant="contained"
                                onClick={handlePlaceBid}
                                disabled={!bidAmount}
                                sx={{ whiteSpace: 'nowrap' }}
                            >
                                Place Bid
                            </Button>
                        </Stack>
                    ) : (
                        // only show purchase if there's a winner _and_ the logged‐in user was that winner
                        auction.winner?._id &&
                        user?._id === auction.winner._id.toString() && (
                            <Button
                                variant="contained"
                                color="primary"
                                fullWidth
                                component={RouterLink}
                                to={`/auctions/${auction._id}/purchase`}
                            >
                                Complete Purchase
                            </Button>
                        )
                    )}
                </Stack>

                {/* 3. Bid history */}
                <Paper elevation={1} sx={{ p: 3, maxHeight: 400, overflowY: 'auto' }}>
                    <Typography variant="h6" gutterBottom>
                        Bid History
                    </Typography>
                    {bids.length ? (
                        <List disablePadding>
                            {bids.map((b, idx) => (
                                <React.Fragment key={b._id}>
                                    <ListItem sx={{ pl: 0, pr: 0 }}>
                                        <ListItemText
                                            primary={`${b.bidder.username} — ${(b.amount / 100).toFixed(2)} JOD`}
                                            secondary={new Date(b.bidTime).toLocaleString()}
                                        />
                                        {idx === 0 && (
                                            <Chip
                                                label={isLive ? 'Highest Bid' : 'Winner'}
                                                size="small"
                                                color={isLive ? 'success' : 'primary'}
                                                sx={{ px: 1, ml: 1 }}
                                            />
                                        )}
                                    </ListItem>
                                    <Divider component="li" />
                                </React.Fragment>
                            ))}
                        </List>
                    ) : (
                        <Typography>No bids yet.</Typography>
                    )}
                </Paper>
            </Stack>
        </Container>
    );
}
