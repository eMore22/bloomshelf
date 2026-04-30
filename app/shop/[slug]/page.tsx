'use client'
// app/shop/[slug]/page.tsx
// Note: We use 'use client' here so we can handle cart interactions
// Product data is fetched client-side using the pid from the slug

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import Navbar from '@/components/Navbar'
import CartDrawer from '@/components/CartDrawer'
import { useCart } from '@/store/cart'
import { Minus, Plus, ShoppingBag, ArrowLeft } from 'lucide-react'

interface Variant {
  vid: string
  variantNameEn: string
  variantSellPrice: number
  variantImage: string
  variantStock: number
}

interface Product {
  pid: string
  productNameEn: string
  productImage: string
  productImages?: string[]
  sellPrice: number
  categoryName: string
  productDescEn?: string
  variants?: Variant[]
}

export default function ProductPage() {
  const params    = useParams()
  const router    = useRouter()
  const { addItem, openCart } = useCart()

  const [product,       setProduct]       = useState<Product | null>(null)
  const [loading,       setLoading]       = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedVid,   setSelectedVid]   = useState<string>('')
  const [quantity,      setQuantity]      = useState(1)
  const [added,         setAdded]         = useState(false)

  // Extract pid from slug (last 6 chars after final dash)
  const slug = params.slug as string
  const pid  = slug?.split('-').pop() || ''

  useEffect(() => {
    if (!pid) return
    fetch(`/api/cj/product?pid=${pid}`)
      .then(r => r.json())
      .then(data => {
        if (data.ok) {
          setProduct(data.product)
          if (data.product.variants?.length) {
            setSelectedVid(data.product.variants[0].vid)
          }
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [pid])

  const selectedVariant = product?.variants?.find(v => v.vid === selectedVid)
  const price = selectedVariant?.variantSellPrice || product?.sellPrice || 0
  const comparePrice = price * 1.38
  const images = [
    product?.productImage,
    ...(product?.variants?.map(v => v.variantImage).filter(Boolean) || [])
  ].filter((img, idx, arr) => img && arr.indexOf(img) === idx) as string[]

  function handleAddToCart() {
    if (!product) return
    addItem({
      id:       selectedVid || product.pid,
      pid:      product.pid,
      name:     product.productNameEn,
      image:    images[selectedImage] || product.productImage,
      price,
      quantity,
      variant:  selectedVariant?.variantNameEn,
    })
    setAdded(true)
    openCart()
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <CartDrawer />
        <div className="min-h-screen bg-bloom-cream flex items-center justify-center">
          <div className="w-10 h-10 border-2 border-bloom-rose border-t-bloom-berry rounded-full animate-spin" />
        </div>
      </>
    )
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <CartDrawer />
        <div className="min-h-screen bg-bloom-cream flex flex-col items-center justify-center gap-4 text-bloom-bark/40">
          <p className="font-display text-3xl font-light">Product not found</p>
          <Link href="/shop" className="text-xs tracking-widest uppercase border-b border-bloom-bark/30 pb-0.5 hover:text-bloom-berry transition-colors">
            Back to Shop
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <CartDrawer />

      <main className="pt-20 min-h-screen bg-bloom-cream">
        <div className="max-w-7xl mx-auto px-6 py-12">

          {/* Breadcrumb */}
          <Link href="/shop" className="inline-flex items-center gap-2 text-xs tracking-widest uppercase text-bloom-bark/40 hover:text-bloom-berry transition-colors mb-10">
            <ArrowLeft size={12} />
            Back to Shop
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">

            {/* Image gallery */}
            <div className="space-y-3">
              {/* Main image */}
              <div className="relative aspect-square bg-bloom-sand rounded-sm overflow-hidden">
                <Image
                  src={images[selectedImage] || product.productImage}
                  alt={product.productNameEn}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 flex-wrap">
                  {images.slice(0, 6).map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i)}
                      className={`relative w-16 h-16 rounded-sm overflow-hidden border-2 transition-colors ${
                        selectedImage === i ? 'border-bloom-bark' : 'border-transparent'
                      }`}
                    >
                      <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="flex flex-col gap-6">
              {/* Category */}
              <p className="text-[10px] tracking-[0.35em] uppercase text-bloom-rose">
                {product.categoryName}
              </p>

              {/* Name */}
              <h1 className="font-display text-3xl md:text-4xl font-light text-bloom-bark leading-tight">
                {product.productNameEn}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl text-bloom-bark">${price.toFixed(2)}</span>
                <span className="text-sm text-bloom-bark/40 line-through">${comparePrice.toFixed(2)}</span>
                <span className="text-xs text-bloom-berry tracking-wide">
                  Save {Math.round((1 - price / comparePrice) * 100)}%
                </span>
              </div>

              <div className="w-12 h-px bg-bloom-sand" />

              {/* Variants */}
              {product.variants && product.variants.length > 1 && (
                <div className="space-y-3">
                  <p className="text-xs tracking-widest uppercase text-bloom-bark/50">
                    Variant — <span className="text-bloom-bark">{selectedVariant?.variantNameEn}</span>
                  </p>
                  <div className="flex gap-2 flex-wrap">
                    {product.variants.map(v => (
                      <button
                        key={v.vid}
                        onClick={() => setSelectedVid(v.vid)}
                        className={`px-4 py-2 text-xs tracking-wide border rounded-sm transition-colors ${
                          selectedVid === v.vid
                            ? 'border-bloom-bark bg-bloom-bark text-bloom-cream'
                            : 'border-bloom-sand text-bloom-bark hover:border-bloom-bark'
                        }`}
                      >
                        {v.variantNameEn}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="space-y-3">
                <p className="text-xs tracking-widest uppercase text-bloom-bark/50">Quantity</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-9 h-9 flex items-center justify-center border border-bloom-sand rounded-full hover:border-bloom-bark transition-colors"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="font-body text-lg w-6 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-9 h-9 flex items-center justify-center border border-bloom-sand rounded-full hover:border-bloom-bark transition-colors"
                  >
                    <Plus size={12} />
                  </button>
                </div>
              </div>

              {/* Add to cart */}
              <button
                onClick={handleAddToCart}
                className={`flex items-center justify-center gap-3 w-full py-4 text-sm tracking-widest uppercase transition-colors duration-300 ${
                  added
                    ? 'bg-bloom-berry text-bloom-cream'
                    : 'bg-bloom-bark text-bloom-cream hover:bg-bloom-berry'
                }`}
              >
                <ShoppingBag size={16} />
                {added ? 'Added to Bag!' : 'Add to Bag'}
              </button>

              {/* Shipping note */}
              <p className="text-xs text-bloom-bark/40 tracking-wide text-center">
                🌍 Ships worldwide · 10–20 business days · Tracked delivery
              </p>

              <div className="w-12 h-px bg-bloom-sand" />

              {/* Description */}
              {product.productDescEn && (
                <div className="space-y-2">
                  <p className="text-xs tracking-widest uppercase text-bloom-bark/50">Description</p>
                  <p className="text-sm text-bloom-bark/70 leading-relaxed line-clamp-6">
                    {product.productDescEn.replace(/<[^>]*>/g, '').slice(0, 400)}...
                  </p>
                </div>
              )}

            </div>
          </div>
        </div>
      </main>
    </>
  )
}