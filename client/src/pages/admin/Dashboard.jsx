import React from 'react';
import { Outlet, NavLink, Routes, Route } from 'react-router-dom';
import { adminRoutes } from './routes';
import { Box, Drawer, List, ListItemButton, ListItemText, Toolbar } from '@mui/material';

export default function Dashboard() {
    return (
        <Box sx={{ display: 'flex' }}>
            <Drawer variant="permanent" anchor="left">
                <Toolbar />
                <List>
                    {adminRoutes.map((route) => (
                        <ListItemButton
                            key={route.path}
                            component={NavLink}
                            to={route.path}
                            sx={{ textTransform: 'capitalize' }}
                        >
                            <ListItemText primary={route.label} />
                        </ListItemButton>
                    ))}
                </List>
            </Drawer>

            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <Routes>
                    {adminRoutes.map((route) => (
                        <Route key={route.path} path={route.path} element={route.element} />
                    ))}
                </Routes>
            </Box>
        </Box>
    );
}
