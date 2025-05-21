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
    Link,
    Alert,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axiosInstance from '../../services/axiosInstance';

export default function MyTransactions() {
    const { user } = useAuth();
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const { data } = await axiosInstance.get(
                    `/transactions/user/${user._id}`
                );
                setTransactions(data);
            } catch (err) {
                console.error(err);
                setError(
                    err.response?.data?.message || 'Failed to load transactions'
                );
            } finally {
                setLoading(false);
            }
        };

        if (user?._id) {
            fetchTransactions();
        } else {
            setLoading(false);
        }
    }, [user]);

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

    if (!transactions.length) {
        return (
            <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
                You have no transactions yet.
            </Typography>
        );
    }

    return (
        <Box sx={{ width: '100%', overflowX: 'auto' }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
                My Transactions
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Transaction ID</TableCell>
                            <TableCell>Item</TableCell>
                            <TableCell align="right">Amount</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((txn) => (
                            <TableRow key={txn._id} hover>
                                <TableCell>
                                    <Link
                                        component={RouterLink}
                                        to={`/transactions/${txn._id}`}
                                        underline="hover"
                                    >
                                        {txn._id}
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    {txn.machinery ? (
                                        <Link
                                            component={RouterLink}
                                            to={`/machinery/${txn.machinery._id}`}
                                            underline="hover"
                                        >
                                            {txn.machinery.title}
                                        </Link>
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            Item not available
                                        </Typography>
                                    )}
                                </TableCell>
                                <TableCell align="right">
                                    {new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: txn.currency || 'USD',
                                    }).format((txn.amountCents || 0) / 100)}
                                </TableCell>
                                <TableCell sx={{ textTransform: 'capitalize' }}>
                                    {txn.paymentStatus || 'unknown'}
                                </TableCell>
                                <TableCell>
                                    {txn.createdAt
                                        ? new Date(txn.createdAt).toLocaleDateString()
                                        : 'N/A'}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
