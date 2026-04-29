import Link from 'next/link'
import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'
import ProductCard from '@/components/ProductCard'
import { searchProducts } from '@/lib/cj'

function toSlug(name: string, pid: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + pid.slice(-6)
}

export default async function HomePage() {
  const [beautyData, homeData] = await Promise.allSettled([
    searchProducts('beauty tools', 1, 4),
    searchProducts('home organizer', 1, 4),
  ])

  const beautyProducts = beautyData.status === 'fulfilled' ? beautyData.value?.list ?? [] : []
  const homeProducts   = homeData.status === 'fulfilled'   ? homeData.value?.list   ?? [] : []

  return (
    <>
      <Navbar />
      <CartDrawer />
      <main className="pt-16">

        {/* Hero */}
        <section className="relative min-h-[92vh] flex items-end pb-20 px-6 overflow-hidden bg-bloom-mist">
          <div className="absolute top-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-bloom-rose/20 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-bloom-sand/60 blur-[100px] pointer-events-none" />
          <div className="hidden lg:block absolute right-12 top-1/2 -translate-y-1/2 -rotate-90 origin-center">
            <span className="text-[10px] tracking-[0.4em] uppercase text-bloom-bark/30">Beauty · Home · Life</span>
          </div>
          <div className="max-w-7xl mx-auto w-full">
            <div className="max-w-2xl">
              <p className="text-[11px] tracking-[0.35em] uppercase text-bloom-rose mb-6 animate-fade-up opacity-0" style={{ animationDelay: '100ms', animationFillMode: 'forwards' }}>
                New Collection
              </p>
              <h1 className="font-display text-[clamp(3.5rem,8vw,7rem)] leading-[0.9] font-light text-bloom-bark animate-fade-up opacity-0" style={{ animationDelay: '200ms', animationFillMode: 'forwards' }}>
                Your space,<br /><em className="text-bloom-berry">elevated.</em>
              </h1>
              <p className="font-body text-base text-bloom-bark/60 mt-8 max-w-md leading-relaxed animate-fade-up opacity-0" style={{ animationDelay: '350ms', animationFillMode: 'forwards' }}>
                Curated beauty tools and home organisation for the woman who moves with intention.
              </p>
              <div className="flex items-center gap-6 mt-10 animate-fade-up opacity-0" style={{ animationDelay: '450ms', animationFillMode: 'forwards' }}>
                <Link href="/shop" className="bg-bloom-bark text-bloom-cream text-sm tracking-widest uppercase px-8 py-4 hover:bg-bloom-berry transition-colors duration-300">
                  Shop Now
                </Link>
                <Link href="/shop?cat=beauty" className="text-sm tracking-widest uppercase text-bloom-bark border-b border-bloom-bark pb-0.5 hover:text-bloom-berry hover:border-bloom-berry transition-colors">
                  Beauty Tools
                </Link>
              </div>
            </div>
            <div className="flex gap-12 mt-20 animate-fade-up opacity-0" style={{ animationDelay: '550ms', animationFillMode: 'forwards' }}>
              {[{ num: '500+', label: 'Products' }, { num: '40+', label: 'Countries' }, { num: '4.8★', label: 'Avg Rating' }].map(s => (
                <div key={s.label}>
                  <p className="font-display text-3xl font-light text-bloom-bark">{s.num}</p>
                  <p className="text-[10px] tracking-widest uppercase text-bloom-bark/40 mt-1">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Category tiles */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'Beauty Tools', sub: 'Glow from within', href: '/shop?cat=beauty', bg: 'bg-bloom-rose/30' },
              { title: 'Home & Organise', sub: 'Space that breathes', href: '/shop?cat=home', bg: 'bg-bloom-sand' },
            ].map(cat => (
              <Link key={cat.title} href={cat.href} className={`group relative ${cat.bg} rounded-sm p-12 flex flex-col justify-end min-h-[320px] overflow-hidden`}>
                <div className="absolute inset-0 bg-bloom-bark/0 group-hover:bg-bloom-bark/5 transition-colors duration-500" />
                <p className="text-[10px] tracking-[0.35em] uppercase text-bloom-bark/50 mb-2">{cat.sub}</p>
                <h2 className="font-display text-4xl font-light text-bloom-bark">{cat.title}</h2>
                <span className="mt-4 text-xs tracking-widest uppercase text-bloom-bark border-b border-bloom-bark/30 pb-0.5 w-fit group-hover:border-bloom-berry group-hover:text-bloom-berry transition-colors">Explore →</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Beauty Products */}
        {beautyProducts.length > 0 && (
          <section className="max-w-7xl mx-auto px-6 pb-20">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-[10px] tracking-[0.35em] uppercase text-bloom-rose mb-2">Featured</p>
                <h2 className="font-display text-4xl font-light text-bloom-bark">Beauty Tools</h2>
              </div>
              <Link href="/shop?cat=beauty" className="text-xs tracking-widest uppercase text-bloom-bark/50 hover:text-bloom-berry transition-colors border-b border-bloom-bark/20 pb-0.5">View All</Link>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {beautyProducts.map((p, i) => (
                <div key={p.pid} className="animate-fade-up opacity-0" style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}>
                  <ProductCard pid={p.pid} slug={toSlug(p.productNameEn, p.pid)} name={p.productNameEn} image={p.productImage} price={p.sellPrice} comparePrice={p.sellPrice * 1.4} category="Beauty" />
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Home Products */}
        {homeProducts.length > 0 && (
          <section className="bg-bloom-mist py-20">
            <div className="max-w-7xl mx-auto px-6">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <p className="text-[10px] tracking-[0.35em] uppercase text-bloom-rose mb-2">Discover</p>
                  <h2 className="font-display text-4xl font-light text-bloom-bark">Home & Organise</h2>
                </div>
                <Link href="/shop?cat=home" className="text-xs tracking-widest uppercase text-bloom-bark/50 hover:text-bloom-berry transition-colors border-b border-bloom-bark/20 pb-0.5">View All</Link>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                {homeProducts.map((p, i) => (
                  <div key={p.pid} className="animate-fade-up opacity-0" style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'forwards' }}>
                    <ProductCard pid={p.pid} slug={toSlug(p.productNameEn, p.pid)} name={p.productNameEn} image={p.productImage} price={p.sellPrice} comparePrice={p.sellPrice * 1.35} category="Home" />
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Value props */}
        <section className="max-w-7xl mx-auto px-6 py-20">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: '🌍', title: 'Ships Worldwide', sub: '40+ countries' },
              { icon: '✨', title: 'Curated Quality', sub: 'Every item tested' },
              { icon: '🔒', title: 'Secure Checkout', sub: 'Flutterwave protected' },
              { icon: '💬', title: 'Real Support', sub: 'Always here for you' },
            ].map(v => (
              <div key={v.title} className="text-center">
                <div className="text-3xl mb-3">{v.icon}</div>
                <h3 className="font-display text-lg font-light text-bloom-bark">{v.title}</h3>
                <p className="text-xs text-bloom-bark/50 mt-1 tracking-wide">{v.sub}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-bloom-sand bg-bloom-cream">
          <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <span className="font-display text-2xl font-light text-bloom-bark">BloomShelf</span>
              <p className="font-body text-sm text-bloom-bark/50 mt-3 leading-relaxed max-w-xs">Curated beauty tools and home organisation for the modern woman.</p>
            </div>
            <div>
              <h4 className="text-[10px] tracking-widest uppercase text-bloom-bark/40 mb-4">Shop</h4>
              <ul className="space-y-2">
                {['All Products', 'Beauty Tools', 'Home & Organise', 'New Arrivals'].map(l => (
                  <li key={l}><Link href="/shop" className="text-sm text-bloom-bark/60 hover:text-bloom-berry transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] tracking-widest uppercase text-bloom-bark/40 mb-4">Help</h4>
              <ul className="space-y-2">
                {['Track Order', 'Shipping Info', 'Returns', 'Contact Us'].map(l => (
                  <li key={l}><Link href="#" className="text-sm text-bloom-bark/60 hover:text-bloom-berry transition-colors">{l}</Link></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="border-t border-bloom-sand px-6 py-6 max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
            <p className="text-[11px] text-bloom-bark/30 tracking-wide">© 2026 BloomShelf. All rights reserved.</p>
            <p className="text-[11px] text-bloom-bark/30 tracking-wide">Powered by love & CJDropshipping</p>
          </div>
        </footer>

      </main>
    </>
  )
}
