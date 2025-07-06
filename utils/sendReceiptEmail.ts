import sgMail from "@sendgrid/mail";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendReceiptEmail(email: string, session: any) {
  const orderId = session.metadata.order_id;

  const { data: order, error } = await supabase
    .from("orders")
    .select(`
      id, customer_last_name, customer_first_name, payment_method, amount_total,
      order_items (
        quantity,
        item: items (
          type, price, note,
          performance_items (
            performance: performances (
              date, start_time, event_place: event_places ( name )
            )
          )
        )
      )
    `)
    .eq("id", orderId)
    .single();

  if (error || !order) {
    console.error("注文情報の取得に失敗しました:", error);
    return;
  }

  const html = [
    `<h2>ご予約ありがとうございました</h2>`,
    `<p><strong>お名前:</strong> ${order.customer_last_name} ${order.customer_first_name}</p>`,
    `<p><strong>お支払い方法:</strong> ${order.payment_method}</p>`,
    `<hr />`,
  ];

  for (const oi of order.order_items) {
    const item = oi.item as any;
    const perfItems = (item as any).performance_items;
    const perf = perfItems?.[0]?.performance;
    const dateStr = new Date(perf.date).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });
    const timeStr = perf.start_time?.substring(0, 5);

    html.push(
      `<p><strong>チケット種別:</strong> ${item.type}</p>`,
      `<p><strong>日付・時間:</strong> ${dateStr} ${timeStr} 開演</p>`,
      `<p><strong>会場:</strong> ${perf.event_place.name}</p>`,
      `<p><strong>価格:</strong> ¥${item.price.toLocaleString()}</p>`,
      `<p><strong>数量:</strong> ${oi.quantity} 枚</p>`,
      `<hr />`
    );
  }

  html.push(`<p><strong>合計金額:</strong> ¥${order.amount_total.toLocaleString()}</p>`);
  html.push(`<p>今後ともArtinexをよろしくお願いいたします。</p>`);

  const msg = {
    to: email,
    from: "info@artinex.jp",
    subject: "ご予約の決済が完了しました",
    text: `お客様の決済が完了しました。金額: ¥${order.amount_total}`,
    html: html.join("\n"),
  };

  await sgMail.send(msg);
}
