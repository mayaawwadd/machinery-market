import React, { useEffect, useState } from 'react';
import {
    Box,
    Avatar,
    Typography,
    IconButton,
    Snackbar,
    Alert,
    CircularProgress,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Divider,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import Rating from '@mui/material/Rating';
import axiosInstance from '../../services/axiosInstance';
import { useAuth } from '../../context/AuthContext';

export default function MyProfile() {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ open: false, message: '' });

    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch profile
                const { data: profileData } = await axiosInstance.get('/users/profile');
                setProfile(profileData);
                // Fetch reviews for this user
                const { data: reviewsData } = await axiosInstance.get(
                    `/reviews/seller/${profileData._id}`
                );
                setReviews(reviewsData);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
                setReviewsLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleEditClick = () => {
        setToast({ open: true, message: 'You will be able to update your profile soon' });
    };

    if (loading) {
        return <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 8 }} />;
    }

    if (!profile) {
        return (
            <Typography variant="body1" color="textSecondary" sx={{ textAlign: 'center', mt: 4 }}>
                Unable to load profile data.
            </Typography>
        );
    }

    return (
        <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Profile Info */}
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <Box sx={{ position: 'relative' }}>
                    <Avatar src={profile.profileImage || ''} sx={{ width: 100, height: 100 }} />
                    <IconButton
                        onClick={handleEditClick}
                        sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: 'background.paper' }}
                    >
                        <EditIcon />
                    </IconButton>
                </Box>
                <Typography variant="h6">{profile.username || '—'}</Typography>
                <Typography color="text.secondary">{profile.email || '—'}</Typography>
                <Typography color="text.secondary">{profile.phone || '—'}</Typography>
            </Box>

            <Divider />

            {/* User's Reviews */}
            <Box>
                <Typography variant="h6" sx={{ mb: 2 }}>
                    My Reviews
                </Typography>

                {reviewsLoading ? (
                    <CircularProgress size={24} />
                ) : reviews.length === 0 ? (
                    <Typography>No reviews submitted yet.</Typography>
                ) : (
                    <List>
                        {reviews.map((r) => (
                            <React.Fragment key={r._id}>
                                <ListItem alignItems="flex-start">
                                    <ListItemAvatar>
                                        <Avatar src={r.buyer.profileImage || ''} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={r.buyer.username}
                                        secondary={
                                            <>
                                                <Rating value={r.rating} precision={0.5} readOnly size="small" />
                                                <Typography variant="body2" color="text.primary">
                                                    {r.comment}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                                <Divider component="li" />
                            </React.Fragment>
                        ))}
                    </List>
                )}
            </Box>

            {/* Toast */}
            <Snackbar
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                open={toast.open}
                autoHideDuration={3000}
                onClose={() => setToast({ open: false, message: '' })}
            >
                <Alert severity="info" onClose={() => setToast({ open: false, message: '' })}>
                    {toast.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}
