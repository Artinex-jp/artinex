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

  const { customer, orderItems, order } = req.body;

  // 2. Stripe用のline_itemsの作成
  const line_items = orderItems.map((oi: any) => ({
    price_data: {
      currency: "jpy",
      product_data: {
        name: `【${oi.item.type}】` + oi.item.performanceItems[0].performance.event.title,
      },
      unit_amount: oi.item.price,
    },
    quantity: oi.quantity,
  }));

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      success_url: `${process.env.BASE_URL}/payment/success`,
      cancel_url: `${process.env.BASE_URL}/payment/cancel`,
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
