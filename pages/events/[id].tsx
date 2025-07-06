import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import ReservationModal from "../../components/features/ReservationModal";
import { formatDate } from '@/utils/formatDate';
import { formatFullName } from '@/utils/formatFullName';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { supabase } from '@/lib/supabaseClient'

interface EventData {
  id: string
  title: string
  subtitle:string
  description?: string
  images?: {
    id: string
    imagePath: string
    altText?: string
  }[]
  performances: {
    id: string
    title: string
    date: string
    startTime?: string
    openTime: string
    eventPlace: {
      id: string
      name: string
      prefecture: string
      city: string
      address1?: string
      address2?: string
      googleMapEmbedUrl?: string 
    }
    performanceItems: {
      item: {
        id: string
        type: string
        title: string
        price: number
        note: string
      }
    }[]
    performancePieces: {
      id: string
      notes?: string
      piece: {
        id: string
        title: string
        subtitle: string
        arrangementSource?: {
          id: string
          title: string
          subtitle: string
          composer?: {
            id: string
            nationality: string
            middleName?: string
            lastName: string
            firstName: string
          }
        }
        suiteChildren?: {
          id: string
          title: string
          subtitle: string
          orderInGroup: number
        }[]
        composer?: {
          id: string
          nationality: string
          middleName?: string
          lastName: string
          firstName: string
        }
      }
      performancePieceArtists: {
        id: string
        role: string
        artist: {
          id: string
          nationality: string
          middleName?: string
          lastName: string
          firstName: string
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
  const defaultCustomer = {
    lastName: "",
    firstName: "",
    email: "",
    tel: "",
  }
  const [form, setForm] = useState<ReservationForm>({
    customer: defaultCustomer,
    paymentMethod: "銀行振り込み",
    amountTotal: 0,
    orderItem: [],
  })

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem("customer")
      if (saved) {
        const parsed = JSON.parse(saved)
        setForm((prev) => ({
          ...prev,
          customer: parsed,
        }))
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("customer", JSON.stringify(form.customer))
  }, [form.customer])

  if (loading) return <p>読み込み中...</p>
  if (!event) return <p>イベントが見つかりませんでした</p>

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 8000,
    appendDots: (dots: any) => (
      <div style={{ position: 'absolute', bottom: '10px', width: '100%' }}>
        <ul style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>{dots}</ul>
      </div>
    ),
    customPaging: () => (
      <div style={{ width: '12px', height: '12px', borderRadius: '9999px', background: '#888' }}></div>
    )
  };

  return (
    <div>
      <div className="bg-gray-100 w-full">
        <div className="flex-col mx-auto max-w-screen-md w-full mb-4 gap-6 p-6">
          <div>
            {event.images && event.images.length > 0 && (
              <div className="relative w-full aspect-[16/9] bg-black overflow-hidden">
                <Slider {...sliderSettings} className="absolute inset-0 w-full h-full">
                  {event.images.map((img) => {
                    const publicUrl = supabase.storage.from('flyers').getPublicUrl(img.imagePath).data.publicUrl;
                    return (
                      <div key={img.id} className="w-full h-full flex items-center justify-center">
                        <img
                          src={publicUrl}
                          alt={img.altText || ''}
                          className="w-full h-full aspect-[16/9] object-contain m-auto"
                        />
                      </div>
                    );
                  })}
                </Slider>
              </div>
            )}
          <style jsx global>{`
            .slick-prev, .slick-next {
              position: absolute;
              z-index: 10;
              top: 50%;
              transform: translateY(-50%);
              width: 16px;
              height: 16px;
              background-color: rgba(255, 255, 255, 0);
              border-radius: 9999px;
              display: flex !important;
              align-items: center;
              justify-content: center;
              cursor: pointer;
            }

            .slick-prev {
              left: 16px;
            }

            .slick-next {
              right: 16px;
            }

            .slick-prev:before,
            .slick-next:before {
              font-size: 20px;
              color: black;
              opacity: 0.9;
            }
          `}</style>
          </div>
          <div>
            <h1 className="text-xl font-bold max-w-3xl mx-auto pt-2 whitespace-pre-wrap ">{event.title}</h1>
            <h1 className="text-sm max-w-3xl mx-auto pt-2 mb-4">{event.subtitle}</h1>
            {event.performances.map((perf) => (
              <div key={perf.id}>
                <div className="text-right text-sm">
                  <div>{formatDate(perf.date, "YYYY年M月D日(E)")}</div>
                  <div>{perf.openTime && formatDate(perf.openTime, "開場 hh:mm　")}{perf.startTime && formatDate(perf.startTime, "開演 hh:mm")}</div>
                </div>
                <div className="flex justify-end text-xs mt-1">
                  <div className="inline-flex items-center">
                    <img src="/map-pin.svg" alt="Map Pin" className="w-3 h-3 mr-1" />
                    {perf.eventPlace.name}
                  </div>
                </div>
                <div className="text-right text-xs text-gray-500">{perf.eventPlace.prefecture}{perf.eventPlace.city}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="p-6 mx-auto max-w-screen-md w-full m-4">
        <p className="mb-6 whitespace-pre-wrap">{event.description}</p>
      </div>

      {event.performances.map((perf) => (
        <div key={perf.id} className="bg-white shadow-md rounded-xl p-6 m-4 mb-8 border border-gray-200 mx-auto max-w-screen-md w-full m-4">
          <h2 className="text-2xl font-bold mb-1">{perf.title}</h2>

          {/* チケット情報 */}
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1">チケット</h3>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {perf.performanceItems?.map(({ item }) => (
                <li key={item.id} className="bg-gray-100 px-4 py-2 rounded-md">
                  <div className="flex justify-between">
                    <span>{item.type}</span>
                    <span className="font-semibold">{item.price.toLocaleString()}円</span>
                  </div>
                  {item.note && (<div className="text-sm text-gray-500">
                    {item.note}
                  </div>)}
                </li>
              ))}
            </ul>
            <button
              onClick={() => setShowModal(true)}
              className="bg-blue-600 text-white px-4 py-2 w-full rounded mt-4"
            >
              予約・購入
            </button>
          </div>

          {/* プログラム */}
          <div>
            <h3 className="text-lg font-semibold mb-3">プログラム</h3>
            {perf.performancePieces?.map((pp) => (
              <div key={pp.id} className="bg-gray-50 border-l-4 border-blue-400 pl-4 pr-2 py-2 mb-4 rounded">
                <div className="grid grid-cols-[1fr_auto] gap-4">
                  <div className="text-base font-semibold min-w-[60]">
                    {pp.piece.title}
                    <span className="font-normal ml-2 text-sm">{pp.piece.subtitle}</span>
                  </div>
                  <div className="min-w-24 text-sm text-gray-600 pt-[4px]">
                    {pp.piece.arrangementSource?.composer ? (
                      <>
                        <div>
                          作曲：{formatFullName(pp.piece.arrangementSource.composer)}
                        </div>
                        {pp.piece.composer && (
                          <div>
                            編曲：{pp.piece.composer.lastName}
                          </div>
                        )}
                      </>
                    ) : (
                      pp.piece.composer && (
                        <div>
                          {formatFullName(pp.piece.composer)}
                        </div>
                      )
                    )}
                  </div>
                </div>
                {pp.notes && (
                  <div className="text-sm text-gray-500 mt-1 ml-1">{pp.notes}</div>
                )}
                <ul className="mt-2 space-y-1 text-sm text-gray-700 ml-2">
                  {pp.performancePieceArtists?.map((ppa) => (
                    <li key={ppa.id} className="flex items-center gap-2">
                      <span className="text-blue-500"></span>
                      <span>{formatFullName(ppa.artist)}</span>
                      <span className="text-gray-500">（{ppa.role}）</span>
                    </li>
                  ))}
                </ul>
                <ol className="mt-2 space-y-1 text-sm text-gray-700 ml-2">
                  {
                    pp.piece.suiteChildren?.map((sc) => (
                      <li key={sc.id}>
                        {sc.orderInGroup ? <span>{sc.orderInGroup}. </span> : "- "}
                        <span>{sc.title}</span>
                        <br/>
                        <span>{sc.subtitle}</span>
                      </li>
                    ))
                  }
                </ol>
              </div>
            ))}
          </div>
            <p className="text-md text-gray-700 mb-2">{perf.eventPlace.name}</p>
            <p className="text-xs text-gray-500 mb-2">{perf.eventPlace.prefecture}{perf.eventPlace.city}{perf.eventPlace.address1}{perf.eventPlace.address2}</p>
            {perf.eventPlace.googleMapEmbedUrl && 
              <div className="w-full aspect-video max-w-3xl mx-auto border rounded overflow-hidden">
                <iframe
                  src={perf.eventPlace.googleMapEmbedUrl}
                  width="100%"
                  height="100%"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            }
        </div>
      ))}

      <div>
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
