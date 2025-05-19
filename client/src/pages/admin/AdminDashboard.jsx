import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
    Box,
    Container,
    Grid,
    List,
    ListItemButton,
    ListItemText,
    Typography,
    Divider,
    useTheme,
    useMediaQuery,
    IconButton,
    Drawer,
    Card,
    CardContent,
    CircularProgress,
    TableContainer,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Paper,
    Alert,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import axiosInstance from '../../services/axiosInstance';

const sidebarWidth = 240;
const navItems = [
    { label: 'Dashboard', key: 'home', path: '/admin' },
    { label: 'Users', key: 'users', path: '/admin/users' },
    { label: 'Listings', key: 'listings', path: '/admin/listings' },
    { label: 'Transactions', key: 'transactions', path: '/admin/transactions' },
    { label: 'Reviews', key: 'reviews', path: '/admin/reviews' },
];

export default function AdminDashboard() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [section, setSection] = useState('home');

    // Metrics
    const [metrics, setMetrics] = useState({ users: 0, listings: 0, transactions: 0, reviews: 0, flaggedReviews: 0 });
    const [loadingMetrics, setLoadingMetrics] = useState(true);
    const [error, setError] = useState('');

    // Table data
    const [data, setData] = useState([]);
    const [loadingData, setLoadingData] = useState(false);

    const toggleDrawer = () => setDrawerOpen(!drawerOpen);

    useEffect(() => {
        const fetchMetrics = async () => {
            try {
                const [uRes, lRes, tRes, rRes] = await Promise.all([
                    axiosInstance.get('/users'),
                    axiosInstance.get('/machinery'),
                    axiosInstance.get('/transactions'),
                    axiosInstance.get('/reviews'),
                ]);
                setMetrics({
                    users: uRes.data.length,
                    listings: lRes.data.length,
                    transactions: tRes.data.length,
                    reviews: rRes.data.length,
                    flaggedReviews: rRes.data.filter(r => r.isFlagged).length,
                });
            } catch (err) {
                console.error(err);
                setError('Failed to load metrics');
            } finally {
                setLoadingMetrics(false);
            }
        };
        fetchMetrics();
    }, []);

    useEffect(() => {
        if (section === 'home') return;
        const fetchData = async () => {
            setLoadingData(true);
            try {
                let res;
                switch (section) {
                    case 'users':
                        res = await axiosInstance.get('/users');
                        break;
                    case 'listings':
                        res = await axiosInstance.get('/machinery');
                        break;
                    case 'transactions':
                        res = await axiosInstance.get('/transactions');
                        break;
                    case 'reviews':
                        res = await axiosInstance.get('/reviews');
                        break;
                    default:
                        res = { data: [] };
                }
                setData(res.data);
            } catch (err) {
                console.error(err);
                setError(`Failed to load ${section}`);
            } finally {
                setLoadingData(false);
            }
        };
        fetchData();
    }, [section]);

    const renderSidebar = () => (
        <Box sx={{ width: sidebarWidth, p: 2 }}>
            <Typography variant="h6" gutterBottom>Admin</Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
                {navItems.map(({ label, key, path }) => (
                    <ListItemButton
                        key={key}
                        component={NavLink}      // ← NavLink will update URL
                        to={path}                // ← e.g. '/admin/users'
                        end
                        selected={section === key}
                        onClick={() => {
                            setSection(key);
                            if (isMobile) toggleDrawer();
                        }}
                        sx={{
                            mb: 1,
                            borderRadius: 1,
                            '&.Mui-selected': { bgcolor: 'action.selected' },
                        }}
                    >
                        <ListItemText primary={label} />
                    </ListItemButton>
                ))}
            </List>
        </Box>
    );


    const renderContent = () => {
        if (section === 'home') {
            if (loadingMetrics) return <CircularProgress />;
            if (error) return <Alert severity="error">{error}</Alert>;
            return (
                <Grid container spacing={2}>
                    {['users', 'listings', 'transactions', 'reviews'].map((key, i) => (
                        <Grid item xs={12} sm={6} md={3} key={key}>
                            <Card>
                                <CardContent>
                                    <Typography sx={{ mb: 1 }}>
                                        {key.charAt(0).toUpperCase() + key.slice(1)}
                                    </Typography>
                                    <Typography variant="h5">
                                        {key === 'reviews'
                                            ? `${metrics.flaggedReviews}/${metrics.reviews}`
                                            : metrics[key]}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            );
        }

        const columns = {
            users: ['Username', 'Email', 'Role', 'Created At'],
            listings: ['Title', 'Seller', 'Price', 'Auction'],
            transactions: ['ID', 'Buyer', 'Item', 'Amount', 'Status'],
            reviews: ['Buyer', 'Seller', 'Rating', 'Comment', 'Flagged'],
        };

        return (
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            {columns[section].map(col => (
                                <TableCell key={col}>{col}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loadingData ? (
                            <TableRow>
                                <TableCell colSpan={columns[section].length}>
                                    <CircularProgress />
                                </TableCell>
                            </TableRow>
                        ) : data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={columns[section].length}>
                                    No data available.
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map(item => (
                                <TableRow key={item._id || item.id} hover>
                                    {section === 'users' && (
                                        <>
                                            <TableCell>{item.username}</TableCell>
                                            <TableCell>{item.email}</TableCell>
                                            <TableCell>{item.role}</TableCell>
                                            <TableCell>{new Date(item.createdAt).toLocaleDateString()}</TableCell>
                                        </>
                                    )}
                                    {section === 'listings' && (
                                        <>
                                            <TableCell>{item.title}</TableCell>
                                            <TableCell>{item.seller.username}</TableCell>
                                            <TableCell>{(item.priceCents / 100).toLocaleString()} JOD</TableCell>
                                            <TableCell>{item.isAuction ? 'Yes' : 'No'}</TableCell>
                                        </>
                                    )}
                                    {section === 'transactions' && (
                                        <>
                                            <TableCell>{item._id}</TableCell>
                                            <TableCell>{item.buyer.username}</TableCell>
                                            <TableCell>{item.machinery.title}</TableCell>
                                            <TableCell>{(item.amountCents / 100).toLocaleString()} {item.currency}</TableCell>
                                            <TableCell>{item.paymentStatus}</TableCell>
                                        </>
                                    )}
                                    {section === 'reviews' && (
                                        <>
                                            <TableCell>{item.buyer.username}</TableCell>
                                            <TableCell>{item.seller.username}</TableCell>
                                            <TableCell>{item.rating}</TableCell>
                                            <TableCell>{item.comment}</TableCell>
                                            <TableCell>{item.isFlagged ? 'Yes' : 'No'}</TableCell>
                                        </>
                                    )}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        );
    };

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4" fontWeight={700}>
                    Admin Dashboard
                </Typography>
                {isMobile && (
                    <IconButton onClick={toggleDrawer}>
                        <MenuIcon />
                    </IconButton>
                )}
            </Box>

            {/* Main Grid */}
            <Grid container spacing={4} wrap={isMobile ? 'wrap' : 'nowrap'} sx={{ alignItems: 'flex-start' }}>
                {/* Sidebar */}
                {!isMobile ? (
                    <Grid item xs={12} md={3}>
                        <Box sx={{ border: '1px solid #eee', borderRadius: 2 }}>
                            {renderSidebar()}
                        </Box>
                    </Grid>
                ) : (
                    <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
                        {renderSidebar()}
                    </Drawer>
                )}

                {/* Content */}
                <Grid item xs={12} md={9}>
                    {renderContent()}
                </Grid>
            </Grid>
        </Container>
    );
}
