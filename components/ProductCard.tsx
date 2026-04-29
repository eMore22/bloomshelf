import Link from 'next/link'
import Image from 'next/image'

interface Props {
  pid: string; slug: string; name: string; image: string
  price: number; comparePrice?: number; category?: string
}

export default function ProductCard({ pid, slug, name, image, price, comparePrice, category }: Props) {
  const discount = comparePrice && comparePrice > price ? Math.round((1 - price / comparePrice) * 100) : null
  return (
    <Link href={`/shop/${slug}`} className="group block">
      <div className="relative overflow-hidden rounded-sm bg-bloom-sand aspect-[3/4]">
        <Image src={image || '/placeholder.jpg'} alt={name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" sizes="(max-width: 768px) 50vw, 25vw" />
        {discount && (
          <span className="absolute top-3 left-3 bg-bloom-berry text-white text-[10px] tracking-widest uppercase px-2 py-1">−{discount}%</span>
        )}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="bg-bloom-bark text-bloom-cream text-xs tracking-widest uppercase text-center py-3">View Product</div>
        </div>
      </div>
      <div className="mt-3 space-y-1">
        {category && <p className="text-[10px] tracking-widest uppercase text-bloom-rose">{category}</p>}
        <h3 className="font-body text-sm text-bloom-bark line-clamp-1">{name}</h3>
        <div className="flex items-center gap-2">
          <span className="font-display text-base text-bloom-bark">${price.toFixed(2)}</span>
          {comparePrice && comparePrice > price && (
            <span className="text-xs text-bloom-bark/40 line-through">${comparePrice.toFixed(2)}</span>
          )}
        </div>
      </div>
    </Link>
  )
}
