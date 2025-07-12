import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { formatDate } from '@/utils/formatDate'
import { ChevronDown, ChevronRight } from 'lucide-react'
import Head from 'next/head'

export async function fetchCustomersWithOrders() {
  const { data, error } = await supabase
    .from('customers')
    .select(`
      id,
      first_name,
      last_name,
      email,
      orders (
        id,
        created_at,
        payment_method,
        order_items (
          id,
          quantity,
          items (
            id,
            type,
            performance_items (
              performance: performances (
                id,
                date,
                start_time,
                events (
                  id,
                  title
                )
              )
            )
          )
        ),
        payments (
          *
        )
      )
    `)

  if (error) throw error
  return data
}

type Customer = {
  id: string
  first_name: string
  last_name: string
  email: string
  orders: {
    id: string
    created_at: string
    payment_method: string
    order_items: {
      id: string
      quantity: number
      items: {
        id: string
        type: string
        performance_items: {
          performance: {
            id: string
            date: string
            start_time: string
            events: {
              id: string
              title: string
            }
          }
        }[]
      }
    }[]
    payments: {
      id: string
      amount_total: number
      payment_status: number
      status: string
    }[]
  }[]
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [openCustomerIds, setOpenCustomerIds] = useState<string[]>([])

  useEffect(() => {
    fetchCustomersWithOrders().then(setCustomers).catch(console.error)
  }, [])

  const toggleAccordion = (customerId: string) => {
    setOpenCustomerIds((prev) =>
      prev.includes(customerId)
        ? prev.filter((id) => id !== customerId)
        : [...prev, customerId]
    )
  }

  return (
    <div className="p-6">
      <Head>
        <title>顧客一覧｜Artinex</title>
        <meta name="description" content="顧客一覧"/>
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href="https://artinex.jp/admin/customers" />
        <meta property="og:title" content="顧客一覧｜Artinex" />
        <meta property="og:description" content="顧客一覧"/>
        <meta property="og:url" content="https://artinex.jp/admin/customers" />
        <meta property="og:type" content="website" />
      </Head>
      <h1 className="text-2xl font-bold mb-4">顧客一覧</h1>
      {customers.map((customer) => {
        const isOpen = openCustomerIds.includes(customer.id)
        return (
          <div key={customer.id} className="mb-4 border rounded shadow">
            <button
              className="flex justify-between w-full px-4 py-3 bg-gray-100 hover:bg-gray-200 transition"
              onClick={() => toggleAccordion(customer.id)}
            >
              <div>
                <h2 className="text-lg font-semibold text-left">
                  {customer.last_name} {customer.first_name}
                </h2>
                <p className="text-sm text-gray-600">{customer.email}</p>
              </div>
              {isOpen ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
            </button>

            {isOpen && (
              <div className="p-4 border-t">
                {customer.orders.map((order) => (
                  <div key={order.id} className="mb-4">
                    <p className="text-sm text-gray-600">注文日: {new Date(order.created_at).toLocaleString()}</p>
                    <p>支払い方法:{order.payment_method}</p>
                    {order.order_items.map((item) => (
                      <div key={item.id} className="ml-4 mt-1">
                        <p>種別: {item.items?.type}</p>
                        <p>数量: {item.quantity}</p>
                        {item.items?.performance_items?.map((pi) => (
                          <div key={pi.performance.id} className="ml-4">
                            <p>イベント: {pi.performance.events?.title}</p>
                            <p>日付: {formatDate(pi.performance.date, 'YYYY年M月D日')}</p>
                            <p>開始: {formatDate(pi.performance.start_time, 'h:mm')}</p>
                          </div>
                        ))}
                      </div>
                    ))}
                    {order.payments.map((payment) => (
                      <div key={payment.id} className="ml-4 mt-1 text-sm text-green-600">
                        支払い: ¥{payment.amount_total} / {payment.payment_status}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
