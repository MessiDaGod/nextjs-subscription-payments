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
import { cookies } from 'next/headers';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { stripe } from '@/utils/stripe';
import { createOrRetrieveCustomer } from '@/utils/supabase-admin';
import { getURL } from '@/utils/helpers';
export function POST(req) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, price, _b, quantity, _c, metadata, supabase, user, customer, session, err_1;
        return __generator(this, function (_d) {
            switch (_d.label) {
                case 0:
                    if (!(req.method === 'POST')) return [3 /*break*/, 11];
                    return [4 /*yield*/, req.json()];
                case 1:
                    _a = _d.sent(), price = _a.price, _b = _a.quantity, quantity = _b === void 0 ? 1 : _b, _c = _a.metadata, metadata = _c === void 0 ? {} : _c;
                    _d.label = 2;
                case 2:
                    _d.trys.push([2, 9, , 10]);
                    supabase = createRouteHandlerClient({ cookies: cookies });
                    return [4 /*yield*/, supabase.auth.getUser()];
                case 3:
                    user = (_d.sent()).data.user;
                    return [4 /*yield*/, createOrRetrieveCustomer({
                            uuid: (user === null || user === void 0 ? void 0 : user.id) || '',
                            email: (user === null || user === void 0 ? void 0 : user.email) || ''
                        })];
                case 4:
                    customer = _d.sent();
                    session = void 0;
                    if (!(price.type === 'recurring')) return [3 /*break*/, 6];
                    return [4 /*yield*/, stripe.checkout.sessions.create({
                            payment_method_types: ['card'],
                            billing_address_collection: 'required',
                            customer: customer,
                            customer_update: {
                                address: 'auto'
                            },
                            line_items: [
                                {
                                    price: price.id,
                                    quantity: quantity
                                }
                            ],
                            mode: 'subscription',
                            allow_promotion_codes: true,
                            subscription_data: {
                                trial_from_plan: true,
                                metadata: metadata
                            },
                            success_url: "".concat(getURL(), "/account"),
                            cancel_url: "".concat(getURL(), "/")
                        })];
                case 5:
                    session = _d.sent();
                    return [3 /*break*/, 8];
                case 6:
                    if (!(price.type === 'one_time')) return [3 /*break*/, 8];
                    return [4 /*yield*/, stripe.checkout.sessions.create({
                            payment_method_types: ['card'],
                            billing_address_collection: 'required',
                            customer: customer,
                            customer_update: {
                                address: 'auto'
                            },
                            line_items: [
                                {
                                    price: price.id,
                                    quantity: quantity
                                }
                            ],
                            mode: 'payment',
                            allow_promotion_codes: true,
                            success_url: "".concat(getURL(), "/account"),
                            cancel_url: "".concat(getURL(), "/")
                        })];
                case 7:
                    session = _d.sent();
                    _d.label = 8;
                case 8:
                    if (session) {
                        return [2 /*return*/, new Response(JSON.stringify({ sessionId: session.id }), {
                                status: 200
                            })];
                    }
                    else {
                        return [2 /*return*/, new Response(JSON.stringify({
                                error: { statusCode: 500, message: 'Session is not defined' }
                            }), { status: 500 })];
                    }
                    return [3 /*break*/, 10];
                case 9:
                    err_1 = _d.sent();
                    console.log(err_1);
                    return [2 /*return*/, new Response(JSON.stringify(err_1), { status: 500 })];
                case 10: return [3 /*break*/, 12];
                case 11: return [2 /*return*/, new Response('Method Not Allowed', {
                        headers: { Allow: 'POST' },
                        status: 405
                    })];
                case 12: return [2 /*return*/];
            }
        });
    });
}
