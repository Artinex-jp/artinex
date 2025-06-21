import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { customer, orderItem, order } = req.body;
  console.log(req.body.orderItem[0].item)

  // 2. Stripe用のline_itemsの作成
  const line_items = orderItem.map((oi: any) => ({
    price_data: {
      currency: "jpy",
      product_data: {
        name: `【${oi.item.title}】` + oi.item.performanceItem[0].performance.event.title,
      },
      unit_amount: oi.item.price,
    },
    quantity: oi.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `https://www.artinex.jp/`,
      cancel_url: `https://www.artinex.jp/`,
      line_items,
      customer_email: customer.email,
      metadata: {
        order_id: order.id,
        customer_id: customer.id,
      },
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Stripe session creation error:", err);
    res.status(500).json({ error: "Stripe session creation failed" });
  }
}
