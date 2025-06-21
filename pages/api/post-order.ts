import type { NextApiRequest, NextApiResponse } from 'next'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from "uuid";
import { supabase } from '@/lib/supabaseClient'


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const data = req.body

  const {data: customers, error: cutomerError} = await supabase
    .from("customers")
    .select("*")
    .eq("email", data.email)
    .limit(1)

  let customer = customers?.[0]
  if(!customer) {
    const newCustomer = {
      id: uuidv4(),
      created_at: new Date().toISOString(),
      name: data.name,
      email: data.email,
    }
    console.log(newCustomer)
    const {data: inserted, error } = await supabase
      .from("customers")
      .insert([newCustomer])
      .select()
    console.log(error)
    customer = inserted?.[0]
  }

  console.log(customer)

  const order = {
    id: uuidv4(),
    customerId: customer.id,
    createdAt: new Date().toISOString,
    ...data,
  }
  await supabase.from("orders").insert([order])

  const { data: item, error } = await supabase
  .from("items")
  .select(`
    *,
    performance:performanceId (
      *,
      event:eventId (
        *
      )
    )
  `)
  .eq("id", data.itemId)
  .single();


  const quantity = parseInt(data.quantity)
  const orderItem = quantity > 0 ? {
      id: uuidv4(),
      orderId: order.id,
      itemId: item.id,
      quantity,
    } : null

  return res.status(200).json({ message: '成功' });
}