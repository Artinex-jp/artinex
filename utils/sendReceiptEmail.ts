import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export async function sendReceiptEmail(email: string, session: any) {
  const msg = {
    to: email,
    from: 'noreply@yourdomain.com',
    subject: 'ご予約の決済が完了しました',
    text: `お客様の決済が完了しました。金額: ¥${session.amount_total / 100}`,
    html: `<p>お客様の決済が完了しました。</p><p>金額: ¥${session.amount_total / 100}</p>`,
  };

  await sgMail.send(msg);
}
