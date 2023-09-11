var _a, _b;
import Stripe from 'stripe';
export var stripe = new Stripe((_b = (_a = process.env.STRIPE_SECRET_KEY_LIVE) !== null && _a !== void 0 ? _a : process.env.STRIPE_SECRET_KEY) !== null && _b !== void 0 ? _b : '', {
    // https://github.com/stripe/stripe-node#configuration
    apiVersion: '2022-11-15',
    // Register this as an official Stripe plugin.
    // https://stripe.com/docs/building-plugins#setappinfo
    appInfo: {
        name: 'Next.js Subscription Starter',
        version: '0.1.0'
    }
});
