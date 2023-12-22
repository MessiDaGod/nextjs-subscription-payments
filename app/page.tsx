import {
  getSession,
  getSubscription,
  getActiveProductsWithPrices,
  getProductDetails
} from '@/app/supabase-server';
import PricingComponent from '@/components/PricingComponent';
import { Provider } from 'react-redux'
import { store } from './store';


export default async function PricingPage() {
  const [session, products, subscription, productDetails] = await Promise.all([
    getSession(),
    getActiveProductsWithPrices(),
    getSubscription(),
    getProductDetails()
  ]);

  return (
    <Provider store={store}>
    <PricingComponent
      session={session}
      user={session?.user}
      products={products}
      subscription={subscription}
      productDetails={productDetails}
    />
    </Provider>
  );
}
