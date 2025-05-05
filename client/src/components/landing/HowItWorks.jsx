import React, { useState } from 'react';
import {
    Container,
    Typography,
    Box,
    Tabs,
    Tab,
    Stepper,
    Step,
    StepLabel,
    StepContent,
    Button,
    Paper,
    useTheme,
} from '@mui/material';
import { useTheme as useAppTheme } from '../../context/ThemeContext';

const buyerSteps = [
    {
        label: 'Create a free account',
        description: 'Sign up to access listings and auctions.',
    },
    {
        label: 'Browse or bid',
        description: 'Explore used machinery or join live auctions in real time.',
    },
    {
        label: 'Place bids or contact sellers',
        description: 'Join live auctions or use provided contact details to reach sellers.',
    },
    {
        label: 'Secure your purchase',
        description: 'Complete payment safely and arrange logistics through the platform.',
    },
];

const sellerSteps = [
    {
        label: 'Create a free account',
        description: 'Register your profile to start listing machinery.',
    },
    {
        label: 'List your machinery',
        description: 'Upload clear photos, specs, and pricing for better visibility.',
    },
    {
        label: 'Engage buyers',
        description: 'Respond to inquiries or monitor real-time auction activity.',
    },
    {
        label: 'Close deals securely',
        description: 'Receive payments securely and manage delivery through integrated services.',
    },
];

function HowItWorks() {
    const [activeTab, setActiveTab] = useState(0);
    const [activeStep, setActiveStep] = useState(0);

    const theme = useTheme();
    const { mode } = useAppTheme();

    const steps = activeTab === 0 ? buyerSteps : sellerSteps;

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setActiveStep(0); // reset steps when switching tabs
    };

    const handleNext = () => {
        setActiveStep((prevStep) => prevStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevStep) => prevStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <Box sx={{ py: 8, backgroundColor: theme.palette.background.default }}>
            <Container maxWidth="md">
                <Typography variant="h4" align="center" fontWeight={700} mb={4}>
                    How It Works
                </Typography>

                <Paper elevation={2} sx={{ borderRadius: 3 }}>
                    <Tabs
                        value={activeTab}
                        onChange={handleTabChange}
                        centered
                        indicatorColor="primary"
                        textColor="primary"
                    >
                        <Tab label="For Buyers" />
                        <Tab label="For Sellers" />
                    </Tabs>

                    <Box sx={{ px: 4, py: 4 }}>
                        <Stepper activeStep={activeStep} orientation="vertical">
                            {steps.map((step, index) => (
                                <Step key={step.label}>
                                    <StepLabel>{step.label}</StepLabel>
                                    <StepContent>
                                        <Typography>{step.description}</Typography>
                                        <Box sx={{ mb: 2 }}>
                                            <div>
                                                <Button
                                                    variant="contained"
                                                    onClick={handleNext}
                                                    sx={{ mt: 1, mr: 1 }}
                                                    disabled={activeStep === steps.length}
                                                >
                                                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                                                </Button>
                                                <Button
                                                    disabled={index === 0}
                                                    onClick={handleBack}
                                                    sx={{ mt: 1, mr: 1 }}
                                                >
                                                    Back
                                                </Button>
                                            </div>
                                        </Box>
                                    </StepContent>
                                </Step>
                            ))}
                        </Stepper>

                        {activeStep === steps.length && (
                            <Box
                                sx={{
                                    mt: 3,
                                    p: 3,
                                    borderRadius: 2,
                                }}
                            >
                                <Typography>
                                    {activeTab === 0
                                        ? "You’re all set! Start exploring listings and find the perfect machine today."
                                        : "You’re all set! Start listing and connect with serious buyers right away."}
                                </Typography>

                                <Button onClick={handleReset} sx={{ mt: 1 }}>
                                    Reset
                                </Button>
                            </Box>
                        )}

                    </Box>
                </Paper>
            </Container>
        </Box>
    );
}

export default HowItWorks;
