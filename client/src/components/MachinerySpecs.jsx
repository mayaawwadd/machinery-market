// components/MachinerySpecs.jsx
import React from 'react';
import {
    Box,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    Chip,
} from '@mui/material';

/**
 * Displays shared machinery information: images, title, specs, price, etc.
 */
export function MachinerySpecs({ machine }) {
    return (
        <Box sx={{ mb: 4 }}>
            <Grid container spacing={2}>
                {machine.images.map((url, i) => (
                    <Grid item xs={12} sm={6} md={4} key={i}>
                        <Card>
                            <CardMedia
                                component="img"
                                height="160"
                                image={url}
                                alt={machine.title}
                                sx={{ objectFit: 'cover' }}
                            />
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Box sx={{ mt: 3 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    {machine.title}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Price: {new Intl.NumberFormat('en-JO', { style: 'currency', currency: 'JOD' }).format(machine.priceCents / 100)}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip label={machine.condition} sx={{ textTransform: 'capitalize' }} />
                    <Chip label={`${machine.usedHours.toLocaleString()} hrs`} />
                    <Chip label={machine.category} sx={{ textTransform: 'capitalize' }} />
                </Box>
                <Typography variant="body1" paragraph>
                    {machine.equipmentDetails}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Manufacturer: {machine.manufacturer} | Made: {new Date(machine.manufacturingDate).toLocaleDateString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Origin: {machine.origin} | Voltage: {machine.voltage}
                </Typography>
            </Box>
        </Box>
    );
}