import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-100 text-gray-700 text-sm mt-10 border-t">
      <div className="max-w-6xl mx-auto px-4 py-6 md:flex-row justify-between items-center gap-4">
        <div className="flex space-x-6">
          <Link href="https://www.artinex.jp/" className="text-gray-500 font-bold hover:text-gray-700 no-underline">
            会社概要
          </Link>
          <Link href="/" className="text-gray-500 font-bold hover:text-gray-700 no-underline">
            イベント一覧
          </Link>
          <Link href="https://www.artinex.jp/tokushoho" className="text-gray-500 font-bold hover:text-gray-700 no-underline">
            特定商取引法に基づく表示
          </Link>
          <Link href="https://www.artinex.jp/contact" className="text-gray-500 font-bold hover:text-gray-700 no-underline">
            お問い合わせ
          </Link>
        </div>
        <div className="text-center text-xs">
          <p className="text-xs text-gray-400">&copy; {new Date().getFullYear()} Artinex 合同会社</p>
        </div>
      </div>
    </footer>
  );
}