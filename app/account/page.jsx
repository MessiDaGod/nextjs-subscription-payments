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
import ManageSubscriptionButton from './ManageSubscriptionButton';
import { getSession, getUserDetails, getSubscription } from '@/app/supabase-server';
import Button from '@/components/ui/Button';
import { createServerActionClient } from '@supabase/auth-helpers-nextjs';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { redirect } from 'next/navigation';
export default function Account() {
    var _a, _b, _c, _d, _e, _f;
    return __awaiter(this, void 0, void 0, function () {
        var _g, session, userDetails, subscription, user, subscriptionPrice, updateName, updateEmail;
        var _this = this;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        getSession(),
                        getUserDetails(),
                        getSubscription()
                    ])];
                case 1:
                    _g = _h.sent(), session = _g[0], userDetails = _g[1], subscription = _g[2];
                    user = session === null || session === void 0 ? void 0 : session.user;
                    if (!session) {
                        return [2 /*return*/, redirect('/signin')];
                    }
                    subscriptionPrice = subscription &&
                        new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: (_a = subscription === null || subscription === void 0 ? void 0 : subscription.prices) === null || _a === void 0 ? void 0 : _a.currency,
                            minimumFractionDigits: 0
                        }).format((((_b = subscription === null || subscription === void 0 ? void 0 : subscription.prices) === null || _b === void 0 ? void 0 : _b.unit_amount) || 0) / 100);
                    updateName = function (formData) { return __awaiter(_this, void 0, void 0, function () {
                        'use server';
                        var newName, supabase, session, user, error;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    newName = formData.get('name');
                                    supabase = createServerActionClient({ cookies: cookies });
                                    return [4 /*yield*/, getSession()];
                                case 1:
                                    session = _a.sent();
                                    user = session === null || session === void 0 ? void 0 : session.user;
                                    return [4 /*yield*/, supabase
                                            .from('users')
                                            .update({ full_name: newName })
                                            .eq('id', user === null || user === void 0 ? void 0 : user.id)];
                                case 2:
                                    error = (_a.sent()).error;
                                    if (error) {
                                        console.log(error);
                                    }
                                    revalidatePath('/account');
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    updateEmail = function (formData) { return __awaiter(_this, void 0, void 0, function () {
                        'use server';
                        var newEmail, supabase, error;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    newEmail = formData.get('email');
                                    supabase = createServerActionClient({ cookies: cookies });
                                    return [4 /*yield*/, supabase.auth.updateUser({ email: newEmail })];
                                case 1:
                                    error = (_a.sent()).error;
                                    if (error) {
                                        console.log(error);
                                    }
                                    revalidatePath('/account');
                                    return [2 /*return*/];
                            }
                        });
                    }); };
                    return [2 /*return*/, (<section className="mb-32 bg-black">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
            Account
          </h1>
          <p className="max-w-2xl m-auto mt-5 text-xl text-zinc-200 sm:text-center sm:text-2xl">
            We partnered with Stripe for a simplified billing.
          </p>
        </div>
      </div>
      <div className="p-4">
        <Card title="Your Plan" description={subscription
                                ? "You are currently on the ".concat((_d = (_c = subscription === null || subscription === void 0 ? void 0 : subscription.prices) === null || _c === void 0 ? void 0 : _c.products) === null || _d === void 0 ? void 0 : _d.name, " plan.")
                                : 'You are not currently subscribed to any plan.'} footer={<ManageSubscriptionButton session={session}/>}>
          <div className="mt-8 mb-4 text-xl font-semibold">
            {subscription ? ("".concat(subscriptionPrice, "/").concat((_e = subscription === null || subscription === void 0 ? void 0 : subscription.prices) === null || _e === void 0 ? void 0 : _e.interval)) : (<Link href="/">Choose your plan</Link>)}
          </div>
        </Card>
        <Card title="Your Name" description="Please enter your full name, or a display name you are comfortable with." footer={<div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <p className="pb-4 sm:pb-0">64 characters maximum</p>
              <Button variant="slim" type="submit" form="nameForm" disabled={true}>
                {/* WARNING - In Next.js 13.4.x server actions are in alpha and should not be used in production code! */}
                Update Name
              </Button>
            </div>}>
          <div className="mt-8 mb-4 text-xl font-semibold">
            <form id="nameForm" action={updateName}>
              <input type="text" name="name" className="w-1/2 p-3 rounded-md bg-zinc-800" defaultValue={(_f = userDetails === null || userDetails === void 0 ? void 0 : userDetails.full_name) !== null && _f !== void 0 ? _f : ''} placeholder="Your name" maxLength={64}/>
            </form>
          </div>
        </Card>
        <Card title="Your Email" description="Please enter the email address you want to use to login." footer={<div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
              <p className="pb-4 sm:pb-0">
                We will email you to verify the change.
              </p>
              <Button variant="slim" type="submit" form="emailForm" disabled={true}>
                {/* WARNING - In Next.js 13.4.x server actions are in alpha and should not be used in production code! */}
                Update Email
              </Button>
            </div>}>
          <div className="mt-8 mb-4 text-xl font-semibold">
            <form id="emailForm" action={updateEmail}>
              <input type="text" name="email" className="w-1/2 p-3 rounded-md bg-zinc-800" defaultValue={user ? user.email : ''} placeholder="Your email" maxLength={64}/>
            </form>
          </div>
        </Card>
      </div>
    </section>)];
            }
        });
    });
}
function Card(_a) {
    var title = _a.title, description = _a.description, footer = _a.footer, children = _a.children;
    return (<div className="w-full max-w-3xl m-auto my-8 border rounded-md p border-zinc-700">
      <div className="px-5 py-4">
        <h3 className="mb-1 text-2xl font-medium">{title}</h3>
        <p className="text-zinc-300">{description}</p>
        {children}
      </div>
      <div className="p-4 border-t rounded-b-md border-zinc-700 bg-zinc-900 text-zinc-500">
        {footer}
      </div>
    </div>);
}
