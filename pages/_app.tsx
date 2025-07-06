import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

export default function MyApp({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header/>
      <main className="flex-grow">
        <Component {...pageProps} />
      </main>
      <Footer/>
    </div>
  ) 
}