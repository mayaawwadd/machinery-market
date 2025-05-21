import React, { useEffect, useState } from 'react';
import {
    Box,
    CircularProgress,
    Typography,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Link,
    Button,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';
import { toast } from 'react-toastify';

export default function AdminMachines() {
    const [machines, setMachines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMachines = async () => {
            try {
                const { data } = await axiosInstance.get('/machinery');
                setMachines(data);
            } catch (err) {
                console.error(err);
                setError('Failed to load machinery listings');
            } finally {
                setLoading(false);
            }
        };
        fetchMachines();
    }, []);

    const handleDelete = () => {
        toast.info('You will be able to delete machinery soon');
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
            <Typography color="error" sx={{ mt: 4 }}>
                {error}
            </Typography>
        );
    }

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 3 }}>
                All Machinery Listings
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Title</TableCell>
                            <TableCell>Condition</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Price (JOD)</TableCell>
                            <TableCell>Seller</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {machines.map((machine) => (
                            <TableRow key={machine._id}>
                                <TableCell>
                                    <Link
                                        component={RouterLink}
                                        to={`/machinery/${machine._id}`}
                                        underline="hover"
                                    >
                                        {machine.title}
                                    </Link>
                                </TableCell>
                                <TableCell>{machine.condition}</TableCell>
                                <TableCell>{machine.category}</TableCell>
                                <TableCell>{(machine.priceCents / 100).toFixed(2)}</TableCell>
                                <TableCell>{machine.seller?.username || 'N/A'}</TableCell>
                                <TableCell align="right">
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        size="small"
                                        onClick={() => handleDelete()}
                                    >
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}
