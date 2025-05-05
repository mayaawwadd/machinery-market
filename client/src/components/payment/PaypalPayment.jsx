// src/components/PaypalPayment.jsx
import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';

const paypalPayment = () => {
  // 1) Configure the PayPal JS SDK
  // const initialOptions = {
  //   'client-id': import.meta.env.VITE_PAYPAL_CLIENTID,
  //   currency: 'USD',
  //   intent: 'capture',
  // };

  // // 2) Style the buttons
  // const style = {
  //   shape: 'rect',
  //   layout: 'vertical',
  // };

  // // 3) Called when the buyer clicks “PayPal”
  // const onCreateOrder = async () => {
  //   try {
  //     // hit your server’s PayPal “create order” endpoint
  //     const response = await fetch('/api/transactions/paypal/createOrderTest', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       // if you need to pass any extra data (like a transactionId or amount):
  //       // body: JSON.stringify({ transactionId, amount }),
  //     });

  //     if (!response.ok) {
  //       throw new Error(`Create order failed: ${response.status}`);
  //     }

  //     const { orderId } = await response.json();
  //     return orderId;
  //   } catch (error) {
  //     console.error('Error creating PayPal order:', error);
  //     throw error;
  //   }
  // };

  // // 4) Called when the buyer approves the payment in the popup
  // const onApprove = async (data) => {
  //   try {
  //     if (!data?.orderID) throw new Error('invalid order ID');

  //     const response = await fetch(
  //       `/api/transactions/paypal/capturePaymentTest/${data.orderID}`,
  //       {
  //         method: 'GET',
  //         headers: {
  //           'Content-Type': 'application/json',
  //         },
  //       }
  //     );
  //     const result = await response.json();
  //     window.location.href = '/complete-payment';
  //     // you can now call your server to capture the order, e.g.:
  //     // await fetch("/api/paypal/capture-order", {
  //     //   method: "POST",
  //     //   headers: { "Content-Type": "application/json" },
  //     //   body: JSON.stringify({ orderId: data.orderID })
  //     // });
  //     // after successful capture, redirect to your "complete" page:
  //     // window.location.href = "/complete-payment";
  //   } catch (error) {
  //     console.error('Error verifying PayPal order:', error);
  //     // on error, send user to cancel page:
  //     window.location.href = '/cancel-payment';
  //   }
  // };

  // // 5) Error handler
  // const onError = (err) => {
  //   console.error('PayPal error:', err);
  // };

  return (
    <PayPalScriptProvider options={initialOptions}>
      {/* <PayPalButtons
        style={style}
        createOrder={onCreateOrder}
        onApprove={onApprove}
        onError={onError}
        fundingSource="paypal"
      /> */}
    </PayPalScriptProvider>
  );
};

export default paypalPayment;
