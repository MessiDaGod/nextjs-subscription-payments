var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
import { toDateTime } from './helpers';
import { stripe } from './stripe';
import { createClient } from '@supabase/supabase-js';
// Note: supabaseAdmin uses the SERVICE_ROLE_KEY which you must only use in a secure server-side context
// as it has admin privileges and overwrites RLS policies!
var supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL || '', process.env.SUPABASE_SERVICE_ROLE_KEY || '');
var upsertProductRecord = function (product) { return __awaiter(void 0, void 0, void 0, function () {
    var productData, error;
    var _a, _b, _c;
    return __generator(this, function (_d) {
        switch (_d.label) {
            case 0:
                productData = {
                    id: product.id,
                    active: product.active,
                    name: product.name,
                    description: (_a = product.description) !== null && _a !== void 0 ? _a : null,
                    image: (_c = (_b = product.images) === null || _b === void 0 ? void 0 : _b[0]) !== null && _c !== void 0 ? _c : null,
                    metadata: product.metadata
                };
                return [4 /*yield*/, supabaseAdmin.from('products').upsert([productData])];
            case 1:
                error = (_d.sent()).error;
                if (error)
                    throw error;
                console.log("Product inserted/updated: ".concat(product.id));
                return [2 /*return*/];
        }
    });
}); };
var upsertPriceRecord = function (price) { return __awaiter(void 0, void 0, void 0, function () {
    var priceData, error;
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return __generator(this, function (_j) {
        switch (_j.label) {
            case 0:
                priceData = {
                    id: price.id,
                    product_id: typeof price.product === 'string' ? price.product : '',
                    active: price.active,
                    currency: price.currency,
                    description: (_a = price.nickname) !== null && _a !== void 0 ? _a : null,
                    type: price.type,
                    unit_amount: (_b = price.unit_amount) !== null && _b !== void 0 ? _b : null,
                    interval: (_d = (_c = price.recurring) === null || _c === void 0 ? void 0 : _c.interval) !== null && _d !== void 0 ? _d : null,
                    interval_count: (_f = (_e = price.recurring) === null || _e === void 0 ? void 0 : _e.interval_count) !== null && _f !== void 0 ? _f : null,
                    trial_period_days: (_h = (_g = price.recurring) === null || _g === void 0 ? void 0 : _g.trial_period_days) !== null && _h !== void 0 ? _h : null,
                    metadata: price.metadata
                };
                return [4 /*yield*/, supabaseAdmin.from('prices').upsert([priceData])];
            case 1:
                error = (_j.sent()).error;
                if (error)
                    throw error;
                console.log("Price inserted/updated: ".concat(price.id));
                return [2 /*return*/];
        }
    });
}); };
var createOrRetrieveCustomer = function (_a) {
    var email = _a.email, uuid = _a.uuid;
    return __awaiter(void 0, void 0, void 0, function () {
        var _b, data, error, customerData, customer, supabaseError;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0: return [4 /*yield*/, supabaseAdmin
                        .from('customers')
                        .select('stripe_customer_id')
                        .eq('id', uuid)
                        .single()];
                case 1:
                    _b = _c.sent(), data = _b.data, error = _b.error;
                    if (!(error || !(data === null || data === void 0 ? void 0 : data.stripe_customer_id))) return [3 /*break*/, 4];
                    customerData = {
                        metadata: {
                            supabaseUUID: uuid
                        }
                    };
                    if (email)
                        customerData.email = email;
                    return [4 /*yield*/, stripe.customers.create(customerData)];
                case 2:
                    customer = _c.sent();
                    return [4 /*yield*/, supabaseAdmin
                            .from('customers')
                            .insert([{ id: uuid, stripe_customer_id: customer.id }])];
                case 3:
                    supabaseError = (_c.sent()).error;
                    if (supabaseError)
                        throw supabaseError;
                    console.log("New customer created and inserted for ".concat(uuid, "."));
                    return [2 /*return*/, customer.id];
                case 4: return [2 /*return*/, data.stripe_customer_id];
            }
        });
    });
};
/**
 * Copies the billing details from the payment method to the customer object.
 */
