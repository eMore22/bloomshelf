// app/api/cj/products/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getCJToken } from '@/lib/cj'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const keyword  = searchParams.get('keyword') || 'beauty'
  const page     = Number(searchParams.get('page') || 1)
  const pageSize = Number(searchParams.get('pageSize') || 20)

  try {
    const token = await getCJToken()

    const params = new URLSearchParams({
      pageNum:       String(page),
      pageSize:      String(pageSize),
      productNameEn: keyword,
    })

    const res = await fetch(
      `https://developers.cjdropshipping.com/api2.0/v1/product/list?${params}`,
      {
        headers: {
          'CJ-Access-Token': token,
          'Content-Type':    'application/json',
        },
      }
    )

    const data = await res.json()
    console.log('[CJ products raw]', JSON.stringify(data).slice(0, 300))

    return NextResponse.json({ ok: true, data: data.data || { list: [], total: 0 } })
  } catch (err: any) {
    console.error('[CJ products error]', err)
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}