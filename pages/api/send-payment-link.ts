import type { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

interface EventData {
  id: string;
  title: string;
  description?: string;
  performances: {
    id: string;
    title: string;
    open_time: string;
    start_time: string;
    eventPlace: { id: string; name: string };
    performanceItem: {
      item: { id: string; type: string; price: number };
    }[];
  }[];
}

type OrderItem = { itemId: string; quantity: number };

type ReservationForm = {
  customer: {
    lastName: string;
    firstName: string;
    email: string;
  };
  paymentMethod: string;
  amountTotal: number;
  orderItem: OrderItem[];
};

type Url = string;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end('Method Not Allowed');
  }

  const { event, form, stripeUrl }: { event: EventData; form: ReservationForm; stripeUrl: Url } = req.body;

  try {
    // OrderItemをイベント内から引き当てて整形
    const itemLines: string[] = [];

    for (const order of form.orderItem) {
      for (const performance of event.performances) {
        const matchedItem = performance.performanceItem.find(
          (pi) => pi.item.id === order.itemId
        );

        if (matchedItem) {
          const item = matchedItem.item;
          const subtotal = item.price * order.quantity;
          itemLines.push([
            `◆${event.title}◆`,
            `会　場　：${performance.eventPlace.name}`,
            `開場時間：${performance.open_time}`,
            `開始時間：${performance.start_time}`,
            '--------------------------------',
            `${item.type}`,
            `${item.price}円 × ${order.quantity}枚 ＝ ${subtotal}円`,
            '==========',
            ''
          ].join('\n'));
        }
      }
    }

    const formattedItems = itemLines.join('\n');

    await sgMail.send({
      to: form.customer.email,
      from: {
        email: 'official@artinex.jp',
        name: 'Artinex',
      },
      replyTo: 'info@artinex.jp',
      templateId: process.env.SENDGRID_PAYMENT_TEMPLATE_ID!,
      dynamicTemplateData: {
        lastName: form.customer.lastName,
        firstName: form.customer.firstName,
        stripeUrl,
        items: formattedItems,
        totalAmount: form.amountTotal,
      },
    });

    res.status(200).json({ message: 'メール送信成功' });
  } catch (err: any) {
    console.error(err.response?.body || err);
    res.status(500).json({ message: 'メール送信に失敗しました' });
  }
}
