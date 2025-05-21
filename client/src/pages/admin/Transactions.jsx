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
    Alert,
    Link,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';

export default function AdminTransactions() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const { data } = await axiosInstance.get('/transactions');
                setTransactions(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load transactions');
            } finally {
                setLoading(false);
            }
        };
        fetchTransactions();
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

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 3 }}>
                All Transactions
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Buyer</TableCell>
                            <TableCell>Seller</TableCell>
                            <TableCell>Item</TableCell>
                            <TableCell>Amount</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.map((txn) => (
                            <TableRow key={txn._id} hover>
                                <TableCell>{txn._id}</TableCell>
                                <TableCell>{txn.buyer?.username || 'Unknown'}</TableCell>
                                <TableCell>{txn.seller?.username || 'Unknown'}</TableCell>
                                <TableCell>
                                    <Link
                                        component={RouterLink}
                                        to={`/machinery/${txn.machinery?._id}`}
                                        underline="hover"
                                    >
                                        {txn.machinery?.title?.split(' ')[0] + (txn.machinery?.title?.includes(' ') ? '...' : '') || 'Untitled'}

                                    </Link>
                                </TableCell>
                                <TableCell>
                                    {new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: txn.currency || 'USD',
                                    }).format(txn.amountCents / 100)}
                                </TableCell>
                                <TableCell sx={{ textTransform: 'capitalize' }}>
                                    {txn.paymentStatus}
                                </TableCell>
                                <TableCell>
                                    {new Date(txn.createdAt).toLocaleDateString()}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
