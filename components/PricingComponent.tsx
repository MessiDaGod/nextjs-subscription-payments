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
type ProductDetails = Database['public']['Tables']['product_details']['Row'];

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
  productDetails: ProductDetails[];
}

type BillingInterval = 'lifetime' | 'year' | 'month';

export default function PricingComponent({
  session,
  user,
  products,
  subscription,
  productDetails
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
    <div className="light">
      <div className="relative z-10 py-16 lg:py-28">
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl space-y-2 lg:max-w-none">
            <h1 className="text-4xl font-extrabold text-white sm:text-center sm:text-6xl">
              Pricing
            </h1>
          </div>
        </div>
      </div>
      <div className="mx-auto lg:container lg:px-16 xl:px-12 flex flex-col">
        <div className="relative z-10 mx-auto -mt-8 w-full px-4 sm:px-6 lg:px-8 ">
          <div className="mx-auto max-w-md grid lg:max-w-none lg:grid-cols-2 xl:grid-cols-4 gap-4 xl:gap-2 2xl:gap-5">
            {/* Plans */}
            {products.map((product, index: number) => {
              const detailsForProduct = productDetails.filter(detail => detail.product_id === product.id);

              const renderedDetails = detailsForProduct.map(detail => (
                  <li className="flex items-center py-2 first:mt-0" key={detail.id}>
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
                    {detail.detail_text}
                  </span>
                </li>
              ));

              return (
                <React.Fragment key={product.id}>
                  <div
                    className={
                      index === 0
                        ? 'bg-brand-600 dark:bg-brand border px-0.5 lg:-mt-8 rounded-[6px]'
                        : ''
                    }
                  >
                    {index === 0 && (
                      <p className="text-[13px] leading-4 text-center py-2 text-scale-100">
                        Most Popular
                      </p>
                    )}
                    <div className="flex flex-col overflow-hidden border h-full rounded-[4px]">
                      <div className="dark:bg-scale-300 bg-white px-8 xl:px-4 2xl:px-8 pt-6 rounded-tr-[4px] rounded-tl-[4px] ">
                        <div className="mb-2 flex items-center gap-2">
                          <div className="flex items-center gap-2">
                            <h3 className="text-brand-600 dark:text-brand text-2xl font-normal uppercase flex items-center gap-4 font-mono">
                              {product.name}
                            </h3>
                          </div>
                        </div>
                        <p className="text-scale-1100 my-4 text-sm border-b dark:border-scale-500 pb-4 2xl:pr-4">
                          {product.description}
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
                              {product.prices?.map((price) => {
                                const priceString =
                                  price.unit_amount &&
                                  new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: price.currency!,
                                    minimumFractionDigits: 0
                                  }).format(price.unit_amount);

                                return (
                                  <div key={price.id}>
                                    <div>
                                      <div className="flex items-end">
                                        <p className="mt-2 gradient-text-scale-500 dark:gradient-text-scale-100 pb-1 text-5xl">
                                          {priceString}
                                        </p>
                                        <p className="text-scale-900 mb-1.5 ml-1 text-[13px] leading-4">
                                          / unit
                                        </p>
                                      </div>
                                      <p className="-mt-2">
                                        <span className="bg-scale-200 text-brand-600 border shadow-sm rounded-md bg-opacity-30 py-0.5 px-2 text-[13px] leading-4">
                                          {index === 2
                                            ? 'Fixed price'
                                            : 'Usage-based plan'}
                                        </span>
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="dark:border-scale-400 dark:bg-scale-300 flex h-full rounded-bl-[4px] rounded-br-[4px] flex-1 flex-col bg-white px-8 xl:px-4 2xl:px-8 py-6 ">
                        <p className="text-scale-1100 text-[13px] mt-2 mb-4">
                          Get started with:
                        </p>
                        <ul role="list" className="text-[13px] text-scale-1000">
                          {renderedDetails}
                        </ul>
                        <div className="flex flex-col gap-6 mt-auto prose">
                          <div className="space-y-2 mt-12">
                            <p className="text-[13px] whitespace-pre-wrap">
                              Free projects are paused after 3 months of
                              inactivity.
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
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
