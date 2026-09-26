import { useRef, useState } from "react";
import { Link, createFileRoute, notFound } from "@tanstack/react-router";
import { Check, ChevronLeft, ChevronRight, Minus, Plus, ShieldCheck, ShoppingBag, Star, Truck } from "lucide-react";
import { getCategory, getProduct } from "@/lib/products";
import { useCart } from "@/lib/cart";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/ProductCard";
import { products, formatPrice } from "@/lib/products";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$productId")({
  beforeLoad: ({ params }) => { if (!getProduct(params.productId)) throw notFound(); },
  head: ({ params }) => {
    const product = getProduct(params.productId);
    const title = product ? `${product.name} — gshoppy` : "Product — gshoppy";
    const description = product?.blurb ?? "Shop useful everyday technology at gshoppy.";
    return { meta: [
      { title }, { name: "description", content: description },
      { property: "og:title", content: title }, { property: "og:description", content: description },
      { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: title }, { name: "twitter:description", content: description },
    ] };
  },
  component: ProductPage,
});

function ProductPage() {
  const { productId } = Route.useParams();
  const product = getProduct(productId);
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const touchStartX = useRef<number | null>(null);
  if (!product) return null;
  const category = getCategory(product.category);
  const related = products.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  const imageModes = ["object-cover", "object-cover scale-110", "object-cover scale-125"];
  const changeGallery = (direction: number) => setGalleryIndex((index) => (index + direction + product.gallery.length) % product.gallery.length);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
      <nav className="flex flex-wrap items-center gap-1 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Shop</Link><ChevronRight className="size-3.5" />
        {category && <><Link to="/category/$slug" params={{ slug: category.slug }} className="hover:text-foreground">{category.name}</Link><ChevronRight className="size-3.5" /></>}
        <span className="text-foreground">{product.name}</span>
      </nav>

      <section className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(360px,.85fr)] lg:gap-14">
        <div className="min-w-0">
          <div
            className="relative overflow-hidden rounded-lg border bg-muted outline-none focus-visible:ring-2 focus-visible:ring-ring"
            tabIndex={0}
            aria-label={`${product.name} gallery, view ${galleryIndex + 1} of ${product.gallery.length}. Use arrow keys to browse.`}
            onKeyDown={(event) => {
              if (event.key === "ArrowRight") { event.preventDefault(); changeGallery(1); }
              if (event.key === "ArrowLeft") { event.preventDefault(); changeGallery(-1); }
            }}
            onTouchStart={(event) => { touchStartX.current = event.touches[0]?.clientX ?? null; }}
            onTouchEnd={(event) => {
              const endX = event.changedTouches[0]?.clientX;
              if (touchStartX.current !== null && endX !== undefined && Math.abs(endX - touchStartX.current) > 45) changeGallery(endX < touchStartX.current ? 1 : -1);
              touchStartX.current = null;
            }}
          >
            <img src={product.gallery[galleryIndex]} alt={`${product.name}, view ${galleryIndex + 1}`} width={768} height={768} draggable={false} className={cn("aspect-square w-full select-none transition-transform duration-300 motion-reduce:transition-none", imageModes[galleryIndex])} />
            <Button variant="outline" size="icon" onClick={() => changeGallery(-1)} aria-label="Previous product view" className="absolute left-3 top-1/2 size-11 -translate-y-1/2 rounded-full bg-card/90 shadow-sm"><ChevronLeft className="size-5" /></Button>
            <Button variant="outline" size="icon" onClick={() => changeGallery(1)} aria-label="Next product view" className="absolute right-3 top-1/2 size-11 -translate-y-1/2 rounded-full bg-card/90 shadow-sm"><ChevronRight className="size-5" /></Button>
            <span className="absolute bottom-3 right-3 rounded-full bg-card/90 px-3 py-1 text-xs font-medium">{galleryIndex + 1} / {product.gallery.length}</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3" aria-label="Product views">
            {product.gallery.map((image, index) => (
              <Button key={index} variant="ghost" onClick={() => setGalleryIndex(index)} aria-label={`View product image ${index + 1}`} aria-current={galleryIndex === index ? "true" : undefined} className={cn("h-auto min-h-14 overflow-hidden rounded-md border-2 bg-muted p-0", galleryIndex === index ? "border-primary" : "border-transparent")}>
                <img src={image} alt="" loading="lazy" width={180} height={140} className={cn("aspect-[4/3] w-full", imageModes[index])} />
              </Button>
            ))}
          </div>
        </div>

        <div className="lg:pt-3">
          <div className="flex items-center gap-2 text-sm"><span className="flex items-center gap-1 font-semibold"><Star className="size-4 fill-primary text-primary" />{product.rating}</span><span className="text-muted-foreground">{product.reviews} reviews</span></div>
          <h1 className="mt-3 font-display text-3xl font-bold leading-tight sm:text-4xl">{product.name}</h1>
          <div className="mt-4 flex items-baseline gap-3"><span className="font-display text-2xl font-bold">{formatPrice(product.price)}</span>{product.oldPrice && <span className="text-muted-foreground line-through">{formatPrice(product.oldPrice)}</span>}</div>
          <p className="mt-5 leading-relaxed text-muted-foreground">{product.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">{product.compatibility.map((item) => <span key={item} className="rounded-full border bg-card px-3 py-1 text-xs font-medium">{item}</span>)}</div>
          <div className="mt-7 border-y py-5">
            <p className="mb-2 text-sm font-semibold">Quantity</p>
            <div className="flex gap-3">
              <div className="flex h-11 items-center rounded-md border bg-card">
                <Button variant="ghost" size="icon" onClick={() => setQty((value) => Math.max(1, value - 1))} aria-label="Decrease quantity"><Minus /></Button>
                <span className="w-10 text-center font-semibold">{qty}</span>
                <Button variant="ghost" size="icon" onClick={() => setQty((value) => Math.min(99, value + 1))} aria-label="Increase quantity"><Plus /></Button>
              </div>
              <Button size="lg" className="h-11 flex-1 rounded-md" onClick={() => add(product, qty)}><ShoppingBag /> Add {qty > 1 ? `${qty} to cart` : "to cart"}</Button>
            </div>
            <p className="mt-3 flex items-center gap-2 text-sm text-muted-foreground"><Check className="size-4 text-chart-2" /> In stock and ready to ship</p>
          </div>
          <div className="grid grid-cols-2 gap-4 py-5 text-sm"><div className="flex gap-2"><Truck className="size-5 text-primary" /><span><strong className="block">Fast delivery</strong><span className="text-muted-foreground">Free over $50</span></span></div><div className="flex gap-2"><ShieldCheck className="size-5 text-primary" /><span><strong className="block">2-year warranty</strong><span className="text-muted-foreground">30-day returns</span></span></div></div>
        </div>
      </section>

      <section className="mt-14 grid gap-8 border-t pt-10 md:grid-cols-2">
        <div><h2 className="font-display text-xl font-bold">Specifications</h2><dl className="mt-4 divide-y border-y">{Object.entries(product.specs).map(([key,value]) => <div key={key} className="grid grid-cols-2 gap-4 py-3 text-sm"><dt className="text-muted-foreground">{key}</dt><dd className="font-medium">{value}</dd></div>)}</dl></div>
        <div><h2 className="font-display text-xl font-bold">Compatibility</h2><p className="mt-4 text-sm leading-relaxed text-muted-foreground">Works with {product.compatibility.join(", ")}. Review your device connector and dimensions before ordering.</p><ul className="mt-4 space-y-3 text-sm">{product.compatibility.map((item) => <li key={item} className="flex items-center gap-2"><Check className="size-4 text-chart-2" /> Compatible with {item}</li>)}</ul></div>
      </section>

      <section className="mt-14 border-t pt-10"><h2 className="font-display text-2xl font-bold">You may also like</h2><div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">{related.map((item) => <ProductCard key={item.id} product={item} />)}</div></section>
    </div>
  );
}