// app/api/cj/product/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getProduct } from '@/lib/cj'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const pid = searchParams.get('pid')

  if (!pid) {
    return NextResponse.json({ ok: false, error: 'Missing pid' }, { status: 400 })
  }

  try {
    const product = await getProduct(pid)
    return NextResponse.json({ ok: true, product })
  } catch (err: any) {
    console.error('[CJ single product]', err)
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}