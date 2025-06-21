import { useEffect, useState } from "react";
import Link from "next/link";

interface Event {
  id: string;
  title: string;
  subTitle: string;
  description: string;
}

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

    useEffect(() => {
      const fetchEvents = async () => {
        try {
          const res = await fetch("/api/events");
          const data = await res.json();
          setEvents(data);
        } catch (error) {
          console.error("Failed to fetch events:", error);
        } finally {
          setLoading(false);
        }
      }

      fetchEvents()
      console.log(events)
    }, [])
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">イベント一覧</h1>
        {loading ? (
          <p>読み込み中...</p>
        ) : events.length === 0 ? (
          <p>イベントが見つかりませんでした。</p>
        ) : (
          <ul className="space-y-4">
            {events.map((event) => (
              <li key={event.id} className="border p-4 rounded shadow">
                <h2 className="text-xl font-semibold">{event.title}</h2>
                <Link href={`/events/${event.id}`} className="text-blue-600 hover:underline mt-2 inline-block">
                  詳細を見る
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
}