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
import PersonIcon from '@mui/icons-material/Person';
import ListAltIcon from '@mui/icons-material/ListAlt';
import ReceiptIcon from '@mui/icons-material/Receipt';

const sidebarWidth = 240;

export default function ProfileLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [open, setOpen] = React.useState(false);
  const toggleDrawer = () => setOpen(!open);

  const navItems = [
    { label: 'My Profile', icon: <PersonIcon />, path: '/profile' },
    { label: 'My Listings', icon: <ListAltIcon />, path: '/profile/listings' },
    { label: 'My Transactions', icon: <ReceiptIcon />, path: '/profile/transactions' },
  ];

  const renderSidebar = () => (
    <Box sx={{ width: sidebarWidth, p: 2 }}>
      <Typography variant="h6" gutterBottom>
        Account
      </Typography>
      <Divider sx={{ mb: 2 }} />
      <List>
        {navItems.map(({ label, icon, path }) => (
          <ListItemButton
            key={path}
            component={NavLink}
            to={path}
            end                            // ← add this!
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
          Account
        </Typography>
        {isMobile && (
          <IconButton onClick={toggleDrawer}>
            <MenuIcon />
          </IconButton>
        )}
      </Box>

      {/* Main Grid */}
      <Grid
        container
        spacing={4}
        wrap={isMobile ? 'wrap' : 'nowrap'}
        sx={{ alignItems: 'flex-start' }}
      >
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
