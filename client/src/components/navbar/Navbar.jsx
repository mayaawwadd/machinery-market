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
  useTheme,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';
import { useTheme as useAppTheme } from '../../context/ThemeContext';

const navItems = ['Buy', 'Sell', 'Auctions'];

function Navbar() {
  const { user, logout } = useAuth();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { mode, toggleMode } = useAppTheme();

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  const hoverColor =
    mode === 'light'
      ? theme.palette.primary[400]
      : theme.palette.primary[600];


  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center', p: 2 }}>
      <Typography variant="p" sx={{ my: 2, fontWeight: 600 }}>
        .MACHINERY MARKET
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton
              component={Link}
              to={`machinery/${item.toLowerCase()}`}>
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
        <Divider />
        {!user && (
          <>
            <ListItem>
              <Button
                component={Link}
                to="/login"
                variant="contained"
                fullWidth
                size="small"
                sx={{ borderRadius: '999px', fontWeight: 'bold' }}
              >
                Login
              </Button>
            </ListItem>

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
        color='transparent'
        sx={{
          backgroundColor: theme.palette.background.default,
          border: 'none',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
          color: theme.palette.text.primary,
        }}
        component="nav"
      >
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Typography
                variant="p"
                sx={{
                  fontWeight: 700,
                  mt: 2,
                  mb: 1,
                  color: theme.palette.text.primary,
                }}
              >
                .MACHINERY MARKET
              </Typography>
            </Link>

          </Box>

          {/* Center: Links (Hidden on xs) */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 4 }}>
            {navItems.map((item) => (
              <Typography
                key={item}
                variant="button"
                component={Link}
                to={`machinery/${item.toLowerCase()}`}
                sx={{
                  cursor: 'pointer',
                  textDecoration: 'none',
                  color: 'inherit',
                  '&:hover': { color: hoverColor }
                }}
              >
                {item}
              </Typography>
            ))}
          </Box>

          {/* Right: Theme toggle + Auth-related */}
          <Stack direction="row" spacing={1} alignItems="center">
            <IconButton
              onClick={toggleMode}
              size="small"
              color="inherit"
            >
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>

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
                      display: { xs: 'none', md: 'inline' }, // Hide username on mobile
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
                sx={{ display: { xs: 'none', md: 'flex' } }}
              >
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  size='small'
                  sx={{ borderRadius: '999px', fontWeight: 'bold' }}
                >
                  Login
                </Button>
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
              sx={{ display: { md: 'none' }, mr: 2 }}
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
                sx={{ display: { xs: 'inline', md: 'none' } }}
              >
                {user?.username}
              </Typography>
            </MenuItem>

            <MenuItem onClick={handleMenuClose} component={Link} to="/profile">
              <PersonIcon fontSize="small" sx={{ mr: 1 }} />
              View Profile
            </MenuItem>
            <MenuItem onClick={() => {
              toast.info('You will be able to view notifications soon!');
              handleMenuClose();
            }
            }>
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
      </AppBar >

      {/* Responsive Drawer for Mobile */}
      < Box component="nav" >
        <Drawer
          anchor="right"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
          }}
        >
          {drawer}
        </Drawer>
      </Box >

      {/* Push content below the AppBar */}
      < Toolbar />
    </>
  );
}

export default Navbar;
