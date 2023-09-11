import { loadStripe } from '@stripe/stripe-js';
var stripePromise;
export var getStripe = function () {
    var _a, _b;
    if (!stripePromise) {
        stripePromise = loadStripe((_b = (_a = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_LIVE) !== null && _a !== void 0 ? _a : process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) !== null && _b !== void 0 ? _b : '');
    }
    return stripePromise;
};
