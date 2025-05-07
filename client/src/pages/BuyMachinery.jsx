import React, { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardMedia,
    CardContent,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormGroup,
    FormControlLabel,
    Slider,
} from '@mui/material';

// Sample placeholder listings
const machineryData = [
    {
        id: 1,
        name: 'CNC Milling Machine',
        price: 12000,
        image: 'https://via.placeholder.com/400x200?text=CNC+Milling',
        condition: 'Used',
    },
    {
        id: 2,
        name: 'Packaging Conveyor',
        price: 8000,
        image: 'https://via.placeholder.com/400x200?text=Packaging+Machine',
        condition: 'New',
    },
    {
        id: 3,
        name: 'Diesel Generator 50kVA',
        price: 10000,
        image: 'https://via.placeholder.com/400x200?text=Generator',
        condition: 'Used',
    },
];

function BuyPage() {
    const [sortOption, setSortOption] = useState('');
    const [priceRange, setPriceRange] = useState([0, 20000]);

    const handleSortChange = (e) => {
        setSortOption(e.target.value);
    };

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            <Typography variant="h4" fontWeight={700} gutterBottom>
                Browse Machinery
            </Typography>

            <Grid container spacing={4}>
                {/* Filter Sidebar */}
                <Grid item xs={12} md={3}>
                    <Box sx={{ border: '1px solid #eee', borderRadius: 2, p: 2 }}>
                        <Typography variant="h6" gutterBottom>
                            Filters
                        </Typography>

                        <Typography variant="subtitle2" gutterBottom>
                            Category
                        </Typography>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox />} label="CNC" />
                            <FormControlLabel control={<Checkbox />} label="Packaging" />
                            <FormControlLabel control={<Checkbox />} label="Generators" />
                            <FormControlLabel control={<Checkbox />} label="Construction" />
                        </FormGroup>

                        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                            Condition
                        </Typography>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox />} label="New" />
                            <FormControlLabel control={<Checkbox />} label="Used" />
                        </FormGroup>

                        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                            Price Range
                        </Typography>
                        <Slider
                            value={priceRange}
                            onChange={(e, newValue) => setPriceRange(newValue)}
                            valueLabelDisplay="auto"
                            min={0}
                            max={20000}
                        />
                    </Box>
                </Grid>

                {/* Listings Area */}
                <Grid item xs={12} md={9}>
                    {/* Sort Dropdown */}
                    <FormControl sx={{ mb: 3, minWidth: 200 }} size="small">
                        <InputLabel>Sort By</InputLabel>
                        <Select value={sortOption} onChange={handleSortChange} label="Sort By">
                            <MenuItem value="">Default</MenuItem>
                            <MenuItem value="priceAsc">Price: Low to High</MenuItem>
                            <MenuItem value="priceDesc">Price: High to Low</MenuItem>
                            <MenuItem value="newest">Newest Listings</MenuItem>
                        </Select>
                    </FormControl>

                    {/* Machinery Grid */}
                    <Grid container spacing={3}>
                        {machineryData.map((item) => (
                            <Grid item xs={12} sm={6} md={4} key={item.id}>
                                <Card sx={{ borderRadius: 3 }}>
                                    <CardMedia
                                        component="img"
                                        height="140"
                                        image={item.image}
                                        alt={item.name}
                                        sx={{ objectFit: 'cover' }}
                                    />
                                    <CardContent>
                                        <Typography variant="h6">{item.name}</Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            {item.condition} • ${item.price.toLocaleString()}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                </Grid>
            </Grid>
        </Container>
    );
}

export default BuyPage;
