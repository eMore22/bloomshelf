import { NextRequest, NextResponse } from 'next/server'

const FLW_BASE   = 'https://api.flutterwave.com/v3'
const FLW_SECRET = process.env.FLW_SECRET_KEY!

export async function POST(req: NextRequest) {
  try {
    const { items, customerEmail, customerName, customerPhone } = await req.json()
    if (!items?.length) return NextResponse.json({ error: 'No items in cart' }, { status: 400 })

    const subtotal   = items.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0)
    const total      = parseFloat((subtotal + 4.99).toFixed(2))
    const txRef      = `BS-${Date.now()}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`

    const res = await fetch(`${FLW_BASE}/payments`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${FLW_SECRET}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tx_ref: txRef, amount: total, currency: 'USD',
        redirect_url: `${process.env.NEXT_PUBLIC_BASE_URL}/orders/confirm`,
        customer: { email: customerEmail, name: customerName, phonenumber: customerPhone || '' },
        customizations: { title: 'BloomShelf', description: 'Beauty Tools & Home Organisation', logo: `${process.env.NEXT_PUBLIC_BASE_URL}/logo.png` },
        meta: { items: JSON.stringify(items.map((i: any) => ({ vid: i.id, pid: i.pid, qty: i.quantity, name: i.name }))), source: 'bloomshelf-web' },
      }),
    })
    const data = await res.json()
    if (data.status !== 'success') return NextResponse.json({ error: data.message || 'Payment init failed' }, { status: 500 })
    return NextResponse.json({ url: data.data.link, txRef })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
