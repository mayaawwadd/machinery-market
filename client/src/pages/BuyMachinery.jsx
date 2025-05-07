import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
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
    CircularProgress
} from '@mui/material';
import axios from 'axios';
import useDebounce from '../hooks/useDebounce';

function BuyMachinery() {
    const [listings, setListings] = useState([]);
    const [sortOption, setSortOption] = useState('');
    const [priceRange, setPriceRange] = useState([0, 20000]);
    const [filters, setFilters] = useState({
        hoursMin: 0,
        hoursMax: 10000,
        priceMin: 0,
        priceMax: 200000,
        category: [],
        condition: [],
    });

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [hydrated, setHydrated] = useState(false);
    const [initialFetchDone, setInitialFetchDone] = useState(false);
    const debouncedFilters = useDebounce(filters, 400);
    const debouncedSort = useDebounce(sortOption, 400);

    const updateSearchParams = useCallback((newFilters, newSort) => {
        const params = new URLSearchParams();

        if (newSort) params.set('sort', newSort);

        params.set('hoursMin', newFilters.hoursMin);
        params.set('hoursMax', newFilters.hoursMax);
        params.set('priceMin', newFilters.priceMin);
        params.set('priceMax', newFilters.priceMax);

        newFilters.category.forEach((c) => params.append('category', c));
        newFilters.condition.forEach((c) => params.append('condition', c));

        setSearchParams(params);
    });


    const fetchListings = useCallback(async (filterParams = filters, sort = sortOption) => {
        try {
            setLoading(true);
            const params = new URLSearchParams();

            if (sort) params.set('sort', sort);
            params.set('hoursMin', filterParams.hoursMin);
            params.set('hoursMax', filterParams.hoursMax);
            params.set('priceMin', filterParams.priceMin);
            params.set('priceMax', filterParams.priceMax);
            filterParams.category.forEach((c) => params.append('category', c));
            filterParams.condition.forEach((c) => params.append('condition', c));

            const res = await axios.get(`/api/machinery?${params.toString()}`);
            setListings(res.data);
        } catch (err) {
            console.error('Failed to fetch listings', err);
        } finally {
            setLoading(false);
        }
    });


    useEffect(() => {
        const hoursMin = Number(searchParams.get('hoursMin')) || 0;
        const hoursMax = Number(searchParams.get('hoursMax')) || 10000;
        const priceMin = Number(searchParams.get('priceMin')) || 0;
        const priceMax = Number(searchParams.get('priceMax')) || 200000;
        const category = searchParams.getAll('category');
        const condition = searchParams.getAll('condition');
        const sort = searchParams.get('sort') || '';

        setFilters({
            hoursMin,
            hoursMax,
            priceMin,
            priceMax,
            category,
            condition,
        });

        setSortOption(sort);
        setPriceRange([priceMin, priceMax]);

        // Mark hydration as complete
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (!hydrated) return; // Skip until filters are hydrated

        if (!initialFetchDone) {
            setInitialFetchDone(true); // Skip first run
            return;
        }

        updateSearchParams(debouncedFilters, debouncedSort);
        fetchListings(debouncedFilters, debouncedSort);
    }, [debouncedFilters, debouncedSort, hydrated]);



    const handleSortChange = (e) => {
        const value = e.target.value;
        setSortOption(value);
    };


    const handleCategoryChange = (event) => {
        const value = event.target.name;
        const updatedCategories = filters.category.includes(value)
            ? filters.category.filter((c) => c !== value)
            : [...filters.category, value];

        const updatedFilters = { ...filters, category: updatedCategories };
        setFilters(updatedFilters);
    };

    const handleConditionChange = (event) => {
        const value = event.target.name;
        const updatedCondition = filters.condition.includes(value)
            ? filters.condition.filter((c) => c !== value)
            : [...filters.condition, value];

        const updatedFilters = { ...filters, condition: updatedCondition };
        setFilters(updatedFilters);
    };

    const handlePriceRangeChange = (e, newValue) => {
        setPriceRange(newValue);
        const updatedFilters = {
            ...filters,
            priceMin: newValue[0],
            priceMax: newValue[1],
        };
        setFilters(updatedFilters);
    };


    const handleUsedHoursChange = (e, newValue) => {
        const updatedFilters = {
            ...filters,
            hoursMin: newValue[0],
            hoursMax: newValue[1],
        };
        setFilters(updatedFilters);
    };

    const isFilterApplied = () => {
        return (
            filters.category.length > 0 ||
            filters.condition.length > 0 ||
            filters.hoursMin > 0 ||
            filters.hoursMax < 10000 ||
            filters.priceMin > 0 ||
            filters.priceMax < 200000
        );
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
                            {['industrial', 'agricultural', 'construction', 'medical', 'other'].map((cat) => (
                                <FormControlLabel
                                    key={cat}
                                    control={
                                        <Checkbox
                                            name={cat}
                                            checked={filters.category.includes(cat)}
                                            onChange={handleCategoryChange}
                                        />
                                    }
                                    label={cat.charAt(0).toUpperCase() + cat.slice(1)}
                                />
                            ))}
                        </FormGroup>

                        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                            Condition
                        </Typography>
                        <FormGroup>
                            {['new', 'used', 'refurbished'].map((cond) => (
                                <FormControlLabel
                                    key={cond}
                                    control={
                                        <Checkbox
                                            name={cond}
                                            checked={filters.condition.includes(cond)}
                                            onChange={handleConditionChange}
                                        />
                                    }
                                    label={cond.charAt(0).toUpperCase() + cond.slice(1)}
                                />
                            ))}
                        </FormGroup>


                        {/* <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                            Condition
                        </Typography>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox />} label="New" />
                            <FormControlLabel control={<Checkbox />} label="Used" />
                        </FormGroup> */}

                        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                            Price Range
                        </Typography>
                        <Slider
                            value={priceRange}
                            onChange={handlePriceRangeChange}
                            valueLabelDisplay="auto"
                            min={0}
                            max={20000}
                        />

                        <Typography variant="subtitle2" gutterBottom sx={{ mt: 2 }}>
                            Used Hours
                        </Typography>
                        <Slider
                            value={[filters.hoursMin, filters.hoursMax]}
                            onChange={handleUsedHoursChange}
                            valueLabelDisplay="auto"
                            min={0}
                            max={10000}
                            step={100}
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
                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                            <CircularProgress />
                        </Box>
                    ) : listings.length === 0 ? (
                        <Typography variant="body1">
                            {isFilterApplied()
                                ? 'No machinery listings found based on your filters.'
                                : 'No machinery listings found.'}
                        </Typography>
                    ) : (
                        <Grid container spacing={3}>
                            {listings.map((item) => (
                                <Grid item xs={12} md={4} key={item._id}>
                                    <Card sx={{ borderRadius: 3 }}>
                                        <CardMedia
                                            component="img"
                                            height="140"
                                            image={item.images?.[0]}
                                            alt={item.title}
                                            sx={{ objectFit: 'cover' }}
                                        />
                                        <CardContent>
                                            <Typography variant="h6">{item.title}</Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                {item.condition} • ${(item.priceCents / 100).toLocaleString()}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}

                </Grid>
            </Grid>
        </Container>
    );
}

export default BuyMachinery;
