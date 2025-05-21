import React, { useState } from 'react';
import {
    Container,
    Link,
    Box,
    Grid,
    Typography,
    Checkbox,
    FormControl,
    FormControlLabel,
    FormLabel,
    RadioGroup,
    Radio,
    InputLabel,
    OutlinedInput,
    Select,
    MenuItem,
    Button,
    IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
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
        category: '',
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
                return axiosInstance.post('/upload/machinery', data, {
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

    const handleRemoveImage = async (index) => {
        const url = form.images[index];
        // optional: strip off the base URL to get the filename
        const filename = url.split('/').pop();

        // 1) Optimistically remove from UI
        setForm(f => ({
            ...f,
            images: f.images.filter((_, i) => i !== index)
        }));

        // 2) (Optional) tell the server to delete the file
        try {
            await axiosInstance.delete(`/upload/machinery/${filename}`);
        } catch (err) {
            console.error('Failed to delete image on server', err);
            // you could re-add it to state here if you care about consistency
        }
    };

    // handle file uploads for the original invoice
    const handleInvoiceUpload = async (e) => {
        const file = e.target.files?.[0];

        if (!file) return;
        setLoading(true);

        try {
            const data = new FormData();
            data.append('invoice', file);

            const res = await axiosInstance.post(
                '/upload/invoice',
                data,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            const base = import.meta.env.VITE_API_URL;
            setForm(f => ({
                ...f,
                originalInvoice: base + res.data.url
            }));
        } catch (err) {
            console.log('Invoice upload failed: ', err);
            setError('Failed to upload invoice');
        } finally {
            setLoading(false);
        }
    };

    // at top of component, next to handleRemoveImage:
    const handleRemoveInvoice = async () => {
        if (!form.originalInvoice) return;

        // extract filename from URL
        const filename = form.originalInvoice.split('/').pop();

        // Optimistically clear it from the form
        setForm(f => ({ ...f, originalInvoice: '' }));

        try {
            await axiosInstance.delete(`/upload/invoice/${filename}`);
        } catch (err) {
            console.error('Failed to delete invoice on server, rolling back', err);
            // put it back if deletion fails
            setForm(f => ({ ...f, originalInvoice: import.meta.env.VITE_API_URL + `/uploads/invoices/${filename}` }));
        }
    };

    // inside SellMachinery()

    const handleVideoUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setLoading(true);
        try {
            const data = new FormData();
            data.append('video', file);
            const res = await axiosInstance.post(
                '/upload/video',
                data,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );
            const base = import.meta.env.VITE_API_URL;
            setForm(f => ({ ...f, video: base + res.data.url }));
        } catch (err) {
            console.error('Video upload failed:', err);
            setError('Failed to upload video');
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveVideo = async () => {
        if (!form.video) return;
        const filename = form.video.split('/').pop();
        setForm(f => ({ ...f, video: '' }));
        try {
            await axiosInstance.delete(`/upload/video/${filename}`);
        } catch {
            console.error('Video delete failed, rolling back');
            setForm(f => ({ ...f, video: import.meta.env.VITE_API_URL + `/uploads/videos/${filename}` }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // build the common machinery payload
        const machinePayload = {
            title: form.title,
            serialNumber: form.serialNumber,
            usedHours: Number(form.usedHours),
            condition: form.condition,
            qualityDescription: form.qualityDescription,
            origin: form.origin,
            voltage: form.voltage,
            category: form.category,
            equipmentDetails: form.equipmentDetails,
            originalInvoice: form.originalInvoice,
            manufacturingDate: form.manufacturingDate,
            manufacturer: form.manufacturer,
            priceCents: Number(form.priceCents) * 100,
            location: form.location,
            images: form.images,
            video: form.video,
        };

        try {
            if (form.isAuction) {
                // merge in auction fields
                const payload = {
                    ...machinePayload,
                    endTime: auctionData.endTime,
                    startTime: auctionData.startTime,        // optional
                    startingPrice: Number(auctionData.startingPrice) * 100,
                    minimumIncrement: Number(auctionData.minimumIncrement) * 100,
                };

                // this will create both the machine and the auction
                const { data: { auction } } = await axiosInstance.post(
                    '/auctions',
                    payload
                );

                navigate(`/auctions/${auction._id}`);
            } else {
                const { data: machine } = await axiosInstance.post(
                    '/machinery',
                    machinePayload
                );
                navigate(`/machinery/${machine._id}`);
            }

        } catch (err) {
            console.error('Error submitting form:', err.response || err);
            setError(
                err.response?.data?.message ||
                err.response?.statusText ||
                err.message ||
                'Server error while creating listing'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container maxWidth="md" sx={{ py: 6 }}>
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
                        <FormControl fullWidth required>
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
                        <FormControl fullWidth required>
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
                                        {c.charAt(0).toUpperCase() + c.slice(1)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth required>
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

                <Grid container spacing={1}>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth required>
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
                        <FormControl fullWidth required>
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

                <FormControl fullWidth required>
                    <InputLabel id="category-label">Category</InputLabel>
                    <Select
                        labelId="category-label"
                        id="category"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        label="Category"
                        renderValue={(val) =>
                            val ? val.charAt(0).toUpperCase() + val.slice(1) : ''
                        }
                    >
                        {categories.map((cat) => (
                            <MenuItem key={cat} value={cat}>
                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth required>
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

                <FormControl fullWidth required>
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

                <Grid container spacing={1}>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth required>
                            <InputLabel htmlFor="manufacturer">Manufacturer</InputLabel>
                            <OutlinedInput
                                id="manufacturer"
                                name="manufacturer"
                                value={form.manufacturer}
                                onChange={handleChange}
                                label="Manufacturer"
                            />
                        </FormControl>
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth required>
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
                    </Grid>
                </Grid>

                <Grid container spacing={1}>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth required>
                            <InputLabel htmlFor="priceCents">Price</InputLabel>
                            <OutlinedInput
                                id="priceCents"
                                name="priceCents"
                                type="number"
                                value={form.priceCents}
                                onChange={handleChange}
                                label="Price (in cents)"
                            />
                        </FormControl>
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth required>
                            <InputLabel htmlFor="location">Location</InputLabel>
                            <OutlinedInput
                                id="location"
                                name="location"
                                value={form.location}
                                onChange={handleChange}
                                label="Location"
                            />
                        </FormControl>
                    </Grid>
                </Grid>

                {/* Image upload & preview */}
                <FormControl fullWidth required>
                    <InputLabel shrink>Images</InputLabel>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 3, my: 1, py: 1, px: 4 }}>
                        {form.images.map((url, i) => (
                            <Box key={i} sx={{ position: 'relative' }}>
                                <Box
                                    component="img"
                                    src={url}
                                    sx={{ height: 80, borderRadius: 1, objectFit: 'cover' }}
                                />
                                <IconButton
                                    size="small"
                                    onClick={() => handleRemoveImage(i)}
                                    sx={{
                                        position: 'absolute',
                                        top: 2,
                                        right: 2,
                                        bgcolor: 'rgba(0,0,0,0.6)',
                                        color: 'white',
                                        '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                                    }}
                                >
                                    <CloseIcon fontSize="small" />
                                </IconButton>
                            </Box>
                        ))}
                    </Box>
                    <Button variant="outlined" component="label" disabled={loading} sx={{ borderRadius: '999px' }}>
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

                <Grid container spacing={2}>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth>
                            <InputLabel shrink>Video File</InputLabel>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <Button
                                    variant="outlined"
                                    component="label"
                                    disabled={loading}
                                    sx={{ borderRadius: '999px', mt: 1, mr: 2 }}
                                >
                                    Upload Video
                                    <input
                                        hidden
                                        accept="video/mp4,video/quicktime,video/x-msvideo,video/*"
                                        type="file"
                                        onChange={handleVideoUpload}
                                    />
                                </Button>

                                {form.video && (
                                    <>
                                        <Link
                                            href={form.video}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            underline="hover"
                                            sx={{ fontSize: '0.875rem', mr: 1 }}
                                        >
                                            View Video
                                        </Link>
                                        <IconButton size="small" onClick={handleRemoveVideo} sx={{ color: 'error.main' }}>
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </>
                                )}
                            </Box>
                        </FormControl>
                    </Grid>
                    <Grid item size={{ xs: 12, sm: 6 }}>
                        <FormControl fullWidth required>
                            <InputLabel shrink>Original Invoice</InputLabel>
                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                <Button variant="outlined" component="label" disabled={loading} sx={{ borderRadius: '999px', mt: 1, mr: 2 }}>
                                    Upload Invoice
                                    <input
                                        hidden
                                        accept=".pdf,image/jpeg,image/png"
                                        type="file"
                                        onChange={handleInvoiceUpload}
                                    />
                                </Button>

                                {form.originalInvoice && (
                                    <>
                                        <Link
                                            href={form.originalInvoice}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            underline="hover"
                                            sx={{ fontSize: '0.875rem' }}
                                        >
                                            View Invoice
                                        </Link>
                                        <IconButton
                                            size="small"
                                            onClick={handleRemoveInvoice}
                                            sx={{ color: 'error.main' }}
                                        >
                                            <CloseIcon fontSize="small" />
                                        </IconButton>
                                    </>
                                )}
                            </Box>
                        </FormControl>
                    </Grid>
                </Grid>

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
                <Button type="submit" variant="contained" disabled={loading} sx={{ borderRadius: '999px' }}>
                    Submit
                </Button>
            </Box>
        </Container >
    );
}
