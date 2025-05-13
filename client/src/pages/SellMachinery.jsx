import React, { useState } from 'react';
import {
    Container,
    Box,
    Grid,
    Typography,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormGroup,
    InputLabel,
    OutlinedInput,
    Select,
    MenuItem,
    Button,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../services/axiosInstance';


const categories = ['industrial', 'agricultural', 'construction', 'medical', 'other'];
const conditions = ['new', 'used', 'refurbished'];

export default function SellMachinery() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        title: '',
        serialNumber: '',
        usedHours: '',
        condition: '',
        qualityDescription: '',
        origin: '',
        voltage: '',
        category: [],
        equipmentDetails: '',
        originalInvoice: '',
        manufacturingDate: '',
        manufacturer: '',
        priceCents: '',
        location: '',
        images: [],
        video: '',
        isAuction: false,
    });
    const [auctionData, setAuctionData] = useState({
        endTime: '',
        startingPrice: '',
        minimumIncrement: 1,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (name === 'isAuction') {
            setForm((f) => ({ ...f, isAuction: checked }));
        } else if (name in auctionData) {
            setAuctionData((a) => ({ ...a, [name]: value }));
        } else if (name === 'category') {
            const vals = Array.isArray(form.category) ? [...form.category] : [];
            if (checked) vals.push(value);
            else vals.splice(vals.indexOf(value), 1);
            setForm((f) => ({ ...f, category: vals }));
        } else {
            setForm((f) => ({ ...f, [name]: value }));
        }
    };

    // handle file uploads for images
    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files || []);
        if (!files.length) return;
        setLoading(true);
        try {
            const uploads = files.map((file) => {
                const data = new FormData();
                data.append('image', file);
                return axiosInstance.post('/upload/profile', data, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            });
            const results = await Promise.all(uploads);
            const base = import.meta.env.VITE_API_URL;
            const urls = results.map(r => base + r.data.url);
            setForm(f => ({ ...f, images: [...f.images, ...urls] }));
        } catch (err) {
            console.error('Image upload failed:', err);
            setError('Failed to upload images');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // 1) Create the machinery
            const { data: machine } = await axiosInstance.post(
                '/machinery',               // baseURL already includes “/api”
                {
                    ...form,
                    category: Array.isArray(form.category) ? form.category[0] : form.category,
                    priceCents: Number(form.priceCents)
                }
            );

            // 2) If it’s an auction, chain the auction creation
            if (form.isAuction) {
                await axiosInstance.post(
                    '/auctions',
                    {
                        machineryId: machine._id,
                        endTime: auctionData.endTime,
                        startingPrice: Number(auctionData.startingPrice),
                        minimumIncrement: Number(auctionData.minimumIncrement),
                    }
                );
            }

            // 3) Navigate on success
            navigate(
                form.isAuction
                    ? `/auctions/${machine._id}`
                    : `/machinery/${machine._id}`
            );

        } catch (err) {
            // dump full error in console
            console.error('Error creating machinery:', err.response || err);
            // show server message if available, otherwise generic
            setError(
                err.response?.data?.message ||
                err.response?.statusText ||
                err.message ||
                'Server error while creating machinery'
            );
        } finally {
            setLoading(false);
        }
    };


    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
                Sell Machinery
            </Typography>

            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 4, display: 'grid', gap: 2 }}>
                <Grid container spacing={1}>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth required>
                            <InputLabel htmlFor="title">Title</InputLabel>
                            <OutlinedInput
                                id="title"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                label="Title"
                            />
                        </FormControl>
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="serialNumber">Serial Number</InputLabel>
                            <OutlinedInput
                                id="serialNumber"
                                name="serialNumber"
                                value={form.serialNumber}
                                onChange={handleChange}
                                label="Serial Number"
                            />
                        </FormControl>
                    </Grid>
                </Grid>

                <Grid container spacing={1}>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
                            <InputLabel id="condition-label">Condition</InputLabel>
                            <Select
                                labelId="condition-label"
                                id="condition"
                                name="condition"
                                value={form.condition}
                                onChange={handleChange}
                                label="Condition"
                            >
                                {conditions.map((c) => (
                                    <MenuItem key={c} value={c}>
                                        {c}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="usedHours">Used Hours</InputLabel>
                            <OutlinedInput
                                id="usedHours"
                                name="usedHours"
                                type="number"
                                value={form.usedHours}
                                onChange={handleChange}
                                label="Used Hours"
                            />
                        </FormControl>
                    </Grid>
                </Grid>

                <FormControl fullWidth>
                    <InputLabel htmlFor="qualityDescription">Quality Description</InputLabel>
                    <OutlinedInput
                        id="qualityDescription"
                        name="qualityDescription"
                        value={form.qualityDescription}
                        onChange={handleChange}
                        multiline
                        rows={2}
                        label="Quality Description"
                    />
                </FormControl>

                <Grid container spacing={1}>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="origin">Origin</InputLabel>
                            <OutlinedInput
                                id="origin"
                                name="origin"
                                value={form.origin}
                                onChange={handleChange}
                                label="Origin"
                            />
                        </FormControl>
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor="voltage">Voltage</InputLabel>
                            <OutlinedInput
                                id="voltage"
                                name="voltage"
                                value={form.voltage}
                                onChange={handleChange}
                                label="Voltage"
                            />
                        </FormControl>
                    </Grid>
                </Grid>

                <FormGroup row>
                    {categories.map((cat) => (
                        <FormControlLabel
                            key={cat}
                            control={
                                <Checkbox
                                    name="category"
                                    value={cat}
                                    checked={form.category.includes(cat)}
                                    onChange={handleChange}
                                />
                            }
                            label={cat.charAt(0).toUpperCase() + cat.slice(1)}
                        />
                    ))}
                </FormGroup>

                <FormControl fullWidth>
                    <InputLabel htmlFor="equipmentDetails">Equipment Details</InputLabel>
                    <OutlinedInput
                        id="equipmentDetails"
                        name="equipmentDetails"
                        value={form.equipmentDetails}
                        onChange={handleChange}
                        multiline
                        rows={3}
                        label="Equipment Details"
                    />
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel htmlFor="originalInvoice">Original Invoice URL</InputLabel>
                    <OutlinedInput
                        id="originalInvoice"
                        name="originalInvoice"
                        value={form.originalInvoice}
                        onChange={handleChange}
                        label="Original Invoice URL"
                    />
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel shrink htmlFor="manufacturingDate">Manufacturing Date</InputLabel>
                    <OutlinedInput
                        id="manufacturingDate"
                        name="manufacturingDate"
                        type="date"
                        value={form.manufacturingDate}
                        onChange={handleChange}
                        label="Manufacturing Date"
                    />
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel htmlFor="manufacturer">Manufacturer</InputLabel>
                    <OutlinedInput
                        id="manufacturer"
                        name="manufacturer"
                        value={form.manufacturer}
                        onChange={handleChange}
                        label="Manufacturer"
                    />
                </FormControl>

                <FormControl fullWidth required>
                    <InputLabel htmlFor="priceCents">Price (in cents)</InputLabel>
                    <OutlinedInput
                        id="priceCents"
                        name="priceCents"
                        type="number"
                        value={form.priceCents}
                        onChange={handleChange}
                        label="Price (in cents)"
                    />
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel htmlFor="location">Location</InputLabel>
                    <OutlinedInput
                        id="location"
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        label="Location"
                    />
                </FormControl>

                {/* Image upload & preview */}
                <FormControl fullWidth>
                    <InputLabel shrink>Images</InputLabel>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, my: 1, py: 1, px: 4 }}>
                        {form.images.map((url, i) => (
                            <Box
                                key={i}
                                component="img"
                                src={url}
                                sx={{ height: 80, borderRadius: 1, objectFit: 'cover' }}
                            />
                        ))}
                    </Box>
                    <Button variant="outlined" component="label" disabled={loading}>
                        Upload Images
                        <input
                            hidden
                            accept="image/jpeg,image/png"
                            type="file"
                            multiple
                            onChange={handleImageUpload}
                        />
                    </Button>
                </FormControl>

                <FormControl fullWidth>
                    <InputLabel htmlFor="video">Video URL</InputLabel>
                    <OutlinedInput
                        id="video"
                        name="video"
                        value={form.video}
                        onChange={handleChange}
                        label="Video URL"
                    />
                </FormControl>

                <FormControlLabel
                    control={
                        <Checkbox
                            name="isAuction"
                            checked={form.isAuction}
                            onChange={handleChange}
                        />
                    }
                    label="Create as auction?"
                />

                {form.isAuction && (
                    <Box sx={{ display: 'grid', gap: 2 }}>
                        <FormControl fullWidth required>
                            <InputLabel shrink htmlFor="endTime">Auction End Time</InputLabel>
                            <OutlinedInput
                                id="endTime"
                                name="endTime"
                                type="datetime-local"
                                value={auctionData.endTime}
                                onChange={handleChange}
                                label="Auction End Time"
                            />
                        </FormControl>

                        <FormControl fullWidth required>
                            <InputLabel htmlFor="startingPrice">Starting Price</InputLabel>
                            <OutlinedInput
                                id="startingPrice"
                                name="startingPrice"
                                type="number"
                                value={auctionData.startingPrice}
                                onChange={handleChange}
                                label="Starting Price"
                            />
                        </FormControl>

                        <FormControl fullWidth>
                            <InputLabel htmlFor="minimumIncrement">Minimum Increment</InputLabel>
                            <OutlinedInput
                                id="minimumIncrement"
                                name="minimumIncrement"
                                type="number"
                                value={auctionData.minimumIncrement}
                                onChange={handleChange}
                                label="Minimum Increment"
                            />
                        </FormControl>
                    </Box>
                )}

                {error && <Typography color="error">{error}</Typography>}
                <Button type="submit" variant="contained" disabled={loading}>
                    Submit
                </Button>
            </Box>
        </Container >
    );
}
