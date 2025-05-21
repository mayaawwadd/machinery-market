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
    IconButton,
    Tooltip,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axiosInstance from '../../services/axiosInstance';
import { showSuccess, showError, showInfo } from '../../utils/toast';

export default function AdminReviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data } = await axiosInstance.get('/reviews');
                setReviews(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load reviews');
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, []);

    const handleDelete = async (id) => {
        showInfo('You will be able to delete reviews soon!');
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
                All Reviews
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Buyer</TableCell>
                            <TableCell>Seller</TableCell>

                            <TableCell>Rating</TableCell>
                            <TableCell>Comment</TableCell>
                            <TableCell>Flagged</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {reviews.map((r) => (
                            <TableRow key={r._id} hover>
                                <TableCell>{r.buyer?.username || 'N/A'}</TableCell>
                                <TableCell>{r.seller?.username || 'N/A'}</TableCell>
                                <TableCell>{r.rating}</TableCell>
                                <TableCell>{r.comment}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={r.isFlagged ? 'Yes' : 'No'}
                                        color={r.isFlagged ? 'warning' : 'default'}
                                        size="small"
                                    />
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Delete Review">
                                        <IconButton onClick={() => handleDelete(r._id)}>
                                            <DeleteIcon fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
