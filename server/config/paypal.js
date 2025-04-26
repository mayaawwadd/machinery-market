import checkoutNodeJssdk from '@paypal/checkout-server-sdk';

const { core } = checkoutNodeJssdk;
const clientId = process.env.PAYPAL_CLIENT_ID;
const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

const environment = new core.SandboxEnvironment(clientId, clientSecret);
export const payPalClient = new core.PayPalHttpClient(environment);
