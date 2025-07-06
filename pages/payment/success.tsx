import Link from "next/link";

export default function PaymentSuccess() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center bg-green-50">
      <h1 className="text-3xl font-bold text-green-700 mb-4">お支払いが完了しました！</h1>
      <p className="text-gray-700 mb-6">ご予約ありがとうございます。確認メールをお送りしております。</p>
      <Link href="/" className="font-bold text-gray-500 hover:text-gray-600 no-underline">
        イベント一覧に戻る
      </Link>
    </div>
  );
}