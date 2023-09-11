'use client';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { createContext, useContext, useEffect, useState } from 'react';
var Context = createContext(undefined);
export default function SupabaseProvider(_a) {
    var children = _a.children;
    var supabase = useState(function () { return createPagesBrowserClient(); })[0];
    var router = useRouter();
    useEffect(function () {
        var subscription = supabase.auth.onAuthStateChange(function (event) {
            if (event === 'SIGNED_IN')
                router.refresh();
        }).data.subscription;
        return function () {
            subscription.unsubscribe();
        };
    }, [router, supabase]);
    return (<Context.Provider value={{ supabase: supabase }}>
      <>{children}</>
    </Context.Provider>);
}
export var useSupabase = function () {
    var context = useContext(Context);
    if (context === undefined) {
        throw new Error('useSupabase must be used inside SupabaseProvider');
    }
    return context;
};
