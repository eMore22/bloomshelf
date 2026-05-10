// app/shop/page.tsx
export const dynamic = 'force-dynamic'
import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'
import ProductCard from '@/components/ProductCard'
import { searchProducts, CJProduct } from '@/lib/cj'
import Link from 'next/link'

const MARKUP         = 2.5
const COMPARE_MARKUP = 3.2

function toSlug(name: string, pid: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + pid
}

const CATEGORIES = [
  { key: 'all',    label: 'All',             keywords: ['makeup brush', 'storage box'] },
  { key: 'beauty', label: 'Beauty Tools',    keywords: ['makeup brush', 'facial roller'] },
  { key: 'home',   label: 'Home & Organise', keywords: ['storage box', 'drawer organizer'] },
]

// Sequential fetching to avoid CJ rate limit (1 req/sec)
async function getProducts(cat: string, page: number) {
  const category = CATEGORIES.find(c => c.key === cat) || CATEGORIES[0]
  const allProducts: CJProduct[] = []
  let total = 0

  for (const kw of category.keywords) {
    try {
      const result = await searchProducts(kw, page, 10)
      if (result?.list) {
        allProducts.push(...result.list)
        total += result.total
      }
      // Small delay between requests to respect rate limit
      await new Promise(r => setTimeout(r, 1100))
    } catch (e) {
      console.error('Failed to fetch keyword:', kw, e)
    }
  }

  // Remove duplicates by pid
  const seen = new Set<string>()
  const unique = allProducts.filter(p => {
    if (seen.has(p.pid)) return false
    seen.add(p.pid)
    return true
  })

  return { list: unique, total }
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { cat?: string; page?: string }
}) {
  const cat  = searchParams.cat  || 'all'
  const page = Number(searchParams.page || 1)

  const { list: products, total } = await getProducts(cat, page)

  return (
    <>
      <Navbar />
      <CartDrawer />

      <main className="pt-24 pb-20 min-h-screen bg-bloom-cream">
        <div className="max-w-7xl mx-auto px-6">

          {/* Header */}
          <div className="mb-10">
            <p className="text-[10px] tracking-[0.35em] uppercase text-bloom-rose mb-2">Browse</p>
            <h1 className="font-display text-5xl font-light text-bloom-bark">Shop</h1>
          </div>

          {/* Category filters */}
          <div className="flex items-center gap-2 mb-10 flex-wrap">
            {CATEGORIES.map(c => (
              <Link
                key={c.key}
                href={`/shop?cat=${c.key}`}
                className={`px-5 py-2 text-xs tracking-widest uppercase transition-colors duration-200 rounded-sm border ${
                  cat === c.key
                    ? 'bg-bloom-bark text-bloom-cream border-bloom-bark'
                    : 'bg-transparent text-bloom-bark border-bloom-sand hover:border-bloom-bark'
                }`}
              >
                {c.label}
              </Link>
            ))}
          </div>

          {/* Product count */}
          <p className="text-xs text-bloom-bark/40 tracking-wide mb-8">
            {products.length} products
          </p>

          {/* Product grid */}
          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {products.map((p: CJProduct, i: number) => (
                <div
                  key={p.pid}
                  className="animate-fade-up opacity-0"
                  style={{ animationDelay: `${(i % 8) * 80}ms`, animationFillMode: 'forwards' }}
                >
                  <ProductCard
                    pid={p.pid}
                    slug={toSlug(p.productNameEn, p.pid)}
                    name={p.productNameEn}
                    image={p.productImage}
                    price={Number(p.sellPrice) * MARKUP}
                    comparePrice={Number(p.sellPrice) * COMPARE_MARKUP}
                    category={p.categoryName}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-32 text-bloom-bark/30 gap-4">
              <p className="font-display text-3xl font-light">No products found</p>
              <p className="text-sm tracking-wide">Try a different category</p>
            </div>
          )}

          {/* Pagination */}
          {total > 20 && (
            <div className="flex items-center justify-center gap-3 mt-16">
              {page > 1 && (
                <Link
                  href={`/shop?cat=${cat}&page=${page - 1}`}
                  className="px-6 py-2 text-xs tracking-widest uppercase border border-bloom-sand text-bloom-bark hover:border-bloom-bark transition-colors"
                >
                  ← Prev
                </Link>
              )}
              <span className="text-xs text-bloom-bark/40 tracking-wide">Page {page}</span>
              <Link
                href={`/shop?cat=${cat}&page=${page + 1}`}
                className="px-6 py-2 text-xs tracking-widest uppercase border border-bloom-sand text-bloom-bark hover:border-bloom-bark transition-colors"
              >
                Next →
              </Link>
            </div>
          )}

        </div>
      </main>
    </>
  )
}