import { buffer } from 'micro';
import Stripe from 'stripe';
import { supabase } from '@/lib/supabaseClient';
import { sendReceiptEmail } from '@/utils/sendReceiptEmail';
import { NextApiRequest, NextApiResponse } from 'next';

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const sig = req.headers['stripe-signature'];
  const buf = await buffer(req);
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      buf,
      sig!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error('Webhook Error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 支払い成功イベント
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const orderId = session.metadata?.order_id; // あらかじめ渡しておく
    const customerEmail = session.customer_details?.email;

    const { error } = await supabase.from('payments').insert([
      {
        order_id: orderId,
        amount_total: session.amount_total!,
        payment_status: session.payment_status,
      }
    ]);

    if (error) {
      console.error('Supabase insert error:', error);
    } else if(customerEmail) {
      await sendReceiptEmail(customerEmail, session);
    }
  }

  res.status(200).json({ received: true });
}
