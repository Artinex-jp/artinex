import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { useState } from 'react'
import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createPagesBrowserClient } from '@supabase/auth-helpers-nextjs';

export default function MyApp({ Component, pageProps }: AppProps) {
  const [supabaseClient] = useState(() =>
    createPagesBrowserClient({
      supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL!,
      supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    })
  );
  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.initialSession}
    >
      <div className="min-h-screen flex flex-col">
        <Header/>
        <main className="flex-grow">
          <Component {...pageProps} />
        </main>
        <Footer/>
      </div>
    </SessionContextProvider>
  ) 
}