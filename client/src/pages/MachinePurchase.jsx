// src/pages/AuctionPurchase.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import axiosInstance from '../services/axiosInstance';
import PaypalPayment from '../components/payment/PaypalPayment';

export default function AuctionPurchase() {
    const { id: auctionId } = useParams();
    const navigate = useNavigate();
    const [transaction, setTransaction] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        // 1) hit your auction purchase endpoint to create a Transaction
        axiosInstance
            .post(`/auctions/${auctionId}/purchase`)
            .then(({ data }) => setTransaction(data.transaction))
            .catch(err => {
                console.error(err);
                setError(err.response?.data?.message || 'Could not start purchase');
            });
    }, [auctionId]);

    if (error)
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8, minHeight: 'calc(100vh-12rem)' }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );

    if (!transaction)
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                <CircularProgress />
            </Box>
        );

    // 2) render the PayPal buttons, passing the transaction ID
    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
            <Typography variant="h6" gutterBottom>
                Pay JOD {(transaction.amountCents / 100).toFixed(2)} for this auction
            </Typography>
            <PaypalPayment transactionId={transaction._id} />
        </Box>
    );
}
