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
import BuyMachinery from './pages/BuyMachinery';
import SellMachinery from './pages/SellMachinery';
import Auctions from './pages/Auctions';
import AuctionDetails from './pages/AuctionDetails';
import CancelPayment from './pages/cancelPayment';
import CompletePayment from './pages/completePayment';
import MachineryDetails from './pages/MachineryDetails';
import AuctionPurchase from './pages/AuctionPurchase';
import PaypalPayment from './components/payment/PaypalPayment';
import MachineryPurchase from './pages/MachineryPurchase';
import Profile from './pages/Profile';
import ProfileInfo from './pages/profile/ProfileInfo';
import MyListings from './pages/profile/MyListings';
import MyTransactions from './pages/profile/MyTransactions';


const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      {
        path: 'profile',
        element: <Profile />,
        children: [
          { index: true, element: <ProfileInfo /> },
          { path: 'listings', element: <MyListings /> },
          { path: 'transactions', element: <MyTransactions /> },
        ]
      },
      { path: 'machinery/buy', element: <BuyMachinery /> },
      { path: 'machinery/:id', element: <MachineryDetails /> },
      { path: 'machinery/sell', element: <SellMachinery /> },
      { path: 'machinery/auctions', element: <Auctions /> },
      { path: 'auctions/:id', element: <AuctionDetails /> },
      //paypal flow
      { path: 'auctions/:id/purchase', element: <AuctionPurchase /> },
      { path: 'machinery/:id/purchase', element: <MachineryPurchase /> },
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
