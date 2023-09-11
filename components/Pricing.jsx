'use client';
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
import Button from '@/components/ui/Button';
import { postData } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe-client';
import cn from 'classnames';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useState } from 'react';
export default function Pricing(_a) {
    var _this = this;
    var session = _a.session, user = _a.user, products = _a.products, subscription = _a.subscription;
    var intervals = Array.from(new Set(products.flatMap(function (product) { var _a; return (_a = product === null || product === void 0 ? void 0 : product.prices) === null || _a === void 0 ? void 0 : _a.map(function (price) { return price === null || price === void 0 ? void 0 : price.interval; }); })));
    var router = useRouter();
    var _b = useState('month'), billingInterval = _b[0], setBillingInterval = _b[1];
    var _c = useState(), priceIdLoading = _c[0], setPriceIdLoading = _c[1];
    var handleCheckout = function (price) { return __awaiter(_this, void 0, void 0, function () {
        var sessionId, stripe, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    setPriceIdLoading(price.id);
                    if (!user) {
                        return [2 /*return*/, router.push('/signin')];
                    }
                    if (subscription) {
                        return [2 /*return*/, router.push('/account')];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, 5, 6]);
                    return [4 /*yield*/, postData({
                            url: '/api/create-checkout-session',
                            data: { price: price }
                        })];
                case 2:
                    sessionId = (_a.sent()).sessionId;
                    return [4 /*yield*/, getStripe()];
                case 3:
                    stripe = _a.sent();
                    stripe === null || stripe === void 0 ? void 0 : stripe.redirectToCheckout({ sessionId: sessionId });
                    return [3 /*break*/, 6];
                case 4:
                    error_1 = _a.sent();
                    return [2 /*return*/, alert(error_1 === null || error_1 === void 0 ? void 0 : error_1.message)];
                case 5:
                    setPriceIdLoading(undefined);
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    }); };
    if (!products.length)
        return (<section className="bg-black">
        <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center"></div>
          <p className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            No subscription pricing plans found. Create them in your{' '}
            <a className="text-pink-500 underline" href="https://dashboard.stripe.com/products" rel="noopener noreferrer" target="_blank">
              Stripe Dashboard
            </a>
            .
          </p>
        </div>
        <LogoCloud />
      </section>);
    if (products.length > 0)
        return (<section className="bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Pricing Plans
          </h1>
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            Start building for free, then add a site plan to go live. Account
            plans unlock additional features.
          </p>

          {products.map(function (product) {
                var _a;
                return (<React.Fragment key={product.id}>
              <div className="relative flex self-center mt-12 border rounded-lg bg-zinc-900 border-zinc-800">
                <div className="border border-pink-500 border-opacity-50 divide-y rounded-lg shadow-sm bg-zinc-900 divide-zinc-600">
                  <div className="p-6 py-2 m-1 text-2xl font-medium text-white rounded-md shadow-sm border-zinc-800 whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8">
                    {product.name}
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-4 sm:mt-12 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
                {(_a = product.prices) === null || _a === void 0 ? void 0 : _a.map(function (price) {
                        var _a, _b;
                        var priceString = price.unit_amount &&
                            new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: price.currency,
                                minimumFractionDigits: 0
                            }).format(price.unit_amount / 100);
                        return (<div key={price.id} className="divide-y rounded-lg shadow-sm divide-zinc-600 bg-zinc-900">
                      <div className="p-6">
                        <p>
                          <span className="text-5xl font-extrabold white">
                            {priceString}
                          </span>
                          <span className="text-base font-medium text-zinc-100">
                            /{price.interval}
                          </span>
                        </p>
                        <p className="mt-4 text-zinc-300">{price.description}</p>
                        <Button variant="slim" type="button" disabled={false} loading={priceIdLoading === price.id} onClick={function () { return handleCheckout(price); }} className="block w-full py-2 mt-12 text-sm font-semibold text-center text-white rounded-md hover:bg-zinc-900">
                          {product.name === ((_b = (_a = subscription === null || subscription === void 0 ? void 0 : subscription.prices) === null || _a === void 0 ? void 0 : _a.products) === null || _b === void 0 ? void 0 : _b.name)
                                ? 'Manage'
                                : 'Subscribe'}
                        </Button>
                      </div>
                    </div>);
                    })}
              </div>
            </React.Fragment>);
            })}

          <LogoCloud />
        </div>
      </div>
    </section>);
    return (<section className="bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
        <div className="sm:flex sm:flex-col sm:align-center">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Pricing Plans
          </h1>
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            Start building for free, then add a site plan to go live. Account
            plans unlock additional features.
          </p>
          <div className="relative self-center mt-6 bg-zinc-900 rounded-lg p-0.5 flex sm:mt-8 border border-zinc-800">
            {intervals.includes('month') && (<button onClick={function () { return setBillingInterval('month'); }} type="button" className={"".concat(billingInterval === 'month'
                ? 'relative w-1/2 bg-zinc-700 border-zinc-800 shadow-sm text-white'
                : 'ml-0.5 relative w-1/2 border border-transparent text-zinc-400', " rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8")}>
                Monthly billing
              </button>)}
            {intervals.includes('year') && (<button onClick={function () { return setBillingInterval('year'); }} type="button" className={"".concat(billingInterval === 'year'
                ? 'relative w-1/2 bg-zinc-700 border-zinc-800 shadow-sm text-white'
                : 'ml-0.5 relative w-1/2 border border-transparent text-zinc-400', " rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8")}>
                Yearly billing
              </button>)}
          </div>
        </div>
        <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0 xl:grid-cols-3">
          {products.map(function (product) {
            var _a, _b, _c;
            var price = (_a = product === null || product === void 0 ? void 0 : product.prices) === null || _a === void 0 ? void 0 : _a.find(function (price) { return price.interval === billingInterval; });
            if (!price)
                return null;
            var priceString = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: price.currency,
                minimumFractionDigits: 0
            }).format(((price === null || price === void 0 ? void 0 : price.unit_amount) || 0) / 100);
            return (<div key={product.id} className={cn('rounded-lg shadow-sm divide-y divide-zinc-600 bg-zinc-900', {
                    'border border-pink-500': subscription
                        ? product.name === ((_c = (_b = subscription === null || subscription === void 0 ? void 0 : subscription.prices) === null || _b === void 0 ? void 0 : _b.products) === null || _c === void 0 ? void 0 : _c.name)
                        : product.name === 'Freelancer'
                })}>
                <div className="p-6">
                  <h2 className="text-2xl font-semibold leading-6 text-white">
                    {product.name}
                  </h2>
                  <p className="mt-4 text-zinc-300">{product.description}</p>
                  <p className="mt-8">
                    <span className="text-5xl font-extrabold white">
                      {priceString}
                    </span>
                    <span className="text-base font-medium text-zinc-100">
                      /{billingInterval}
                    </span>
                  </p>
                  <Button variant="slim" type="button" disabled={!session} loading={priceIdLoading === price.id} onClick={function () { return handleCheckout(price); }} className="block w-full py-2 mt-8 text-sm font-semibold text-center text-white rounded-md hover:bg-zinc-900">
                    {subscription ? 'Manage' : 'Subscribe'}
                  </Button>
                </div>
              </div>);
        })}
        </div>
        <LogoCloud />
      </div>
    </section>);
}
function LogoCloud() {
    return (<div>
      <p className="mt-24 text-xs uppercase text-zinc-400 text-center font-bold tracking-[0.3em]">
        Brought to you by
      </p>
      <div className="flex flex-col items-center my-12 space-y-4 sm:mt-8 sm:space-y-0 md:mx-auto md:max-w-2xl sm:grid sm:gap-6 sm:grid-cols-5">
        <div className="flex items-center justify-start">
          <a href="https://nextjs.org" aria-label="Next.js Link">
            <img src="/nextjs.svg" alt="Next.js Logo" className="h-12 text-white"/>
          </a>
        </div>
        <div className="flex items-center justify-start">
          <a href="https://vercel.com" aria-label="Vercel.com Link">
            <img src="/vercel.svg" alt="Vercel.com Logo" className="h-6 text-white"/>
          </a>
        </div>
        <div className="flex items-center justify-start">
          <a href="https://stripe.com" aria-label="stripe.com Link">
            <img src="/stripe.svg" alt="stripe.com Logo" className="h-12 text-white"/>
          </a>
        </div>
        <div className="flex items-center justify-start">
          <a href="https://supabase.io" aria-label="supabase.io Link">
            <img src="/supabase.svg" alt="supabase.io Logo" className="h-10 text-white"/>
          </a>
        </div>
        <div className="flex items-center justify-start">
          <a href="https://github.com" aria-label="github.com Link">
            <img src="/github.svg" alt="github.com Logo" className="h-8 text-white"/>
          </a>
        </div>
      </div>
    </div>);
}
