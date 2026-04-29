const CJ_BASE = 'https://developers.cjdropshipping.com/api2.0'

let _accessToken = ''
let _tokenExpiry = 0

export async function getCJToken(): Promise<string> {
  if (_accessToken && Date.now() < _tokenExpiry) return _accessToken
  const res = await fetch(`${CJ_BASE}/v/1.0/authentication/getAccessToken`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: process.env.CJ_EMAIL, password: process.env.CJ_PASSWORD }),
    cache: 'no-store',
  })
  const data = await res.json()
  if (!data.data?.accessToken) throw new Error('CJ auth failed: ' + JSON.stringify(data))
  _accessToken = data.data.accessToken
  _tokenExpiry = Date.now() + 23 * 60 * 60 * 1000
  return _accessToken
}

async function cjHeaders() {
  const token = await getCJToken()
  return { 'CJ-Access-Token': token, 'Content-Type': 'application/json' }
}

export interface CJProduct {
  pid: string
  productNameEn: string
  productImage: string
  sellPrice: number
  categoryName: string
  variants?: CJVariant[]
}

export interface CJVariant {
  vid: string
  variantNameEn: string
  variantSellPrice: number
  variantImage: string
  variantStock: number
}

export async function searchProducts(keyword: string, page = 1, pageSize = 20) {
  const headers = await cjHeaders()
  const params = new URLSearchParams({ pageNum: String(page), pageSize: String(pageSize), categoryKeyword: keyword })
  const res = await fetch(`${CJ_BASE}/v/1.0/product/list?${params}`, { headers, next: { revalidate: 3600 } })
  const data = await res.json()
  return data.data as { list: CJProduct[]; total: number }
}

export async function getProduct(pid: string): Promise<CJProduct> {
  const headers = await cjHeaders()
  const res = await fetch(`${CJ_BASE}/v/1.0/product/query?pid=${pid}`, { headers, next: { revalidate: 3600 } })
  const data = await res.json()
  return data.data as CJProduct
}

export async function getShippingCost(pid: string, countryCode: string, quantity = 1) {
  const headers = await cjHeaders()
  const res = await fetch(`${CJ_BASE}/v/1.0/logistic/freightCalculate`, {
    method: 'POST', headers,
    body: JSON.stringify({ startCountryCode: 'CN', endCountryCode: countryCode, quantity, pid }),
  })
  const data = await res.json()
  return data.data as { logisticName: string; logisticPrice: number; time: string }[]
}

export interface CJOrderItem { vid: string; quantity: number }
export interface CJShippingAddress {
  name: string; phone: string; email: string; countryCode: string
  province: string; city: string; address: string; zip: string
}

export async function placeCJOrder(internalOrderId: string, items: CJOrderItem[], address: CJShippingAddress, logisticName = 'CJPacket') {
  const headers = await cjHeaders()
  const res = await fetch(`${CJ_BASE}/v/1.0/shopping/order/createOrderV2`, {
    method: 'POST', headers,
    body: JSON.stringify({
      orderNumber: internalOrderId, shippingZip: address.zip, shippingPhone: address.phone,
      shippingName: address.name, shippingCountry: address.countryCode, shippingProvince: address.province,
      shippingCity: address.city, shippingAddress: address.address, logisticName, products: items,
    }),
  })
  const data = await res.json()
  if (!data.result) throw new Error('CJ order failed: ' + JSON.stringify(data))
  return data.data as { orderId: string; orderNum: string }
}

export async function getOrderTracking(cjOrderId: string) {
  const headers = await cjHeaders()
  const res = await fetch(`${CJ_BASE}/v/1.0/shopping/order/getOrderDetail?orderNum=${cjOrderId}`, { headers })
  const data = await res.json()
  return data.data
}