var copyBillingDetailsToCustomer = function (uuid, payment_method) { return __awaiter(void 0, void 0, void 0, function () {
    var customer, _a, name, phone, address, error;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                customer = payment_method.customer;
                _a = payment_method.billing_details, name = _a.name, phone = _a.phone, address = _a.address;
                if (!name || !phone || !address)
                    return [2 /*return*/];
                //@ts-ignore
                return [4 /*yield*/, stripe.customers.update(customer, { name: name, phone: phone, address: address })];
            case 1:
                //@ts-ignore
                _b.sent();
                return [4 /*yield*/, supabaseAdmin
                        .from('users')
                        .update({
                        billing_address: __assign({}, address),
                        payment_method: __assign({}, payment_method[payment_method.type])
                    })
                        .eq('id', uuid)];
            case 2:
                error = (_b.sent()).error;
                if (error)
                    throw error;
                return [2 /*return*/];
        }
    });
}); };
var manageSubscriptionStatusChange = function (subscriptionId, customerId, createAction) {
    if (createAction === void 0) { createAction = false; }
    return __awaiter(void 0, void 0, void 0, function () {
        var _a, customerData, noCustomerError, uuid, subscription, subscriptionData, error;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0: return [4 /*yield*/, supabaseAdmin
                        .from('customers')
                        .select('id')
                        .eq('stripe_customer_id', customerId)
                        .single()];
                case 1:
                    _a = _b.sent(), customerData = _a.data, noCustomerError = _a.error;
                    if (noCustomerError)
                        throw noCustomerError;
                    uuid = customerData.id;
                    return [4 /*yield*/, stripe.subscriptions.retrieve(subscriptionId, {
                            expand: ['default_payment_method']
                        })];
                case 2:
                    subscription = _b.sent();
                    subscriptionData = {
                        id: subscription.id,
                        user_id: uuid,
                        metadata: subscription.metadata,
                        status: subscription.status,
                        price_id: subscription.items.data[0].price.id,
                        //TODO check quantity on subscription
                        // @ts-ignore
                        quantity: subscription.quantity,
                        cancel_at_period_end: subscription.cancel_at_period_end,
                        cancel_at: subscription.cancel_at
                            ? toDateTime(subscription.cancel_at).toISOString()
                            : null,
                        canceled_at: subscription.canceled_at
                            ? toDateTime(subscription.canceled_at).toISOString()
                            : null,
                        current_period_start: toDateTime(subscription.current_period_start).toISOString(),
                        current_period_end: toDateTime(subscription.current_period_end).toISOString(),
                        created: toDateTime(subscription.created).toISOString(),
                        ended_at: subscription.ended_at
                            ? toDateTime(subscription.ended_at).toISOString()
                            : null,
                        trial_start: subscription.trial_start
                            ? toDateTime(subscription.trial_start).toISOString()
                            : null,
                        trial_end: subscription.trial_end
                            ? toDateTime(subscription.trial_end).toISOString()
                            : null
                    };
                    return [4 /*yield*/, supabaseAdmin
                            .from('subscriptions')
                            .upsert([subscriptionData])];
                case 3:
                    error = (_b.sent()).error;
                    if (error)
                        throw error;
                    console.log("Inserted/updated subscription [".concat(subscription.id, "] for user [").concat(uuid, "]"));
                    if (!(createAction && subscription.default_payment_method && uuid)) return [3 /*break*/, 5];
                    //@ts-ignore
                    return [4 /*yield*/, copyBillingDetailsToCustomer(uuid, subscription.default_payment_method)];
                case 4:
                    //@ts-ignore
                    _b.sent();
                    _b.label = 5;
                case 5: return [2 /*return*/];
            }
        });
    });
};
export { upsertProductRecord, upsertPriceRecord, createOrRetrieveCustomer, manageSubscriptionStatusChange };
