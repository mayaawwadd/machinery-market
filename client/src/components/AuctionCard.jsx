import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    Card,
    CardMedia,
    CardContent,
    Typography,
    CardActions,
    Button,
    Box,
    Chip,
    useTheme
} from '@mui/material';
import { useTheme as useAppTheme } from '../context/ThemeContext';
import { Link as RouterLink } from 'react-router-dom';
import dayjs from 'dayjs';
import axiosInstance from '../services/axiosInstance';

/**
 * AuctionCard displays an auction preview with key details only:
 * image, title, current bid, and end date.
 */
export default function AuctionCard({ auction }) {
    const [machine, setMachine] = useState(auction.machine);
    const theme = useTheme();
    const { mode } = useAppTheme();
    const color = mode === 'light' ? theme.palette.secondary.main : theme.default;

    // fetch full machine data if needed (images)
    useEffect(() => {
        if (!machine.images) {
            (async () => {
                try {
                    const { data } = await axiosInstance.get(
                        `/machinery/${auction.machine._id}`
                    );
                    setMachine(data);
                } catch (err) {
                    console.error('Error fetching machine:', err);
                }
            })();
        }
    }, [auction.machine._id, machine]);

    const imageUrl = machine.images?.[0] || '/placeholder.jpg';
    const title = machine.title;
    const currentBid = auction.currentBid > 0 ? auction.currentBid : auction.startingPrice;
    const bidJod = (currentBid / 100).toFixed(2);
    const endsOn = dayjs(auction.endTime).format('MMM D, YYYY h:mm A');
    const category = machine.category
        ? machine.category.charAt(0).toUpperCase() + machine.category.slice(1)
        : '';


    return (
        <Card
            component={RouterLink}
            to={`/auctions/${auction._id}`}
            sx={{
                borderRadius: 3,
                flex: 1,
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                width: '20rem',
                boxShadow: 1,
                transition: 'transform 0.2s, box-shadow 0.2s',
                '&:hover': {
                    transform: 'translateY(-1px)',
                    boxShadow: 2,
                },
            }}
        >
            <CardMedia
                component="img"
                height="160"
                image={imageUrl}
                alt={title}
                sx={{ objectFit: 'cover' }}
            />

            <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6" noWrap gutterBottom>
                    {title}
                </Typography>
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" color="text.secondary">
                            Current Bid: <strong>{bidJod} JOD</strong>
                        </Typography>
                        <Chip label={category} size="small" sx={{ textTransform: 'capitalize', backgroundColor: color }} />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        Ends on: <strong>{endsOn}</strong>
                    </Typography>
                </Box>
            </CardContent>

            <CardActions sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button size="small" color="primary" sx={{ borderRadius: '999px', px: 1 }}>
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
