// src/components/PaypalPayment.jsx
import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../services/axiosInstance';

export default function PaypalPayment({ transactionId }) {
  const navigate = useNavigate();

  const initialOptions = {
    'client-id': import.meta.env.VITE_PAYPAL_CLIENTID,
    currency: 'USD',
    intent: 'capture',
  };

  const style = { shape: 'rect', layout: 'vertical' };

  // 1) Create the PayPal order on your server
  const createOrder = async () => {
    try {
      const { data } = await axiosInstance.post(
        '/transactions/paypal/createOrderTest',
        { transactionId }
      );
      console.log('✅ createOrder data:', data);
      if (!data.orderId) {
        throw new Error('No order ID returned from PayPal');
      }
      return data.orderId;
    } catch (err) {
      console.error('✖ createOrder error:', err.response?.data || err);
      throw err;
    }
  };

  // 2) Capture when buyer approves
  const onApprove = async (data, actions) => {
    try {
      console.log('✅ onApprove data:', data);
      const { data: captureResult } = await axiosInstance.post(
        `/transactions/paypal/${transactionId}/capturePaymentTest/${data.orderID}`
      );
      console.log('✅ captureResult:', captureResult);
      navigate('/complete-payment');
    } catch (err) {
      // Log everything we got back
      console.error('✖ capturePayment error:', {
        status: err.response?.status,
        body: err.response?.data,
      });
      navigate('/cancel-payment');
    }
  };

  const onError = (err) => {
    console.error('🚨 PayPal onError:', err);
    navigate('/cancel-payment');
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons
        style={style}
        createOrder={createOrder}
        onApprove={onApprove}
        onError={onError}
        fundingSource="paypal"
      />
    </PayPalScriptProvider>
  );
}
