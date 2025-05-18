// src/components/PaypalPayment.jsx
import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import { useNavigate } from 'react-router-dom';

export default function PaypalPayment({ transactionId }) {
  const navigate = useNavigate();

  const initialOptions = {
    'client-id': import.meta.env.VITE_PAYPAL_CLIENTID,
    currency: 'USD',
    intent: 'capture',
  };

  const style = { shape: 'rect', layout: 'vertical' };

  // 3) Create the PayPal order on your server
  const createOrder = async () => {
    const res = await fetch('/api/transactions/paypal/createOrderTest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ transactionId }),
    });
    if (!res.ok) throw new Error('Could not create PayPal order');
    const { orderId } = await res.json();
    return orderId;
  };

  // 4) When buyer approves in PayPal popup
  const onApprove = async data => {
    try {
      // note: your route is POST /paypal/:transactionId/capturePaymentTest/:paymentId
      const res = await fetch(
        `/api/transactions/paypal/${transactionId}/capturePaymentTest/${data.orderID}`,
        { method: 'POST' }
      );
      if (!res.ok) throw new Error('Capture failed');
      // success → redirect to your confirmation page
      navigate('/complete-payment');
    } catch (err) {
      console.error(err);
      navigate('/cancel-payment');
    }
  };

  const onError = err => {
    console.error('PayPal error', err);
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
