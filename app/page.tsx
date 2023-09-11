import {
  getSession,
  getSubscription,
  getActiveProductsWithPrices
} from '@/app/supabase-server';
import Pricing from '@/components/Pricing';
import PricingComponent from '@/components/PricingComponent';

export default async function PricingPage() {
  const [session, products, subscription] = await Promise.all([
    getSession(),
    getActiveProductsWithPrices(),
    getSubscription()
  ]);

  return (
    <PricingComponent
      session={session}
      user={session?.user}
      products={products}
      subscription={subscription}
    />
  );
}
