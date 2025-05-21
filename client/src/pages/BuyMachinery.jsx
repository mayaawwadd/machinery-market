import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import {
    Tooltip,
    Box,
    Container,
    Typography,
    Grid,
    Card,
    CardActionArea,
    CardMedia,
    CardContent,
    Chip,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Checkbox,
    FormGroup,
    FormControlLabel,
    Slider,
    CircularProgress,
    useTheme,
    useMediaQuery,
    Drawer,
    IconButton,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import axios from 'axios';
import useDebounce from '../hooks/useDebounce';
import { useTheme as useAppTheme } from '../context/ThemeContext';

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
    const [loading, setLoading] = useState(false);
    const [hydrated, setHydrated] = useState(false);
    const [initialFetchDone, setInitialFetchDone] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const toggleFilter = () => setFilterOpen((prev) => !prev);

    const debouncedFilters = useDebounce(filters, 400);
    const debouncedSort = useDebounce(sortOption, 400);
    const navigate = useNavigate();
    const theme = useTheme();
    const { mode } = useAppTheme();
    const color = mode === 'light' ? theme.palette.secondary.main : theme.default;
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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
    }, [setSearchParams]);

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
    }, [filters, sortOption]);

    useEffect(() => {
        const hoursMin = Number(searchParams.get('hoursMin')) || 0;
        const hoursMax = Number(searchParams.get('hoursMax')) || 10000;
        const priceMin = Number(searchParams.get('priceMin')) || 0;
        const priceMax = Number(searchParams.get('priceMax')) || 200000;
        const category = searchParams.getAll('category');
        const condition = searchParams.getAll('condition');
        const sort = searchParams.get('sort') || '';

        setFilters({ hoursMin, hoursMax, priceMin, priceMax, category, condition });
        setSortOption(sort);
        setPriceRange([priceMin, priceMax]);
        setHydrated(true);
    }, []);

    useEffect(() => {
        if (!hydrated) return;
        if (!initialFetchDone) {
            setInitialFetchDone(true);
            return;
        }

        updateSearchParams(debouncedFilters, debouncedSort);
        fetchListings(debouncedFilters, debouncedSort);
    }, [debouncedFilters, debouncedSort, hydrated]);

    const handleSortChange = (e) => setSortOption(e.target.value);

    const handleCategoryChange = (event) => {
        const value = event.target.name;
        const updatedCategories = filters.category.includes(value)
            ? filters.category.filter((c) => c !== value)
            : [...filters.category, value];
        setFilters({ ...filters, category: updatedCategories });
    };

    const handleConditionChange = (event) => {
        const value = event.target.name;
        const updatedCondition = filters.condition.includes(value)
            ? filters.condition.filter((c) => c !== value)
            : [...filters.condition, value];
        setFilters({ ...filters, condition: updatedCondition });
    };

    const handlePriceRangeChange = (e, newValue) => {
        setPriceRange(newValue);
        setFilters({ ...filters, priceMin: newValue[0], priceMax: newValue[1] });
    };

    const handleUsedHoursChange = (e, newValue) => {
        setFilters({ ...filters, hoursMin: newValue[0], hoursMax: newValue[1] });
    };

    const isFilterApplied = () =>
        filters.category.length > 0 ||
        filters.condition.length > 0 ||
        filters.hoursMin > 0 ||
        filters.hoursMax < 10000 ||
        filters.priceMin > 0 ||
        filters.priceMax < 200000;

    const renderFilters = () => (
        <Box sx={{ p: 2, width: isMobile ? 280 : '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" gutterBottom>Filters</Typography>
                {isMobile && (
                    <IconButton onClick={toggleFilter}><CloseIcon /></IconButton>
                )}
            </Box>

            <Typography variant="subtitle2">Category</Typography>
            <FormGroup>
                {['industrial', 'agricultural', 'construction', 'medical', 'other'].map((cat) => (
                    <FormControlLabel
                        key={cat}
                        control={<Checkbox name={cat} checked={filters.category.includes(cat)} onChange={handleCategoryChange} />}
                        label={cat.charAt(0).toUpperCase() + cat.slice(1)}
                    />
                ))}
            </FormGroup>

            <Typography variant="subtitle2" sx={{ mt: 2 }}>Condition</Typography>
            <FormGroup>
                {['new', 'used', 'refurbished'].map((cond) => (
                    <FormControlLabel
                        key={cond}
                        control={<Checkbox name={cond} checked={filters.condition.includes(cond)} onChange={handleConditionChange} />}
                        label={cond.charAt(0).toUpperCase() + cond.slice(1)}
                    />
                ))}
            </FormGroup>

            <Typography variant="subtitle2" sx={{ mt: 2 }}>Price Range</Typography>
            <Slider
                value={priceRange}
                onChange={handlePriceRangeChange}
                valueLabelDisplay="auto"
                min={0}
                max={200000}
            />

            <Typography variant="subtitle2" sx={{ mt: 2 }}>Used Hours</Typography>
            <Slider
                value={[filters.hoursMin, filters.hoursMax]}
                onChange={handleUsedHoursChange}
                valueLabelDisplay="auto"
                min={0}
                max={10000}
                step={100}
            />
        </Box>
    );

    return (
        // TOP LEVEL CONTAINER (CONTAINS HEADER AND GRID)
        <Container maxWidth="lg" sx={{ py: 6 }}>
            {/* Header Section */}
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'row', md: 'column' },
                justifyContent: 'space-between',
                alignItems: { xs: 'center', md: 'flex-start' },
                mb: 3,
            }}>
                <Typography variant="h4" fontWeight={700} gutterBottom>Browse Machinery</Typography>

                {isMobile && (
                    <Box sx={{ mt: { xs: 0, md: 2 } }}>
                        <button
                            onClick={toggleFilter}
                            style={{
                                padding: '8px 16px',
                                backgroundColor: theme.palette.primary.main,
                                color: '#fff',
                                border: 'none',
                                borderRadius: '999px',
                                fontWeight: 500,
                                cursor: 'pointer',
                            }}
                        >
                            Filters
                        </button>
                    </Box>
                )}
            </Box>

            {/* Main Grid */}
            <Grid container spacing={4} wrap={isMobile ? 'wrap' : 'noWrap'} sx={{ alignItems: 'flex-start' }}>
                {/* Filters Pane */}
                {!isMobile ? (
                    <Grid item xs={12} md={3}>
                        <Box sx={{ border: '1px solid #eee', borderRadius: 2, width: 'fit-content', mr: 10 }}>
                            {renderFilters()}
                        </Box>
                    </Grid>
                ) : (
                    // Togglable Drawer for Mobile Screens
                    <Drawer anchor="right" open={filterOpen} onClose={toggleFilter}>
                        {renderFilters()}
                    </Drawer>
                )}

                {/* Listings */}
                <Grid item xs={12} md={9} minHeight={'calc(100vh - 10rem)'}>
                    <FormControl sx={{ mb: 3, minWidth: 200 }} size="small">
                        <InputLabel>Sort By</InputLabel>
                        <Select value={sortOption} onChange={handleSortChange} label="Sort By">
                            <MenuItem value="">Default</MenuItem>
                            <MenuItem value="priceAsc">Price: Low to High</MenuItem>
                            <MenuItem value="priceDesc">Price: High to Low</MenuItem>
                            <MenuItem value="newest">Newest Listings</MenuItem>
                        </Select>
                    </FormControl>

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
                        <Grid container spacing={3} sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-start' } }}>
                            {listings.map((item) => (
                                <Grid item xs={12} sm={6} md={4} key={item._id} sx={{ display: 'flex' }}>
                                    <Card
                                        component={RouterLink}
                                        to={`/machinery/${item._id}`}
                                        sx={{
                                            borderRadius: 3,
                                            flex: 1,
                                            textDecoration: 'none',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            width: '18rem',

                                            boxShadow: 1,
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-1px)',
                                                boxShadow: 2,
                                            },
                                        }} >

                                        <CardMedia
                                            component="img"
                                            height="160"
                                            image={item.images?.[0]}
                                            alt={item.title}
                                            sx={{ objectFit: 'cover' }}
                                        />
                                        <CardContent sx={{ flexGrow: 1 }}>
                                            <Tooltip title={item.title}>
                                                <Typography variant="h6" fontWeight={600} gutterBottom noWrap>{item.title}</Typography>
                                            </Tooltip>
                                            <Box sx={{ mb: 1, display: 'flex', justifyContent: 'space-between' }}>
                                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                                    {item.condition.charAt(0).toUpperCase() + item.condition.slice(1)} • {item.usedHours.toLocaleString()} hrs
                                                </Typography>
                                                <Chip label={item.category} size="small" sx={{ textTransform: 'capitalize', backgroundColor: color }} />
                                            </Box>
                                            <Typography variant="body1" fontWeight={400}>
                                                {new Intl.NumberFormat('en-JO', {
                                                    style: 'currency',
                                                    currency: 'JOD',
                                                }).format(item.priceCents / 100)}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Grid>
            </Grid>
        </Container >
    );
}

export default BuyMachinery;