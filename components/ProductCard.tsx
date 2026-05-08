import Link from 'next/link'

interface Props {
  pid:          string
  slug:         string
  name:         string
  image:        string
  price:        number
  comparePrice?: number
  category?:    string
}

export default function ProductCard({ pid, slug, name, image, price, comparePrice, category }: Props) {
  const numPrice        = Number(price) || 0
  const numComparePrice = Number(comparePrice) || 0

  // Skip products with no valid price
  if (numPrice <= 0) return null

  const discount = numComparePrice && numComparePrice > numPrice
    ? Math.round((1 - numPrice / numComparePrice) * 100)
    : null

  return (
    <Link href={`/shop/${slug}`} className="group block">
      <div className="relative overflow-hidden rounded-sm bg-bloom-sand aspect-[3/4]">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-bloom-sand">
            <span className="text-bloom-bark/20 text-xs">No image</span>
          </div>
        )}
        {discount && (
          <span className="absolute top-3 left-3 bg-bloom-berry text-white text-[10px] tracking-widest uppercase px-2 py-1">
            −{discount}%
          </span>
        )}
        <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <div className="bg-bloom-bark text-bloom-cream text-xs tracking-widest uppercase text-center py-3">
            View Product
          </div>
        </div>
      </div>

      <div className="mt-3 space-y-1">
        {category && (
          <p className="text-[10px] tracking-widest uppercase text-bloom-rose">{category}</p>
        )}
        <h3 className="font-body text-sm text-bloom-bark line-clamp-1">{name}</h3>
        <div className="flex items-center gap-2">
          <span className="font-display text-base text-bloom-bark">
            ${numPrice.toFixed(2)}
          </span>
          {numComparePrice > numPrice && (
            <span className="text-xs text-bloom-bark/40 line-through">
              ${numComparePrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}