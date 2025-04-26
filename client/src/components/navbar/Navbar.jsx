import * as React from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  MenuItem,
  Menu,
  Avatar,
  Tooltip,
  Stack,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

const navItems = ['Buy', 'Sell', 'Auctions'];

function Navbar() {
  const { user, logout } = useAuth();
  const [mode, setMode] = React.useState('light');
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const toggleMode = () =>
    setMode((prev) => (prev === 'light' ? 'dark' : 'light'));
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', p: 2 }}>
      <Typography variant="p" sx={{ my: 2, fontWeight: 600 }}>
        .MACHINERY MARKET
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider />
        {!user && (
          <>
            <ListItemButton component={Link} to="/login">
              <ListItemText primary="Login" />
            </ListItemButton>
            {/* <ListItemButton component={Link} to="/register">
              <ListItemText primary="Register" />
            </ListItemButton> */}
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: 'white',
          border: 'none',
          boxShadow: 'none',
          color: '#292738',
        }}
        component="nav"
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="p" noWrap sx={{ fontWeight: 600 }}>
              .MACHINERY MARKET
            </Typography>
          </Box>

          {/* Center: Links (Hidden on xs) */}
          <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 4 }}>
            {navItems.map((item) => (
              <Typography
                key={item}
                variant="button"
                sx={{ cursor: 'pointer' }}
              >
                {item}
              </Typography>
            ))}
          </Box>

          {/* Right: Theme toggle + Auth-related */}
          <Stack direction="row" spacing={2} alignItems="center">
            {user ? (
              <Tooltip title="Account settings">
                <Button
                  onClick={handleMenuOpen}
                  sx={{
                    textTransform: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    color: 'inherit',
                    padding: 1,
                    '&:hover': {
                      backgroundColor: 'transparent',
                      opacity: 0.85,
                    },
                  }}
                >
                  <Avatar
                    alt={user.username}
                    src={user.profileImage || '/public/images/default.png'}
                    sx={{ height: 32, width: 32 }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      display: { xs: 'none', sm: 'inline' }, // Hide username on mobile
                    }}
                  >
                    {user.username}
                  </Typography>
                </Button>
              </Tooltip>
            ) : (
              <Stack
                direction="row"
                spacing={2}
                sx={{ display: { xs: 'none', sm: 'flex' } }}
              >
                <Typography
                  component={Link}
                  to="/login"
                  variant="button"
                  sx={{ textDecoration: 'none', color: 'inherit' }}
                >
                  Login
                </Typography>
                {/* <Typography
                  component={Link}
                  to="/register"
                  variant="button"
                  sx={{ textDecoration: 'none', color: 'inherit' }}
                >
                  Register
                </Typography> */}
              </Stack>
            )}

            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ display: { sm: 'none' }, mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          </Stack>

          {/* Avatar Menu */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem disabled>
              <Typography
                variant="subtitle1"
                sx={{ display: { xs: 'inline', sm: 'none' } }}
              >
                {user?.username}
              </Typography>
            </MenuItem>
            <MenuItem
              onClick={() => {
                toggleMode();
                handleMenuClose();
              }}
            >
              {mode === 'light' ? (
                <>
                  <DarkModeIcon fontSize="small" sx={{ mr: 1 }} />
                  Dark Mode
                </>
              ) : (
                <>
                  <LightModeIcon fontSize="small" sx={{ mr: 1 }} />
                  Light Mode
                </>
              )}
            </MenuItem>

            <MenuItem onClick={handleMenuClose}>
              <PersonIcon fontSize="small" sx={{ mr: 1 }} />
              View Profile
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <NotificationsIcon fontSize="small" sx={{ mr: 1 }} />
              Notifications
            </MenuItem>
            <MenuItem
              onClick={() => {
                logout();
                handleMenuClose();
              }}
            >
              <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Responsive Drawer for Mobile */}
      <Box component="nav">
        <Drawer
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Push content below the AppBar */}
      <Toolbar />
    </>
  );
}

export default Navbar;
