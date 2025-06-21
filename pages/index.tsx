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
    })
    return (
        <div>aa</div>
    )
}