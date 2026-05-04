// app/api/cj/product/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getCJToken } from '@/lib/cj'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const pid = searchParams.get('pid')

  if (!pid) {
    return NextResponse.json({ ok: false, error: 'Missing pid' }, { status: 400 })
  }

  try {
    const token = await getCJToken()

    // Try direct product query first
    const res = await fetch(
      `https://developers.cjdropshipping.com/api2.0/v1/product/query?pid=${pid}`,
      {
        headers: {
          'CJ-Access-Token': token,
          'Content-Type': 'application/json',
        },
      }
    )

    const data = await res.json()
    console.log('[CJ product]', pid, JSON.stringify(data).slice(0, 200))

    if (data.data) {
      return NextResponse.json({ ok: true, product: data.data })
    }

    // Fallback: search by pid as keyword
    const searchRes = await fetch(
      `https://developers.cjdropshipping.com/api2.0/v1/product/list?pageNum=1&pageSize=1&productSku=${pid}`,
      {
        headers: {
          'CJ-Access-Token': token,
          'Content-Type': 'application/json',
        },
      }
    )

    const searchData = await searchRes.json()

    if (searchData.data?.list?.length > 0) {
      return NextResponse.json({ ok: true, product: searchData.data.list[0] })
    }

    return NextResponse.json({ ok: false, error: 'Product not found' }, { status: 404 })

  } catch (err: any) {
    console.error('[CJ product error]', err)
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 })
  }
}