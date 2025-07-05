import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { toCamelCase } from '@/utils/toCamelCase';

export default function EventDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [event, setEvent] = useState<any>(null);
  const [performances, setPerformances] = useState<any[]>([]);
  const [performanceItems, setPerformanceItems] = useState<any[]>([]);
  const [newItem, setNewItem] = useState<{ title: string; price: number; note: string; performanceIds: string[] }>({
    title: '',
    price: 0,
    note: '',
    performanceIds: [],
  });

  useEffect(() => {
    if (!id) return;

    supabase.from('events').select('*').eq('id', id).single().then(({ data }) => setEvent(toCamelCase(data)));
    supabase.from('performances').select('*, eventPlace: event_place_id(*)').eq('event_id', id).then(({ data }) => setPerformances(toCamelCase(data) || []));
    supabase.from('performance_items').select('*, item: item_id(*), performance: performance_id(*)').then(({ data }) => {
      const all = toCamelCase(data) || [];
      const filtered = all.filter((pi: any) => pi.performance?.eventId === id);
      setPerformanceItems(filtered);
    });
  }, [id]);

  const handleItemCreate = async () => {
    if (!newItem.title || newItem.performanceIds.length === 0) return;

    const { data, error } = await supabase.from('items').insert({
      title: newItem.title,
      price: newItem.price,
      note: newItem.note,
    }).select().single();

    if (data && !error) {
      const inserts = newItem.performanceIds.map(pid => ({
        performance_id: pid,
        item_id: data.id,
      }));
      await supabase.from('performance_items').insert(inserts);
      alert('アイテムを追加しました');
      setNewItem({ title: '', price: 0, note: '', performanceIds: [] });
    } else {
      alert('追加に失敗しました');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">イベント詳細</h1>

      {event && (
        <section>
          <h2 className="text-xl font-semibold">{event.title}</h2>
        </section>
      )}

      <section>
        <h2 className="text-xl font-semibold">公演一覧</h2>
        <ul className="space-y-2">
          {performances.map(perf => (
            <li key={perf.id} className="border rounded p-3">
              <div className="font-bold">{perf.title}</div>
              <div className="text-sm text-gray-600">{perf.date}</div>
              <div>
                <a href={`/admin/performances/${perf.id}`} className="text-blue-600 underline">公演を開く</a>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">このイベントのアイテム一覧</h2>
        <ul className="space-y-2">
          {performanceItems.map((pi, index) => (
            <li key={index} className="border p-3 rounded">
              {pi.item?.title}（{pi.item?.price}円） - 公演: {pi.performance?.title}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">アイテムを追加</h2>
        <div className="space-y-2">
          <input
            type="text"
            placeholder="タイトル"
            className="w-full border px-2 py-1 rounded"
            value={newItem.title}
            onChange={e => setNewItem(prev => ({ ...prev, title: e.target.value }))}
          />
          <input
            type="number"
            placeholder="価格"
            className="w-full border px-2 py-1 rounded"
            value={newItem.price}
            onChange={e => setNewItem(prev => ({ ...prev, price: Number(e.target.value) }))}
          />
          <textarea
            placeholder="注記"
            className="w-full border px-2 py-1 rounded"
            value={newItem.note}
            onChange={e => setNewItem(prev => ({ ...prev, note: e.target.value }))}
          />
          <div className="space-y-1">
            <p className="font-semibold">紐づける公演を選択</p>
            {performances.map(perf => {
              const checked = newItem.performanceIds.includes(perf.id);
              return (
                <label
                  key={perf.id}
                  className={`checkbox-button ${checked ? 'checkbox-button-selected' : 'checkbox-button-unselected'}`}
                >
                  <input
                    type="checkbox"
                    value={perf.id}
                    checked={checked}
                    onChange={(e) => {
                      setNewItem(prev => {
                        const updated = e.target.checked
                          ? [...prev.performanceIds, perf.id]
                          : prev.performanceIds.filter(id => id !== perf.id);
                        return { ...prev, performanceIds: updated };
                      });
                    }}
                    className="hidden"
                  />
                  <span className="flex-1">{perf.eventPlace?.name} - {perf.date}</span>
                  <span className={`checkbox-icon ${checked ? 'checkbox-icon-selected' : 'checkbox-icon-unselected'}`}>
                    {checked && (
                      <svg className="checkbox-check" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </span>
                </label>
              );
            })}
          </div>
          <button
            onClick={handleItemCreate}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            アイテムを作成して追加
          </button>
        </div>
      </section>
    </div>
  );
}
