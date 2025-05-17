import React, { useState } from 'react';
import {
    Box,
    Typography,
    Chip,
    IconButton,
    useTheme
} from '@mui/material';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import ReactPlayer from 'react-player';

/**
 * Displays shared machinery information with media carousel: video first (if available), then images.
 * Allows navigation through media and shows thumbnails below.
 */
export function MachinerySpecs({ machine }) {
    const theme = useTheme();
    // Build media array: video first then images
    const media = [];
    if (machine.video) media.push({ type: 'video', src: machine.video });
    machine.images.forEach((url) => media.push({ type: 'image', src: url }));

    const [current, setCurrent] = useState(0);
    const prev = () => setCurrent((c) => (c === 0 ? media.length - 1 : c - 1));
    const next = () => setCurrent((c) => (c === media.length - 1 ? 0 : c + 1));

    const currentMedia = media[current];

    return (
        <Box>
            {/* Carousel display */}
            <Box sx={{ position: 'relative', mb: 2 }}>
                {currentMedia?.type === 'video' ? (
                    <Box sx={{ position: 'relative', pb: '56.25%' }}>
                        <ReactPlayer
                            url={currentMedia.src}
                            controls
                            width="100%"
                            height="100%"
                            style={{ position: 'absolute', top: 0, left: 0 }}
                        />
                    </Box>
                ) : (
                    <Box
                        component="img"
                        src={currentMedia?.src}
                        alt={machine.title}
                        sx={{ width: '100%', borderRadius: 2, objectFit: 'cover' }}
                    />
                )}

                <IconButton
                    onClick={prev}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: 8,
                        transform: 'translateY(-50%)',
                        bgcolor: 'rgba(255,255,255,0.7)'
                    }}
                >
                    <ArrowBackIos />
                </IconButton>
                <IconButton
                    onClick={next}
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        right: 8,
                        transform: 'translateY(-50%)',
                        bgcolor: 'rgba(255,255,255,0.7)'
                    }}
                >
                    <ArrowForwardIos />
                </IconButton>
            </Box>

            {/* Thumbnails */}
            <Box sx={{ display: 'flex', gap: 1, overflowX: 'auto', mb: 3 }}>
                {media.map((m, i) => (
                    <Box
                        key={i}
                        onClick={() => setCurrent(i)}
                        sx={{
                            flex: '0 0 auto',
                            width: 64,
                            height: 64,
                            borderRadius: 1,
                            border: i === current ? `2px solid ${theme.palette.primary.main}` : '1px solid #ccc',
                            overflow: 'hidden',
                            cursor: 'pointer'
                        }}
                    >
                        {m.type === 'video' ? (
                            <Box
                                component="video"
                                src={m.src}
                                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                muted
                            />
                        ) : (
                            <Box
                                component="img"
                                src={m.src}
                                sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        )}
                    </Box>
                ))}
            </Box>

            {/* Details */}
            <Box sx={{ mt: 2 }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>
                    {machine.title}
                </Typography>
                <Typography variant="h6" gutterBottom>
                    Price: {new Intl.NumberFormat('en-JO', { style: 'currency', currency: 'JOD' }).format(machine.priceCents / 100)}
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                    <Chip label={machine.condition.charAt(0).toUpperCase() + machine.condition.slice(1)} sx={{ textTransform: 'capitalize' }} />
                    <Chip label={`${machine.usedHours.toLocaleString()} hrs`} />
                    <Chip label={machine.category.charAt(0).toUpperCase() + machine.category.slice(1)} sx={{ textTransform: 'capitalize' }} />
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
