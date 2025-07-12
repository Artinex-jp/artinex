import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toCamelCase } from '@/utils/toCamelCase';
import Head from 'next/head';

export default function AdminIndexPage() {
  const [events, setEvents] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('events').select('id, title').then(({ data }) => {
      setEvents(toCamelCase(data) || []);
    });
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Head>
        <title>管理者｜Artinex</title>
        <meta name="description" content="管理者"/>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <h1 className="text-2xl font-bold">管理メニュー</h1>

      <section>
        <h2 className="text-xl font-semibold mb-4">イベント一覧</h2>
        <ul className="space-y-4">
          {events.map(event => (
            <li key={event.id} className="border rounded p-4 bg-white shadow">
              <div className="font-bold text-lg">{event.title}</div>
              <div className="flex flex-wrap gap-3 mt-3">
                <Link href={`/admin/events/${event.id}`}>このイベントの公演を管理</Link>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
          <Link href={`/admin/events/new`} className="block text-center px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 transition">イベント作成</Link>
          <Link href={`/admin/performances/new`} className="block text-center px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 transition">公演作成</Link>
          <Link href={`/admin/items/new`} className="block text-center px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 transition">アイテム作成</Link>
          <Link href={`/admin/performance-pieces/new`} className="block text-center px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 transition">プログラム作成</Link>
          <Link href={`/admin/artists/new`} className="block text-center px-4 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 transition">アーティスト作成</Link>
        </div>
      </section>
    </div>
  );
}
