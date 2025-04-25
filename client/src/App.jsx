import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import CancelPayment from './pages/cancelPayment';
import CompletePayment from './pages/completePayment';
import PaypalPayment from './components/paypalPayment';

// Import all pages
import HomeLayout from './pages/HomeLayout';
import Landing from './pages/Landing';
import Login from './pages/Auth/login/Login';
import Register from './pages/Auth/register/Register';
import Profile from './pages/Profile';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomeLayout />,
    children: [
      { index: true, element: <Landing /> },
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: 'profile', element: <Profile /> },

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
