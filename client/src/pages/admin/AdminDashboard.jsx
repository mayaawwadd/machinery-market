import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import {
    Box,
    Grid,
    Container,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    useTheme,
    useMediaQuery,
    IconButton,
    Drawer,
    Typography,
    Divider,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import InventoryIcon from '@mui/icons-material/Inventory';
import GavelIcon from '@mui/icons-material/Gavel';
import PaymentIcon from '@mui/icons-material/Payment';
import ReviewsIcon from '@mui/icons-material/Reviews';

const sidebarWidth = 240;

export default function AdminDashboard() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [open, setOpen] = React.useState(false);
    const toggleDrawer = () => setOpen(!open);

    const navItems = [
        { label: 'Overview', icon: <DashboardIcon />, path: '/admin' },
        { label: 'Users', icon: <PeopleIcon />, path: '/admin/users' },
        { label: 'Machines', icon: <InventoryIcon />, path: '/admin/machines' },
        { label: 'Auctions', icon: <GavelIcon />, path: '/admin/auctions' },
        { label: 'Transactions', icon: <PaymentIcon />, path: '/admin/transactions' },
        { label: 'Reviews', icon: <ReviewsIcon />, path: '/admin/reviews' },
    ];

    const renderSidebar = () => (
        <Box sx={{ width: sidebarWidth, p: 2 }}>
            <Typography variant="h6" gutterBottom>
                Admin Panel
            </Typography>
            <Divider sx={{ mb: 2 }} />
            <List>
                {navItems.map(({ label, icon, path }) => (
                    <ListItemButton
                        key={path}
                        component={NavLink}
                        to={path}
                        end
                        sx={{
                            mb: 1,
                            borderRadius: 1,
                            '&.active': { bgcolor: 'action.selected' },
                        }}
                    >
                        <ListItemIcon>{icon}</ListItemIcon>
                        <ListItemText primary={label} />
                    </ListItemButton>
                ))}
            </List>
        </Box>
    );

    return (
        <Container maxWidth="lg" sx={{ py: 6 }}>
            {/* Header */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mb: 3,
                }}
            >
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
            <Grid container spacing={3} wrap={isMobile ? 'wrap' : 'nowrap'} sx={{ alignItems: 'flex-start' }}>
                {/* Sidebar */}
                {!isMobile ? (
                    <Grid item xs={12} md={3}>
                        <Box sx={{ border: '1px solid #eee', borderRadius: 2 }}>
                            {renderSidebar()}
                        </Box>
                    </Grid>
                ) : (
                    <Drawer anchor="left" open={open} onClose={toggleDrawer}>
                        {renderSidebar()}
                    </Drawer>
                )}

                {/* Content */}
                <Grid item xs={12} md={9}>
                    <Outlet />
                </Grid>
            </Grid>
        </Container>
    );
}
