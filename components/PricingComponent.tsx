'use client';

import Button from '@/components/ui/Button';
import { Database } from '@/types_db';
import { postData } from '@/utils/helpers';
import { getStripe } from '@/utils/stripe-client';
import { Session, User } from '@supabase/supabase-js';
import cn from 'classnames';
import { useRouter } from 'next/navigation';
import React from 'react';
import { useState } from 'react';

type Subscription = Database['public']['Tables']['subscriptions']['Row'];
type Product = Database['public']['Tables']['products']['Row'];
type Price = Database['public']['Tables']['prices']['Row'];
interface ProductWithPrices extends Product {
  prices: Price[];
}
interface PriceWithProduct extends Price {
  products: Product | null;
}
interface SubscriptionWithProduct extends Subscription {
  prices: PriceWithProduct | null;
}

interface Props {
  session: Session | null;
  user: User | null | undefined;
  products: ProductWithPrices[];
  subscription: SubscriptionWithProduct | null;
}

type BillingInterval = 'lifetime' | 'year' | 'month';

export default function PricingComponent({
  session,
  user,
  products,
  subscription
}: Props) {

    const intervals = Array.from(
        new Set(
          products.flatMap((product) =>
            product?.prices?.map((price) => price?.interval)
          )
        )
      );
      const router = useRouter();
      const [billingInterval, setBillingInterval] =
        useState<BillingInterval>('month');
      const [priceIdLoading, setPriceIdLoading] = useState<string>();

      const handleCheckout = async (price: Price) => {
        setPriceIdLoading(price.id);
        if (!user) {
          return router.push('/signin');
        }
        if (subscription) {
          return router.push('/account');
        }
        try {
          const { sessionId } = await postData({
            url: '/api/create-checkout-session',
            data: { price }
          });

          const stripe = await getStripe();
          stripe?.redirectToCheckout({ sessionId });
        } catch (error) {
          return alert((error as Error)?.message);
        } finally {
          setPriceIdLoading(undefined);
        }
      };


  return (
    <div>
      <div className="relative z-10 py-16 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-2 lg:max-w-none">
            <h1 className="text-brand text-base">Pricing</h1>
          </div>
        </div>
      </div>
      <div className="mx-auto lg:container lg:px-16 xl:px-12 flex flex-col">
        <div className="relative z-10 mx-auto -mt-8 w-full px-4 sm:px-6 lg:px-8 ">
          <div className="mx-auto max-w-md grid lg:max-w-none lg:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-2 2xl:gap-5">
            <div className="">
              <div className="flex flex-col overflow-hidden border h-full rounded-[4px]">
                <div className="dark:bg-scale-300 bg-white px-8 xl:px-4 2xl:px-8 pt-6 rounded-tr-[4px] rounded-tl-[4px] ">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-brand-600 dark:text-brand text-2xl font-normal uppercase flex items-center gap-4 font-mono">
                        Free
                      </h3>
                    </div>
                  </div>
                  <p className="text-scale-1100 my-4 text-sm border-b dark:border-scale-500 pb-4 2xl:pr-4">
                    Perfect for passion projects &amp; simple websites.
                  </p>
                  <div
                    className="
                        text-scale-1200 flex items-baseline
                        text-5xl
                        font-normal
                        lg:text-4xl
                        xl:text-4xl
                        border-b
                        dark:border-scale-500
                        min-h-[175px] pt-10"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-end gap-2">
                        <div>
                          <div className="flex items-end">
                            <p className="mt-2 gradient-text-scale-500 dark:gradient-text-scale-100 pb-1 text-5xl">
                              $0
                            </p>
                            <p className="text-scale-900 mb-1.5 ml-1 text-[13px] leading-4">
                              / month / org
                            </p>
                          </div>
                          <p className="-mt-2">
                            <span className="bg-scale-200 text-brand-600 border shadow-sm rounded-md bg-opacity-30 py-0.5 px-2 text-[13px] leading-4">
                              Limit of 2 free organizations
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="dark:border-scale-400 dark:bg-scale-300 flex h-full rounded-bl-[4px] rounded-br-[4px] flex-1 flex-col bg-white px-8 xl:px-4 2xl:px-8 py-6 ">
                  <p className="text-scale-1100 text-[13px] mt-2 mb-4">
                    Get started with:
                  </p>
                  <ul role="list" className="text-[13px] text-scale-1000">
                    <li className="flex items-center py-2 first:mt-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon text-brand h-4 w-4"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="dark:text-scale-1200 mb-0 ml-3 ">
                        Unlimited API requests
                      </span>
                    </li>
                    <li className="flex items-center py-2 first:mt-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon text-brand h-4 w-4"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="dark:text-scale-1200 mb-0 ml-3 ">
                        Social OAuth providers
                      </span>
                    </li>
                    <li className="flex items-center py-2 first:mt-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon text-brand h-4 w-4"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="dark:text-scale-1200 mb-0 ml-3 ">
                        Up to 500MB database space
                      </span>
                    </li>
                    <li className="flex items-center py-2 first:mt-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon text-brand h-4 w-4"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="dark:text-scale-1200 mb-0 ml-3 ">
                        Up to 1GB file storage
                      </span>
                    </li>
                    <li className="flex items-center py-2 first:mt-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon text-brand h-4 w-4"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="dark:text-scale-1200 mb-0 ml-3 ">
                        Up to 5GB bandwidth
                      </span>
                    </li>
                    <li className="flex items-center py-2 first:mt-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon text-brand h-4 w-4"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="dark:text-scale-1200 mb-0 ml-3 ">
                        Up to 50MB file uploads
                      </span>
                    </li>
                    <li className="flex items-center py-2 first:mt-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon text-brand h-4 w-4"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="dark:text-scale-1200 mb-0 ml-3 ">
                        Up to 50,000 monthly active users
                      </span>
                    </li>
                    <li className="flex items-center py-2 first:mt-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon text-brand h-4 w-4"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="dark:text-scale-1200 mb-0 ml-3 ">
                        Up to 500K Edge Function invocations
                      </span>
                    </li>
                    <li className="flex items-center py-2 first:mt-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon text-brand h-4 w-4"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="dark:text-scale-1200 mb-0 ml-3 ">
                        Up to 200 concurrent Realtime connections
                      </span>
                    </li>
                    <li className="flex items-center py-2 first:mt-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon text-brand h-4 w-4"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="dark:text-scale-1200 mb-0 ml-3 ">
                        Up to 2 million Realtime messages
                      </span>
                    </li>
                    <li className="flex items-center py-2 first:mt-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon text-brand h-4 w-4"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="dark:text-scale-1200 mb-0 ml-3 ">
                        1-day log retention
                      </span>
                    </li>
                    <li className="flex items-center py-2 first:mt-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon text-brand h-4 w-4"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="dark:text-scale-1200 mb-0 ml-3 ">
                        Community support
                      </span>
                    </li>
                  </ul>
                  <div className="flex flex-col gap-6 mt-auto prose">
                    <div className="space-y-2 mt-12">
                      <p className="text-[13px] whitespace-pre-wrap">
                        Free projects are paused after 1 week of inactivity.
                      </p>
                    </div>
                    <a href="https://supabase.com/dashboard/new?plan=free">
                      <button
                        type="button"
                        className="relative cursor-pointer space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border bg-brand-600 dark:bg-brand/70 hover:bg-brand-600/80 dark:hover:bg-brand text-white border-brand dark:border-brand focus-visible:outline-brand-600 shadow-sm w-full flex items-center justify-center text-sm leading-4 px-3 py-2"
                      >
                        {' '}
                        <span className="truncate">Get Started</span>{' '}
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-brand-600 dark:bg-brand border px-0.5 lg:-mt-8 rounded-[6px]">
              <p className="text-[13px] leading-4 text-center py-2 text-scale-100">
                Most Popular
              </p>
              <div className="flex flex-col overflow-hidden ">
                <div className="dark:bg-scale-300 bg-white px-8 xl:px-4 2xl:px-8 pt-6 rounded-tr-[4px] rounded-tl-[4px] rounded-tr-[4px] rounded-tl-[4px]">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-brand-600 dark:text-brand text-2xl font-normal uppercase flex items-center gap-4 font-mono">
                        Pro
                      </h3>
                    </div>
                  </div>
                  <p className="text-scale-1100 my-4 text-sm border-b dark:border-scale-500 pb-4 2xl:pr-4">
                    For production applications with the option to scale.
                  </p>
                  <div
                    className="
                        text-scale-1200 flex items-baseline
                        text-5xl
                        font-normal
                        lg:text-4xl
                        xl:text-4xl
                        border-b
                        dark:border-scale-500
                        min-h-[175px] pt-6"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-end gap-2">
                        <div>
                          <p className="text-scale-900 ml-1 text-[13px] leading-4 font-normal">
                            From
                          </p>
                          <div className="flex items-end">
                            <p className="mt-2 gradient-text-scale-500 dark:gradient-text-scale-100 pb-1 text-5xl">
                              $25
                            </p>
                            <p className="text-scale-900 mb-1.5 ml-1 text-[13px] leading-4">
                              / month / org
                            </p>
                          </div>
                          <p className="-mt-2">
                            <span className="bg-scale-200 text-brand-600 border shadow-sm rounded-md bg-opacity-30 py-0.5 px-2 text-[13px] leading-4">
                              Usage-based plan
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="dark:border-scale-400 dark:bg-scale-300 flex h-full rounded-bl-[4px] rounded-br-[4px] flex-1 flex-col bg-white px-8 xl:px-4 2xl:px-8 py-6 mb-0.5 rounded-bl-[4px] rounded-br-[4px]">
                  <p className="text-scale-1100 text-[13px] mt-2 mb-4">
                    Everything in the Free plan, plus:
                  </p>
                  <ul role="list" className="text-[13px] text-scale-1000">
                    <li className="flex items-center py-2 first:mt-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon text-brand h-4 w-4"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="dark:text-scale-1200 mb-0 ml-3 ">
                        No project pausing
                      </span>
                    </li>
                    <li className="flex items-center py-2 first:mt-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon text-brand h-4 w-4"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="dark:text-scale-1200 mb-0 ml-3 ">
                        Daily backups stored for 7 days
                      </span>
                    </li>
                    <li className="flex items-center py-2 first:mt-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon text-brand h-4 w-4"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="dark:text-scale-1200 mb-0 ml-3 ">
                        8GB database space included
                      </span>
                    </li>
                    <li className="flex items-center py-2 first:mt-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon text-brand h-4 w-4"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="dark:text-scale-1200 mb-0 ml-3 ">
                        100GB file storage included
                      </span>
                    </li>
                    <li className="flex items-center py-2 first:mt-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon text-brand h-4 w-4"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="dark:text-scale-1200 mb-0 ml-3 ">
                        250GB bandwidth included
                      </span>
                    </li>
                    <li className="flex items-center py-2 first:mt-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon text-brand h-4 w-4"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="dark:text-scale-1200 mb-0 ml-3 ">
                        5GB file uploads included
                      </span>
                    </li>
                    <li className="flex items-center py-2 first:mt-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon text-brand h-4 w-4"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="dark:text-scale-1200 mb-0 ml-3 ">
                        100,000 monthly active users included
                      </span>
                    </li>
                    <li className="flex items-center py-2 first:mt-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon text-brand h-4 w-4"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="dark:text-scale-1200 mb-0 ml-3 ">
                        2M Edge Function invocations included
                      </span>
                    </li>
                    <li className="flex items-center py-2 first:mt-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon text-brand h-4 w-4"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="dark:text-scale-1200 mb-0 ml-3 ">
                        500 concurrent Realtime connections included
                      </span>
                    </li>
                    <li className="flex items-center py-2 first:mt-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon text-brand h-4 w-4"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="dark:text-scale-1200 mb-0 ml-3 ">
                        5 million Realtime messages included
                      </span>
                    </li>
                    <li className="flex items-center py-2 first:mt-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon text-brand h-4 w-4"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="dark:text-scale-1200 mb-0 ml-3 ">
                        7-day log retention
                      </span>
                    </li>
                    <li className="flex items-center py-2 first:mt-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon text-brand h-4 w-4"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="dark:text-scale-1200 mb-0 ml-3 ">
                        Email support
                      </span>
                    </li>
                  </ul>
                  <div className="flex flex-col gap-6 mt-auto prose">
                    <div className="space-y-2 mt-12">
                      <p className="text-[13px] whitespace-pre-wrap">
                        Your cost control settings determine if you allow
                        over-usage.
                      </p>
                    </div>
                    <a href="https://supabase.com/dashboard/new?plan=pro">
                      <button
                        type="button"
                        className="relative cursor-pointer space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border bg-brand-600 dark:bg-brand/70 hover:bg-brand-600/80 dark:hover:bg-brand text-white border-brand dark:border-brand focus-visible:outline-brand-600 shadow-sm w-full flex items-center justify-center text-sm leading-4 px-3 py-2"
                      >
                        {' '}
                        <span className="truncate">Get Started</span>{' '}
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="">
              <div className="flex flex-col overflow-hidden border h-full rounded-[4px]">
                <div className="dark:bg-scale-300 bg-white px-8 xl:px-4 2xl:px-8 pt-6 rounded-tr-[4px] rounded-tl-[4px] ">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-brand-600 dark:text-brand text-2xl font-normal uppercase flex items-center gap-4 font-mono">
                        Team
                      </h3>
                      <span className="bg-brand-300 text-brand-600 rounded-md bg-opacity-30 py-0.5 px-2 text-[13px] leading-4">
                        New
                      </span>
                    </div>
                  </div>
                  <p className="text-scale-1100 my-4 text-sm border-b dark:border-scale-500 pb-4 2xl:pr-4">
                    Collaborate with different permissions and access patterns.
                  </p>
                  <div
                    className="
                        text-scale-1200 flex items-baseline
                        text-5xl
                        font-normal
                        lg:text-4xl
                        xl:text-4xl
                        border-b
                        dark:border-scale-500
                        min-h-[175px] pt-6"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-end gap-2">
                        <div>
                          <p className="text-scale-900 ml-1 text-[13px] leading-4 font-normal">
                            From
                          </p>
                          <div className="flex items-end">
                            <p className="mt-2 gradient-text-scale-500 dark:gradient-text-scale-100 pb-1 text-5xl">
                              $599
                            </p>
                            <p className="text-scale-900 mb-1.5 ml-1 text-[13px] leading-4">
                              / month / org
                            </p>
                          </div>
                          <p className="-mt-2">
                            <span className="bg-scale-200 text-brand-600 border shadow-sm rounded-md bg-opacity-30 py-0.5 px-2 text-[13px] leading-4">
                              Usage-based plan
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="dark:border-scale-400 dark:bg-scale-300 flex h-full rounded-bl-[4px] rounded-br-[4px] flex-1 flex-col bg-white px-8 xl:px-4 2xl:px-8 py-6 ">
                  <p className="text-scale-1100 text-[13px] mt-2 mb-4">
                    Everything in the Pro plan, plus:
                  </p>
                  <ul role="list" className="text-[13px] text-scale-1000">
                    <li className="flex items-center py-2 first:mt-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon text-brand h-4 w-4"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="dark:text-scale-1200 mb-0 ml-3 ">
                        Additional Organization member roles
                      </span>
                    </li>
                    <li className="flex items-center py-2 first:mt-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon text-brand h-4 w-4"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="dark:text-scale-1200 mb-0 ml-3 ">
                        Daily backups stored for 14 days
                      </span>
                    </li>
                    <li className="flex items-center py-2 first:mt-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon text-brand h-4 w-4"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="dark:text-scale-1200 mb-0 ml-3 ">
                        Standardised Security Questionnaire
                      </span>
                    </li>
                    <li className="flex items-center py-2 first:mt-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon text-brand h-4 w-4"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="dark:text-scale-1200 mb-0 ml-3 ">
                        SOC2
                      </span>
                    </li>
                    <li className="flex items-center py-2 first:mt-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon text-brand h-4 w-4"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="dark:text-scale-1200 mb-0 ml-3 ">
                        HIPAA
                      </span>
                    </li>
                    <li className="flex items-center py-2 first:mt-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon text-brand h-4 w-4"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="dark:text-scale-1200 mb-0 ml-3 ">
                        SSO for Supabase Dashboard
                      </span>
                    </li>
                    <li className="flex items-center py-2 first:mt-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon text-brand h-4 w-4"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="dark:text-scale-1200 mb-0 ml-3 ">
                        Priority email support &amp; SLAs
                      </span>
                    </li>
                    <li className="flex items-center py-2 first:mt-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon text-brand h-4 w-4"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="dark:text-scale-1200 mb-0 ml-3 ">
                        28-day log retention
                      </span>
                    </li>
                  </ul>
                  <div className="flex flex-col gap-6 mt-auto prose">
                    <div className="space-y-2 mt-12">
                      <p className="text-[13px] whitespace-pre-wrap">
                        Additional fees apply for usage beyond included usage.
                      </p>
                    </div>
                    <a href="https://supabase.com/dashboard/new?plan=team">
                      <button
                        type="button"
                        className="relative cursor-pointer space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border bg-brand-600 dark:bg-brand/70 hover:bg-brand-600/80 dark:hover:bg-brand text-white border-brand dark:border-brand focus-visible:outline-brand-600 shadow-sm w-full flex items-center justify-center text-sm leading-4 px-3 py-2"
                      >
                        {' '}
                        <span className="truncate">Get Started</span>{' '}
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
            <div className="">
              <div className="flex flex-col overflow-hidden border h-full rounded-[4px]">
                <div className="dark:bg-scale-300 bg-white px-8 xl:px-4 2xl:px-8 pt-6 rounded-tr-[4px] rounded-tl-[4px] ">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-brand-600 dark:text-brand text-2xl font-normal uppercase flex items-center gap-4 font-mono">
                        Enterprise
                      </h3>
                    </div>
                  </div>
                  <p className="text-scale-1100 my-4 text-sm border-b dark:border-scale-500 pb-4 2xl:pr-4">
                    For large-scale applications managing serious workloads.
                  </p>
                  <div
                    className="
                        text-scale-1200 flex items-baseline
                        text-5xl
                        font-normal
                        lg:text-4xl
                        xl:text-4xl
                        border-b
                        dark:border-scale-500
                        min-h-[175px] pt-10"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-end gap-2">
                        <div>
                          <div className="flex items-end">
                            <p className="mt-2 gradient-text-scale-500 dark:gradient-text-scale-100 pb-1 text-4xl">
                              Contact us
                            </p>
                            <p className="text-scale-900 mb-1.5 ml-1 text-[13px] leading-4"></p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="dark:border-scale-400 dark:bg-scale-300 flex h-full rounded-bl-[4px] rounded-br-[4px] flex-1 flex-col bg-white px-8 xl:px-4 2xl:px-8 py-6 ">
                  <ul role="list" className="text-[13px] text-scale-1000">
                    <li className="flex items-center py-2 first:mt-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon text-brand h-4 w-4"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="dark:text-scale-1200 mb-0 ml-3 ">
                        Designated Support manager &amp; SLAs
                      </span>
                    </li>
                    <li className="flex items-center py-2 first:mt-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon text-brand h-4 w-4"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="dark:text-scale-1200 mb-0 ml-3 ">
                        SSO/SAML
                      </span>
                    </li>
                    <li className="flex items-center py-2 first:mt-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon text-brand h-4 w-4"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="dark:text-scale-1200 mb-0 ml-3 ">
                        On-premise support
                      </span>
                    </li>
                    <li className="flex items-center py-2 first:mt-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon text-brand h-4 w-4"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="dark:text-scale-1200 mb-0 ml-3 ">
                        24×7×365 premium enterprise support
                      </span>
                    </li>
                    <li className="flex items-center py-2 first:mt-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon text-brand h-4 w-4"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="dark:text-scale-1200 mb-0 ml-3 ">
                        Custom Security Questionnaires
                      </span>
                    </li>
                    <li className="flex items-center py-2 first:mt-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="sbui-icon text-brand h-4 w-4"
                        aria-hidden="true"
                      >
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                      <span className="dark:text-scale-1200 mb-0 ml-3 ">
                        Private Slack channel
                      </span>
                    </li>
                  </ul>
                  <div className="flex flex-col gap-6 mt-auto prose">
                    <div className="space-y-2 mt-12"></div>
                    <a href="https://forms.supabase.com/enterprise">
                      <button
                        type="button"
                        className="relative cursor-pointer space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border bg-brand-600 dark:bg-brand/70 hover:bg-brand-600/80 dark:hover:bg-brand text-white border-brand dark:border-brand focus-visible:outline-brand-600 shadow-sm w-full flex items-center justify-center text-sm leading-4 px-3 py-2"
                      >
                        {' '}
                        <span className="truncate">Contact Us</span>{' '}
                      </button>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center mt-20">
        <a href="#compare-plans">
          <button
            type="button"
            className="relative justify-center cursor-pointer inline-flex items-center space-x-2 text-center font-regular ease-out duration-200 rounded-md outline-none transition-all outline-0 focus-visible:outline-4 focus-visible:outline-offset-1 border text-scale-1200 bg-scale-100 hover:bg-scale-300 border-scale-600 hover:border-scale-700 dark:border-scale-700 hover:dark:border-scale-800 dark:bg-scale-500 dark:hover:bg-scale-600 focus-visible:outline-brand-600 shadow-sm text-xs px-2.5 py-1"
          >
            {' '}
            <span className="truncate">Compare Plans</span>{' '}
          </button>
        </a>
      </div>
    </div>
  );
}
