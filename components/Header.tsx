"use client"

import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import { ChevronLeft } from "lucide-react";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

export default function Header() {
  const supabase = createPagesBrowserClient()
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setIsLoggedIn(!!user)
    }

    checkAuth()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut().then(() => setIsLoggedIn(false))
    router.push("/admin/login")
  }

  return (
    <header className="relative h-12 border-b bg-white flex items-center justify-center">
      <div
        onClick={() => router.back()}
        role="button"
        tabIndex={0}
        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black cursor-pointer"
      >
        <ChevronLeft size={28} />
      </div>

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
      {isLoggedIn && (
        <button
          onClick={handleLogout}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black cursor-pointern bg-white shadow-none hover:bg-white"
        >
          ログアウト
        </button>
      )}
    </header>
  );
}
