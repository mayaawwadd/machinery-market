import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { createTheme, colors } from '@mui/material';

// Import all pages
import HomeLayout from './layouts/HomeLayout';
import Landing from './pages/Landing';
import Login from './pages/Auth/login/Login';
import Register from './pages/Auth/register/Register';
import Profile from './pages/Profile';
import BuyMachinery from './pages/BuyMachinery';
import CancelPayment from './pages/cancelPayment';
import CompletePayment from './pages/completePayment';
import PaypalPayment from './components/payment/paypalPayment';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'profile', element: <Profile /> },
      { path: 'machinery/buy', element: <BuyMachinery /> },
      //paypal flow
      { path: 'paypal', element: <PaypalPayment /> },
      { path: 'complete-payment', element: <CompletePayment /> },
      { path: 'cancel-payment', element: <CancelPayment /> },
    ],
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-center" />
    </>
  );
}

export default App;
