import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ReservationModal from "../../components/features/ReservationModal";

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
    performanceItems: {
      item: {
        id: string
        title: string
        price: number
      }
    }[]
    performancePieces: {
      id: string
      notes?: string
      piece: {
        id: string
        title: string
        composer?: {
          id: string
          name: string
        }
      }
      performancePieceArtists: {
        id: string
        role: string
        artist: {
          id: string
          name: string
        }
      }[]
    }[]
  }[]
}

type OrderItem = { itemId: string; quantity: number };
type ReservationForm = {
  customer: { lastName: string; firstName: string; email: string; tel: string };
  paymentMethod: string;
  amountTotal: number;
  orderItem: OrderItem[];
};

export default function EventDetailPage() {
  const router = useRouter()
  const { id } = router.query
  const [event, setEvent] = useState<EventData | null>(null)
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false);
  const [step, setStep] = useState<"form" | "confirm" | "done">("form");
  const [form, setForm] = useState<ReservationForm>({
    customer: { lastName: "", firstName: "", email: "", tel: "" },
    paymentMethod: "銀行振り込み",
    amountTotal: 0,
    orderItem: [],
  });
  const [quantities, setQuantities] = useState<{ [itemId: string]: number }>({});

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
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-4">{event.title}</h1>
      <p className="mb-6">{event.description}</p>

      {event.performances.map((perf) => (
        <div key={perf.id} className="bg-white shadow-md rounded-xl p-6 mb-8 border border-gray-200">
          <h2 className="text-2xl font-bold mb-1">{perf.title}</h2>
          <p className="text-sm text-gray-500 mb-4">会場: {perf.eventPlace.name}</p>

          {/* チケット情報 */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1">チケット</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {perf.performanceItems.map(({ item }) => (
                <li key={item.id} className="bg-gray-100 px-4 py-2 rounded-md flex justify-between">
                  <span>{item.title}</span>
                  <span className="font-semibold">{item.price.toLocaleString()}円</span>
                </li>
              ))}
            </ul>
          </div>

          {/* プログラム */}
          <div>
            <h3 className="text-lg font-semibold mb-3">プログラム</h3>
            {perf.performancePieces.map((pp) => (
              <div key={pp.id} className="bg-gray-50 border-l-4 border-blue-400 pl-4 pr-2 py-2 mb-4 rounded">
                <div className="text-base font-semibold">
                  {pp.piece.title}
                  {pp.piece.composer && (
                    <span className="ml-2 text-sm text-gray-600 italic">（{pp.piece.composer.last_name} 作曲）</span>
                  )}
                </div>
                {pp.notes && (
                  <div className="text-sm text-gray-500 mt-1 ml-1">※ {pp.notes}</div>
                )}
                <ul className="mt-2 space-y-1 text-sm text-gray-700 ml-2">
                  {pp.performancePieceArtists.map((ppa) => (
                    <li key={ppa.id} className="flex items-center gap-2">
                      <span className="text-blue-500">🎤</span>
                      <span>{ppa.artist.name}</span>
                      <span className="text-gray-500">（{ppa.role}）</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      ))}


      <div>
        <button
          onClick={() => setShowModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
        >
          予約する
        </button>

        {showModal && (
          <ReservationModal
            event={event}
            form={form}
            setForm={setForm}
            quantities={quantities}
            setQuantities={setQuantities}
            onClose={() => setShowModal(false)} 
          />
        )}
      </div>
    </div>
  )
}
