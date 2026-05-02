import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendOrderConfirmation({
  to, name, orderRef, items, total, currency = 'USD',
}: {
  to: string
  name: string
  orderRef: string
  items: { name: string; qty: number; price: number }[]
  total: number
  currency?: string
}) {
  const itemRows = items.map(i =>
    `<tr>
      <td style="padding:8px 0;color:#3B2A2A;">${i.name}</td>
      <td style="padding:8px 0;color:#3B2A2A;text-align:center;">×${i.qty}</td>
      <td style="padding:8px 0;color:#3B2A2A;text-align:right;">$${(i.price * i.qty).toFixed(2)}</td>
    </tr>`
  ).join('')

  await resend.emails.send({
    from:    'BloomShelf <support@bloomshelf.store>',
    to,
    subject: `🌸 Order Confirmed — ${orderRef}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;background:#FAF7F2;padding:40px;">
        <h1 style="font-family:Georgia,serif;font-weight:300;color:#3B2A2A;font-size:32px;margin-bottom:8px;">
          BloomShelf
        </h1>
        <p style="color:#C9A99A;font-size:11px;letter-spacing:3px;text-transform:uppercase;">Order Confirmed</p>

        <hr style="border:none;border-top:1px solid #EDE8DF;margin:24px 0;" />

        <p style="color:#3B2A2A;">Hi ${name},</p>
        <p style="color:#3B2A2A;line-height:1.6;">
          Thank you for your BloomShelf order! We have received your payment and your order
          is now being prepared for shipment.
        </p>

        <div style="background:#F0EBE3;padding:16px;margin:24px 0;">
          <p style="color:#888;font-size:11px;letter-spacing:2px;text-transform:uppercase;margin:0 0 8px;">
            Order Reference
          </p>
          <p style="color:#3B2A2A;font-size:16px;font-weight:500;margin:0;">${orderRef}</p>
        </div>

        <table style="width:100%;border-collapse:collapse;">
          <thead>
            <tr>
              <th style="text-align:left;color:#888;font-size:11px;letter-spacing:2px;text-transform:uppercase;padding-bottom:8px;border-bottom:1px solid #EDE8DF;">Item</th>
              <th style="text-align:center;color:#888;font-size:11px;letter-spacing:2px;text-transform:uppercase;padding-bottom:8px;border-bottom:1px solid #EDE8DF;">Qty</th>
              <th style="text-align:right;color:#888;font-size:11px;letter-spacing:2px;text-transform:uppercase;padding-bottom:8px;border-bottom:1px solid #EDE8DF;">Price</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
          <tfoot>
            <tr>
              <td colspan="2" style="padding-top:12px;border-top:1px solid #EDE8DF;color:#3B2A2A;font-weight:500;">Total</td>
              <td style="padding-top:12px;border-top:1px solid #EDE8DF;text-align:right;color:#3B2A2A;font-weight:500;">
                $${total.toFixed(2)} ${currency}
              </td>
            </tr>
          </tfoot>
        </table>

        <hr style="border:none;border-top:1px solid #EDE8DF;margin:24px 0;" />

        <p style="color:#3B2A2A;line-height:1.6;">
          <strong>Estimated delivery:</strong> 10–20 business days<br/>
          You will receive a tracking number once your order ships.
        </p>

        <p style="color:#3B2A2A;line-height:1.6;">
          Track your order anytime at
          <a href="https://bloomshelf.store/orders" style="color:#7D4F50;">bloomshelf.store/orders</a>
        </p>

        <hr style="border:none;border-top:1px solid #EDE8DF;margin:24px 0;" />

        <p style="color:#C9A99A;font-size:12px;">
          Questions? Reply to this email or visit
          <a href="https://bloomshelf.store/contact" style="color:#7D4F50;">bloomshelf.store/contact</a>
        </p>
        <p style="color:#C9A99A;font-size:11px;">© 2026 BloomShelf. All rights reserved.</p>
      </div>
    `,
  })
}