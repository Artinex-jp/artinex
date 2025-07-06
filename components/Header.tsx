import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";

export default function Header() {
  const router = useRouter();

  return (
    <header className="relative h-12 border-b bg-white flex items-center justify-center">
      {/* 左側：戻るアイコン（ボタンではなくdiv） */}
      <div
        onClick={() => router.back()}
        role="button"
        tabIndex={0}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black cursor-pointer"
      >
        <ChevronLeft size={28} />
      </div>

      {/* 中央：ロゴ画像 */}
      <Link
        href="/"
        className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
      >
        <Image
          src="/artinex_logo.png"
          alt="Artinex ロゴ"
          width={120}
          height={32}
          priority
        />
      </Link>
    </header>
  );
}
