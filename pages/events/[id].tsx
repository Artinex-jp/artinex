import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ReservationModal from "../../components/ReservationModal";

interface EventData {
  id: string
  title: string
  description?: string
  performances: {
    id: string
    title: string
    eventPlace: {
      id: string
      name: string
    }
    performanceItem: {
      item: {
        id: string
        title: string
        price: number
      }
    }[]
  }[]
}

export default function EventDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const [event, setEvent] = useState<EventData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    if (!id) return
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/event?id=${id}`)
        const data = await res.json()
        setEvent(data)
      } catch (error) {
        console.error('Error fetching event:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchEvent()
  }, [id])

  if (loading) return <p>読み込み中...</p>
  if (!event) return <p>イベントが見つかりませんでした</p>

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <p className="mb-6">{event.description}</p>

      {event.performances.map((perf) => (
        <div key={perf.id} className="border p-4 mb-4">
          <h2 className="text-xl font-semibold">{perf.title}</h2>
          <p className="text-sm text-gray-600">会場: {perf.eventPlace.name}</p>
          <ul className="mt-2">
            {perf.performanceItem.map(({ item }) => (
              <li key={item.id} className="flex justify-between">
                <span>{item.title}</span>
                <span>{item.price}円</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
			  <div>
          <button
            onClick={() => setShowModal(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
          >
            予約する
          </button>

          {showModal && <ReservationModal event={event} onClose={() => setShowModal(false)} />}
        </div>
    </div>
  )
} 