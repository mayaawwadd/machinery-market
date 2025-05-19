// src/pages/MachineryPurchase.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import axiosInstance from '../services/axiosInstance';
import PaypalPayment from '../components/payment/PaypalPayment';

export default function MachineryPurchase() {
    const { id: machineryId } = useParams();
    const navigate = useNavigate();
    const [transaction, setTransaction] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        // only create the transaction when you actually arrive on the page
        axiosInstance
            .post(
                `/machinery/${machineryId}/purchase`,
                {
                    machineryId,            // the param you pulled from useParams
                    paymentMethod: 'paypal' // or 'cash' if you support that here
                }
            )
            .then(({ data }) => setTransaction(data.transaction))
            .catch(err => {
                console.error(err);
                setError(err.response?.data?.message || 'Could not start purchase');
            });
    }, [machineryId]);

    if (error) {
        return (
            <Box sx={{ mt: 4, minHeight: 'calc(100vh - 12rem)', display: 'flex', justifyContent: 'center' }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }

    if (!transaction) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8, minHeight: 'calc(100vh - 12rem)' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, minHeight: 'calc(100vh - 12rem)' }}>
            <Typography variant="h6" gutterBottom>
                Pay JOD {(transaction.amountCents / 100).toFixed(2)} for this item
            </Typography>
            <PaypalPayment transactionId={transaction._id} />
        </Box>
    );
}
