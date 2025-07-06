import Link from "next/link";

export default function PaymentCancel() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-red-50">
      <h1 className="text-3xl font-bold text-red-600 mb-4">お支払いがキャンセルされました</h1>
      <Link href="/" className="font-bold text-gray-500 hover:text-gray-600 no-underline">
        イベント一覧に戻る
      </Link>
    </div>
  );
}