import { NextRequest, NextResponse } from 'next/server'
import { searchProducts } from '@/lib/cj'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const keyword  = searchParams.get('keyword') || 'beauty tools'
  const page     = Number(searchParams.get('page') || 1)
  const pageSize = Number(searchParams.get('pageSize') || 20)
  try {
    const data = await searchProducts(keyword, page, pageSize)
    return NextResponse.json({ ok: true, data })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}
