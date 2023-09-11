import Pricing from '@/components/Pricing';
import PricingComponent from '@/components/PricingComponent';
import {
  getSession,
  getSubscription,
  getActiveProductsWithPrices
} from '@/app/supabase-server';

export default async function PricingPage() {
  const [session, products, subscription] = await Promise.all([
    getSession(),
    getActiveProductsWithPrices(),
    getSubscription()
  ]);

  return (
    // <Pricing
    //   session={session}
    //   user={session?.user}
    //   products={products}
    //   subscription={subscription}
    // />
    <PricingComponent
      session={session}
      user={session?.user}
      products={products}
      subscription={subscription}
    />
  );
}
