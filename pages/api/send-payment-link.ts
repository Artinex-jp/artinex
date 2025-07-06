// import type { NextApiRequest, NextApiResponse } from 'next';
// import sgMail from '@sendgrid/mail';
// import { formatDate } from '@/utils/formatDate';

// sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

// interface EventData {
//   id: string;
//   title: string;
//   description?: string;
//   performances: {
//     id: string;
//     title: string;
//     openTime: string;
//     startTime: string;
//     eventPlace: { id: string; name: string };
//     performanceItems: {
//       item: { id: string; type: string; price: number };
//     }[];
//   }[];
// }

// type OrderItem = { itemId: string; quantity: number };

// type ReservationForm = {
//   customer: {
//     lastName: string;
//     firstName: string;
//     email: string;
//   };
//   paymentMethod: string;
//   amountTotal: number;
//   orderItem: OrderItem[];
// };

// type Url = string;

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== 'POST') {
//     return res.status(405).end('Method Not Allowed');
//   }

//   const { event, form, stripeUrl }: { event: EventData; form: ReservationForm; stripeUrl: Url } = req.body;

//   try {
//     // OrderItemをイベント内から引き当てて整形
//     const itemLines: string[] = [];

//     for (const order of form.orderItem) {
//       for (const performance of event.performances) {
//         const matchedItem = performance.performanceItems.find(
//           (pi) => pi.item.id === order.itemId
//         );

//         if (matchedItem) {
//           const item = matchedItem.item;
//           const subtotal = item.price * order.quantity;
//           itemLines.push([
//             `◆${event.title}◆`,
//             `会　場　：${performance.eventPlace.name}`
//           ].join("\n"));
//           performance.openTime && itemLines.push(
//             `開場時間：${formatDate(performance.openTime, "h時mm分")}`
//           )
//           itemLines.push([
//             `開始時間：${formatDate(performance.startTime, "h時mm分")}`,
//             '--------------------------------',
//             `${item.type}`,
//             `${item.price}円 × ${order.quantity}枚 ＝ ${subtotal}円`,
//             '==========',
//             ''
//           ].join('\n'));
//         }
//       }
//     }

//     const formattedItems = itemLines.join('\n');

//     await sgMail.send({
//       to: form.customer.email,
//       from: {
//         email: 'official@artinex.jp',
//         name: 'Artinex',
//       },
//       replyTo: 'info@artinex.jp',
//       templateId: process.env.SENDGRID_PAYMENT_TEMPLATE_ID!,
//       dynamicTemplateData: {
//         lastName: form.customer.lastName,
//         firstName: form.customer.firstName,
//         stripeUrl,
//         items: formattedItems,
//         totalAmount: form.amountTotal,
//       },
//     });

//     res.status(200).json({ message: 'メール送信成功' });
//   } catch (err: any) {
//     console.error(err.response?.body || err);
//     res.status(500).json({ message: 'メール送信に失敗しました' });
//   }
// }
import type { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';
import { formatDate } from '@/utils/formatDate';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

interface EventData {
  id: string;
  title: string;
  description?: string;
  performances: {
    id: string;
    title: string;
    openTime: string;
    startTime: string;
    eventPlace: { id: string; name: string };
    performanceItems: {
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
    // アイテム整形
    const itemLines: string[] = [];

    for (const order of form.orderItem) {
      for (const performance of event.performances) {
        const matchedItem = performance.performanceItems.find(
          (pi) => pi.item.id === order.itemId
        );

        if (matchedItem) {
          const item = matchedItem.item;
          const subtotal = item.price * order.quantity;
          itemLines.push([
            `◆${event.title}◆`,
            `会　場　：${performance.eventPlace.name}`
          ].join("\n"));
          if (performance.openTime) {
            itemLines.push(`開場時間：${formatDate(performance.openTime, "h時mm分")}`);
          }
          itemLines.push([
            `開始時間：${formatDate(performance.startTime, "h時mm分")}`,
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

    let templateId = '';
    const method = form.paymentMethod;

    if (method === 'オンライン決済') {
      templateId = process.env.SENDGRID_PAYMENT_TEMPLATE_ID!;
    } else if (method === '銀行振り込み') {
      templateId = process.env.SENDGRID_BANK_TEMPLATE_ID!;
    } else if (method === '当日現金支払い') {
      templateId = process.env.SENDGRID_CASH_TEMPLATE_ID!;
    } else {
      throw new Error(`Unsupported payment method: ${method}`);
    }

    await sgMail.send({
      to: form.customer.email,
      from: {
        email: 'official@artinex.jp',
        name: 'Artinex',
      },
      replyTo: 'info@artinex.jp',
      templateId,
      dynamicTemplateData: {
        lastName: form.customer.lastName,
        firstName: form.customer.firstName,
        stripeUrl: method === 'オンライン決済' ? stripeUrl : undefined,
        items: formattedItems,
        totalAmount: form.amountTotal,
        paymentMethod: method,
      },
    });

    res.status(200).json({ message: 'メール送信成功' });
  } catch (err: any) {
    console.error(err.response?.body || err);
    res.status(500).json({ message: 'メール送信に失敗しました' });
  }
}
