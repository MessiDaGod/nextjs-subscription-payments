import {
  getSession,
  getSubscription,
  getActiveProductsWithPrices,
  getProductDetails
} from '@/app/supabase-server';
import Pricing from '@/components/Pricing';
import PricingComponent from '@/components/PricingComponent';

export default async function PricingPage() {
  const [session, products, subscription, productDetails] = await Promise.all([
    getSession(),
    getActiveProductsWithPrices(),
    getSubscription(),
    getProductDetails()
  ]);

  return (
    <PricingComponent
      session={session}
      user={session?.user}
      products={products}
      subscription={subscription}
      productDetails={productDetails}
    />
  );
}
