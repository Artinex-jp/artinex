import Link from "next/link";
import Head from "next/head";

export default function PaymentCancel() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-red-50">
      <Head>
        <title>お支払いキャンセル｜Artinex</title>
        <meta name="description" content="お支払いはキャンセルされました。再度お手続きを行うか、お問い合わせください。"/>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://your-domain.com/payment/cancel"/>
        <meta property="og:title" content="お支払いキャンセル｜Artinex" />
        <meta property="og:description" content="お支払いはキャンセルされました。再度お手続きを行うか、お問い合わせください。"/>
        <meta property="og:url" content="https://your-domain.com/payment/cancel" />
        <meta property="og:type" content="website" />
      </Head>
      <h1 className="text-3xl font-bold text-red-600 mb-4">お支払いがキャンセルされました</h1>
      <Link href="/" className="font-bold text-gray-500 hover:text-gray-600 no-underline">
        イベント一覧に戻る
      </Link>
    </div>
  );
}