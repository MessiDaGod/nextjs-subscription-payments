var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import { stripe } from '@/utils/stripe';
import { upsertProductRecord, upsertPriceRecord, manageSubscriptionStatusChange } from '@/utils/supabase-admin';
import { headers } from 'next/headers';
var relevantEvents = new Set([
    'product.created',
    'product.updated',
    'price.created',
    'price.updated',
    'checkout.session.completed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted'
]);
export function POST(req) {
    return __awaiter(this, void 0, void 0, function () {
        var body, sig, webhookSecret, event, _a, subscription, checkoutSession, subscriptionId, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, req.text()];
                case 1:
                    body = _b.sent();
                    sig = headers().get('Stripe-Signature');
                    webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
                    try {
                        if (!sig || !webhookSecret)
                            return [2 /*return*/];
                        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
                    }
                    catch (err) {
                        console.log("\u274C Error message: ".concat(err.message));
                        return [2 /*return*/, new Response("Webhook Error: ".concat(err.message), { status: 400 })];
                    }
                    if (!relevantEvents.has(event.type)) return [3 /*break*/, 15];
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 14, , 15]);
                    _a = event.type;
                    switch (_a) {
                        case 'product.created': return [3 /*break*/, 3];
                        case 'product.updated': return [3 /*break*/, 3];
                        case 'price.created': return [3 /*break*/, 5];
                        case 'price.updated': return [3 /*break*/, 5];
                        case 'customer.subscription.created': return [3 /*break*/, 7];
                        case 'customer.subscription.updated': return [3 /*break*/, 7];
                        case 'customer.subscription.deleted': return [3 /*break*/, 7];
                        case 'checkout.session.completed': return [3 /*break*/, 9];
                    }
                    return [3 /*break*/, 12];
                case 3: return [4 /*yield*/, upsertProductRecord(event.data.object)];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 13];
                case 5: return [4 /*yield*/, upsertPriceRecord(event.data.object)];
                case 6:
                    _b.sent();
                    return [3 /*break*/, 13];
                case 7:
                    subscription = event.data.object;
                    return [4 /*yield*/, manageSubscriptionStatusChange(subscription.id, subscription.customer, event.type === 'customer.subscription.created')];
                case 8:
                    _b.sent();
                    return [3 /*break*/, 13];
                case 9:
                    checkoutSession = event.data.object;
                    if (!(checkoutSession.mode === 'subscription')) return [3 /*break*/, 11];
                    subscriptionId = checkoutSession.subscription;
                    return [4 /*yield*/, manageSubscriptionStatusChange(subscriptionId, checkoutSession.customer, true)];
                case 10:
                    _b.sent();
                    _b.label = 11;
                case 11: return [3 /*break*/, 13];
                case 12: throw new Error('Unhandled relevant event!');
                case 13: return [3 /*break*/, 15];
                case 14:
                    error_1 = _b.sent();
                    console.log(error_1);
                    return [2 /*return*/, new Response('Webhook handler failed. View your nextjs function logs.', {
                            status: 400
                        })];
                case 15: return [2 /*return*/, new Response(JSON.stringify({ received: true }))];
            }
        });
    });
}
