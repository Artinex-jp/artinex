import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end();

  const { customer, paymentMethod, amountTotal, orderItem } = req.body;
  const { data: customerData, error: insertCustomerError } = await supabase.from("customers").upsert(
    [
      { name: customer.name, email: customer.email, tel: customer.tel, created_at: new Date() },
    ],
    {
      onConflict: "email",
    }
  ).select().single();

  if (insertCustomerError) return res.status(500).json({ error: insertCustomerError.message });

  // 注文作成
  const orderId = uuidv4();
  const { data: orderData, error: insertOrderError } = await supabase.from("orders").insert([
    { id: orderId, customer_id: customerData.id, payment_method: paymentMethod, amount_total: amountTotal, created_at: new Date() },
  ]).select().single();
  if (insertOrderError) return res.status(500).json({ error: insertOrderError.message });

  // 注文アイテム作成
  const itemsToInsert = orderItem.map((item: any) => ({
    id: uuidv4(),
    order_id: orderId,
    item_id: item.itemId,
    quantity: item.quantity,
  }));

  const { data: orderItemData, error: insertItemsError } = await supabase.from("order_items").insert(itemsToInsert).select(`
    *,
    item: items (
      *,
      performanceItems: performance_items (
        *,
        performance: performances (
          *,
          event: events (
            *
          ),
          eventPlace: event_places (
            *
          )
        )
      )
    )
  `);
  if (insertItemsError) return res.status(500).json({ error: insertItemsError.message });

  // Stripe Checkout Session を作成（必要であればここに記述）
  return res.status(200).json({ success: true, order: orderData, customer: customerData,  orderItems: orderItemData});
}
