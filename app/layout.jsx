import SupabaseProvider from './supabase-provider';
import Footer from '@/components/ui/Footer';
import Navbar from '@/components/ui/Navbar';
import 'styles/main.css';
var meta = {
    title: 'Next.js Subscription Starter',
    description: 'Brought to you by Vercel, Stripe, and Supabase.',
    cardImage: '/og.png',
    robots: 'follow, index',
    favicon: '/favicon.ico',
    url: 'https://subscription-starter.vercel.app',
    type: 'website'
};
export var metadata = {
    title: meta.title,
    description: meta.description,
    cardImage: meta.cardImage,
    robots: meta.robots,
    favicon: meta.favicon,
    url: meta.url,
    type: meta.type,
    openGraph: {
        url: meta.url,
        title: meta.title,
        description: meta.description,
        cardImage: meta.cardImage,
        type: meta.type,
        site_name: meta.title
    },
    twitter: {
        card: 'summary_large_image',
        site: '@vercel',
        title: meta.title,
        description: meta.description,
        cardImage: meta.cardImage
    }
};
export default function RootLayout(_a) {
    var 
    // Layouts must accept a children prop.
    // This will be populated with nested layouts or pages
    children = _a.children;
    return (<html lang="en">
      <body className="bg-black loading">
        <SupabaseProvider>
          <Navbar />
          <main id="skip" className="min-h-[calc(100dvh-4rem)] md:min-h[calc(100dvh-5rem)]">
            {children}
          </main>
          <Footer />
        </SupabaseProvider>
      </body>
    </html>);
}
