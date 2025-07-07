import type { NextApiRequest, NextApiResponse } from 'next';
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, subject, message } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    // Artinex 管理者への通知
    await sgMail.send({
      to: process.env.SENDGRID_FROM!,
      from: process.env.SENDGRID_FROM!,
      subject: `【お問い合わせ】${subject}`,
      html: `
        <p><strong>お名前：</strong> ${name}</p>
        <p><strong>メールアドレス：</strong> ${email}</p>
        <p><strong>件名：</strong> ${subject}</p>
        <p><strong>メッセージ：</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
      `,
    });

    // 送信者への確認メール
    await sgMail.send({
      to: email,
      from: process.env.SENDGRID_FROM!,
      subject: '【Artinex】お問い合わせありがとうございます',
      html: `
        <p>${name} 様</p>
        <p>この度はArtinexにお問い合わせいただき、誠にありがとうございます。</p>
        <p>以下の内容で受け付けました：</p>
        <hr/>
        <p><strong>件名：</strong> ${subject}</p>
        <p><strong>メッセージ：</strong><br/>${message.replace(/\n/g, '<br/>')}</p>
        <hr/>
        <p>担当者より折り返しご連絡差し上げますので、今しばらくお待ちください。</p>
        <p>Artinex</p>
      `,
    });

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
