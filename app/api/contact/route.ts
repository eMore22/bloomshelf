import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json()

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await resend.emails.send({
      from:    'BloomShelf <support@bloomshelf.store>',
      to:      'ruthozomoge@gmail.com',
      replyTo: email,
      subject: `[BloomShelf] ${subject || 'New Message'} from ${name}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
          <h2 style="color:#3B2A2A;">New Contact Message</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Subject:</strong> ${subject || 'N/A'}</p>
          <hr style="border:none;border-top:1px solid #EDE8DF;margin:16px 0;" />
          <p style="color:#3B2A2A;line-height:1.6;">${message.replace(/\n/g, '<br/>')}</p>
        </div>
      `,
    })

    return NextResponse.json({ ok: true })
  } catch (err: any) {
    console.error('[Contact]', err)
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}