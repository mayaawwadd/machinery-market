import React, { useState, useEffect, useRef } from 'react';
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
    const theme = useTheme();
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
            setError(err.response?.data?.message || 'Bid failed');
            const msg = err.response?.data?.message || 'Bid failed';
            showError(msg);
            setError(msg);
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>;
    if (error) return <Container sx={{ mt: 4 }}><Typography color="error">{error}</Typography></Container>;

    const isLive = auction.isActive && new Date() < new Date(auction.endTime);

    return (
        <Container sx={{ py: 6 }}>
            <Stack spacing={4}>
                <MachinerySpecs machine={auction.machine} />

                <Stack spacing={2}>
                    <Box>
                        <Typography variant="h5">
                            Current Bid: {(auction.currentBid || auction.startingPrice) / 100} JOD
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            {auction.isActive && new Date() < new Date(auction.endTime) ? (
                                <>Ends in: <Countdown endTime={auction.endTime} /></>
                            ) : (
                                'CLOSED'
                            )}
                        </Typography>
                    </Box>

                    {isLive ? (
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                            <TextField
                                label={`Your bid should be at least ${auction.currentBid + auction.minimumIncrement} JOD`}
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
                        <>
                            <Typography variant="h6" color="text.secondary">
                                {auction.currentBidBy
                                    ? `Winner: ${auction.currentBidBy.username} at ${(auction.currentBid / 100).toFixed(2)} JOD`
                                    : 'No bids were placed.'}
                            </Typography>
                            <Box>
                                {auction.winner && user?._id === auction.winner.toString() ? (
                                    // Winner sees “Purchase” CTA
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        component="a"
                                        href={`/auctions/${auction._id}/purchase`}
                                    > Complete Purchase
                                    </Button>
                                ) : (
                                    // Other users see who won
                                    <Typography variant='h6' color='text.primary'>
                                        This auction has ended. Winner: {" "}
                                        <strong>
                                            {auction.winner.username} @{" "}
                                            {(auction.winnerBid).toFixed(2)} JOD
                                        </strong>
                                    </Typography>
                                )}
                            </Box>
                        </>

                    )}
                </Stack>


                <Paper elevation={1} sx={{ p: 3, maxHeight: 400, overflowY: 'auto' }}>
                    <Typography variant="h6" gutterBottom>Bid History</Typography>
                    {bids.length ? (
                        <List disablePadding>
                            {bids.map((b, idx) => (
                                <React.Fragment key={b._id}>
                                    <ListItem sx={{ pl: 0, pr: 0 }}>
                                        <ListItemText
                                            primary={`${b.bidder.username} — ${(b.amount / 100).toFixed(2)} JOD`}
                                            secondary={new Date(b.bidTime).toLocaleString()}
                                        />
                                        {
                                            idx === 0 && (
                                                <Chip label="Highest Bid" size='small' color='success' sx={{ px: 1, ml: 1 }} />
                                            )
                                        }
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
