// app/shop/page.tsx
import { Suspense } from 'react'
import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'
import ProductCard from '@/components/ProductCard'
import { searchProducts, CJProduct } from '@/lib/cj'
import Link from 'next/link'

function toSlug(name: string, pid: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + pid.slice(-6)
}

const CATEGORIES = [
  { key: 'all',    label: 'All',          keyword: 'beauty home organizer' },
  { key: 'beauty', label: 'Beauty Tools', keyword: 'beauty tools' },
  { key: 'home',   label: 'Home & Organise', keyword: 'home organizer' },
]

async function getProducts(cat: string, page: number) {
  const category = CATEGORIES.find(c => c.key === cat) || CATEGORIES[0]

  if (cat === 'all') {
    // Fetch both in parallel for "all" category
    const [beauty, home] = await Promise.allSettled([
      searchProducts('beauty tools', page, 10),
      searchProducts('home organizer', page, 10),
    ])
    const beautyList = beauty.status === 'fulfilled' ? beauty.value?.list ?? [] : []
    const homeList   = home.status  === 'fulfilled' ? home.value?.list   ?? [] : []
    return {
      list:  [...beautyList, ...homeList],
      total: (beauty.status === 'fulfilled' ? beauty.value?.total ?? 0 : 0) +
             (home.status   === 'fulfilled' ? home.value?.total   ?? 0 : 0),
    }
  }

  return searchProducts(category.keyword, page, 20)
}

export default async function ShopPage({
  searchParams,
}: {
  searchParams: { cat?: string; page?: string }
}) {
  const cat  = searchParams.cat  || 'all'
  const page = Number(searchParams.page || 1)

  const { list: products, total } = await getProducts(cat, page)
  const totalPages = Math.ceil(total / 20)

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
                    price={p.sellPrice}
                    comparePrice={p.sellPrice * 1.38}
                    category={cat === 'all' ? p.categoryName : undefined}
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
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-16">
              {page > 1 && (
                <Link
                  href={`/shop?cat=${cat}&page=${page - 1}`}
                  className="px-6 py-2 text-xs tracking-widest uppercase border border-bloom-sand text-bloom-bark hover:border-bloom-bark transition-colors"
                >
                  ← Prev
                </Link>
              )}
              <span className="text-xs text-bloom-bark/40 tracking-wide">
                Page {page} of {totalPages}
              </span>
              {page < totalPages && (
                <Link
                  href={`/shop?cat=${cat}&page=${page + 1}`}
                  className="px-6 py-2 text-xs tracking-widest uppercase border border-bloom-sand text-bloom-bark hover:border-bloom-bark transition-colors"
                >
                  Next →
                </Link>
              )}
            </div>
          )}

        </div>
      </main>
    </>
  )
}