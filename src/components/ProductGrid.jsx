import ProductCard from './ProductCard';

function Skeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-[20px] border border-white/[0.06] bg-white/[0.02] sm:rounded-[26px]">
      <div className="aspect-[4/3] bg-white/[0.03]" />
      <div className="space-y-3 p-4 sm:p-6">
        <div className="h-2 w-16 rounded bg-white/[0.05]" />
        <div className="h-3.5 w-3/4 rounded bg-white/[0.06]" />
        <div className="h-2.5 w-full rounded bg-white/[0.04]" />
        <div className="h-5 w-28 rounded bg-white/[0.06]" />
        <div className="h-11 w-full rounded-2xl bg-white/[0.04]" />
      </div>
    </div>
  );
}

export default function ProductGrid({ products, loading = false, emptyText = 'Không tìm thấy sản phẩm phù hợp.' }) {
  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} />
        ))}
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="rounded-[26px] border border-white/[0.07] bg-white/[0.015] py-20 text-center">
        <p className="text-sm text-zinc-500">{emptyText}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 items-stretch gap-3 sm:gap-6 lg:grid-cols-3">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </div>
  );
}
