import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    CardActions,
    Button,
    Box
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import dayjs from 'dayjs';
import axiosInstance from '../services/axiosInstance';

/**
 * AuctionCard displays summary information for an auction,
 * including details fetched from the Machinery collection.
 */
export default function AuctionCard({ auction }) {
    const [timeLeft, setTimeLeft] = useState('');
    // start with populated fields (may be partial)
    const [machine, setMachine] = useState(auction.machine);

    // Fetch full machine details if not fully populated
    useEffect(() => {
        if (!machine.images || !machine.priceCents) {
            const fetchMachine = async () => {
                try {
                    const { data } = await axiosInstance.get(`/machinery/${auction.machine._id}`);
                    setMachine(data);
                } catch (err) {
                    console.error('Failed to fetch machine details:', err);
                }
            };
            fetchMachine();
        }
    }, [auction.machine._id]);

    // Countdown timer logic
    useEffect(() => {
        if (!auction.isActive) {
            setTimeLeft('Ended');
            return;
        }

        const computeTimeLeft = () => {
            const now = dayjs();
            const end = dayjs(auction.endTime);
            const diffMs = end.diff(now);
            if (diffMs <= 0) {
                setTimeLeft('Ended');
                return;
            }
            const d = {
                days: Math.floor(diffMs / (1000 * 60 * 60 * 24)),
                hours: Math.floor((diffMs / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((diffMs / (1000 * 60)) % 60),
                seconds: Math.floor((diffMs / 1000) % 60),
            };
            setTimeLeft(`${d.days}d ${d.hours}h ${d.minutes}m ${d.seconds}s`);
        };

        computeTimeLeft();
        const timer = setInterval(computeTimeLeft, 1000);
        return () => clearInterval(timer);

    }, [auction.endTime, auction.isActive]);


    // Display values
    const imageUrl = machine.images?.[0];
    const title = machine.title;
    const currentBid = auction.currentBid > 0 ? auction.currentBid : auction.startingPrice;
    const priceJod = (machine.priceCents / 100).toFixed(2);
    const condition = machine.condition
        ? machine.condition.charAt(0).toUpperCase() + machine.condition.slice(1)
        : '';
    const category = machine.category
        ? machine.category.charAt(0).toUpperCase() + machine.category.slice(1)
        : '';

    return (
        <Card sx={{ maxWidth: 345, display: 'flex', flexDirection: 'column', height: '100%' }}>
            <CardMedia
                component="img"
                height="180"
                image={imageUrl}
                alt={title}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div" noWrap>
                    {title}
                </Typography>
                <Box sx={{ mb: 1 }}>
                    <Typography variant="body2" color="text.secondary">
                        Price: <strong>{priceJod} JOD</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Current Bid: <strong>{(currentBid / 100).toFixed(2)} JOD</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Category: <strong>{category}</strong>
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Location: <strong>{machine.location}</strong>
                    </Typography>
                    {auction.isActive ? (
                        <Typography variant="body2" color="text.secondary">
                            Time Left: <strong>{timeLeft}</strong>
                        </Typography>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            Status: <strong>Ended</strong>
                        </Typography>
                    )}
                </Box>
            </CardContent>
            <CardActions>
                <Button
                    size="small"
                    component={RouterLink}
                    to={`/auctions/${auction._id}`}
                >
                    View Auction
                </Button>
            </CardActions>
        </Card>
    );
}

AuctionCard.propTypes = {
    auction: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        machine: PropTypes.shape({
            _id: PropTypes.string.isRequired,
        }).isRequired,
        startingPrice: PropTypes.number.isRequired,
        currentBid: PropTypes.number,
        endTime: PropTypes.string.isRequired,
    }).isRequired,
};