import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { supabase } from "@/lib/supabaseClient";
import { formatDate } from "@/utils/formatDate";
import LoadingOverlay from "@/components/LoadingOverlay";
import Footer from "@/components/Footer";

interface Event {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  images: any;
  performances: any;
}

export default function HomePage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/events");
        if (!res.ok) throw new Error("Fetch failed");
        const data = await res.json();
        setEvents(data);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
        <div className="max-w-3xl mx-auto text-center mb-10 px-4">
          <h1 className="text-3xl font-bold mb-2">Artinex's Events</h1>
          <p className="text-gray-600">
            多彩なアーティストが奏でる、特別なイベントをご紹介します。
          </p>
        </div>
      {loading ? (
        <LoadingOverlay />
      ) : events.length === 0 ? (
        <p>イベントが見つかりませんでした。</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => {
            if (event.images.length === 0) return (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="block bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 no-underline"
              >
                <div
                  className="bg-gray-200 overflow-hidden h-48"
                >
                </div>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-1">{event.title}</h2>
                    <p className="text-sm text-gray-500 mb-3">{event.subtitle}</p>
                    <p className="text-sm text-right text-gray-500 mb-1">{event.performances[0].eventPlace.name}</p>
                    <p className="text-sm text-right text-gray-500 mb-1">{formatDate(event.performances[0].date, "YYYY年M月D日(E)")}</p>
                    <p className="text-gray-700 text-sm line-clamp-3 mb-4">{event.description}</p>
                  </div>
              </Link>
            );
            const img = event.images.length > 0 && event.images[0]
            const publicUrl = event.images.length > 0 && supabase.storage.from('flyers').getPublicUrl(img.image_path).data.publicUrl;
            if (publicUrl) return (
              <Link
                key={event.id}
                href={`/events/${event.id}`}
                className="block bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 no-underline"
              >
                <div
                  className="bg-gray-200 overflow-hidden"
                >
                  <Image
                    src={publicUrl}
                    alt={event.title}
                    width={600}
                    height={300}
                    className="w-full h-48 object-contain aspect-[16/9]"
                  />
                </div>
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-1">{event.title}</h2>
                    <p className="text-sm text-gray-500 mb-3">{event.subtitle}</p>
                    <p className="text-sm text-right text-gray-500 mb-1">{event.performances[0].eventPlace.name}</p>
                    <p className="text-sm text-right text-gray-500 mb-1">{formatDate(event.performances[0].date, "YYYY年M月D日(E)")}</p>
                    <p className="text-gray-700 text-sm line-clamp-3 mb-4">{event.description}</p>
                  </div>
              </Link>
            )
          })
          }
        </div>
      )}
    </div>
  );
}