import { useMemo, useState } from 'react';
import { IconArrowRight, IconChat, IconChevronDown, IconSearch } from '../components/Icons';
import PageHeader from '../components/PageHeader';
import ProductGrid from '../components/ProductGrid';
import { useShop } from '../Store';
import { priceRange } from '../lib/products';
import { useHashRoute } from '../lib/useHashRoute';

const SORTS = [
  { id: 'featured', label: 'Nổi bật' },
  { id: 'price-asc', label: 'Giá thấp → cao' },
  { id: 'price-desc', label: 'Giá cao → thấp' },
  { id: 'name', label: 'Tên A → Z' },
];

export default function Shop() {
  const { products, loading, openConsult } = useShop();
  const route = useHashRoute();
  const [query, setQuery] = useState('');
  const [cat, setCat] = useState('Tất cả');
  const [sort, setSort] = useState('featured');

  const categories = useMemo(() => ['Tất cả', ...new Set(products.map((p) => p.cat))], [products]);

  const filtered = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    const list = products.filter((product) => {
      if (cat !== 'Tất cả' && product.cat !== cat) return false;
      if (!keyword) return true;
      const haystack = [product.name, product.cat, product.desc, ...(product.specs || [])].join(' ').toLowerCase();
      return haystack.includes(keyword);
    });

    const price = (product) => priceRange(product)[0];
    return [...list].sort((a, b) => {
      if (sort === 'price-asc') return price(a) - price(b);
      if (sort === 'price-desc') return price(b) - price(a);
      if (sort === 'name') return a.name.localeCompare(b.name, 'vi');
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    });
  }, [products, query, cat, sort]);

  const reset = () => {
    setQuery('');
    setCat('Tất cả');
    setSort('featured');
  };

  return (
    <div className="pb-10">
      <PageHeader
        eyebrow="Cửa hàng"
        title="Chọn cấu hình. Quan sát ngay."
        desc="Mọi sản phẩm đều hiển thị giá và tình trạng kho. Sản phẩm có tuỳ chọn chỉ cho phép những cấu hình tương thích."
      />

      <section className="container-x">
        <div className="flex flex-col gap-5 rounded-[26px] border border-white/[0.08] bg-white/[0.02] p-4 backdrop-blur-sm sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="relative flex-1">
              <span className="sr-only">Tìm sản phẩm</span>
              <IconSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-600" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                type="search"
                placeholder="Tìm gương, kính, tracking…"
                className="field pl-11"
              />
            </label>

            <label className="relative sm:w-52">
              <span className="sr-only">Sắp xếp</span>
              <select
                value={sort}
                onChange={(event) => setSort(event.target.value)}
                className="field appearance-none pr-10"
              >
                {SORTS.map((option) => (
                  <option key={option.id} value={option.id} className="bg-ink-900">
                    {option.label}
                  </option>
                ))}
              </select>
              <IconChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
            </label>
          </div>

          <div className="no-scrollbar flex gap-2 overflow-x-auto pb-0.5">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCat(item)}
                className={`chip ${cat === item ? 'chip-active' : ''}`}
                aria-pressed={cat === item}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-7 flex items-center justify-between gap-4">
          <p className="text-[10px] uppercase tracking-[0.24em] text-zinc-600">
            {loading ? 'Đang tải sản phẩm' : `${filtered.length} sản phẩm`}
          </p>
          {(query || cat !== 'Tất cả' || sort !== 'featured') && (
            <button type="button" onClick={reset} className="text-[11px] text-zinc-500 transition hover:text-white">
              Xoá bộ lọc
            </button>
          )}
        </div>

        <div className="mt-6" key={route}>
          <ProductGrid
            products={filtered}
            loading={loading}
            emptyText="Không tìm thấy sản phẩm phù hợp. Thử từ khoá khác hoặc gửi yêu cầu chế tạo riêng."
          />
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-2">
          <div className="rounded-[26px] border border-white/[0.08] bg-white/[0.02] p-6 sm:p-8">
            <p className="eyebrow">Không thấy cấu hình?</p>
            <h2 className="mt-4 text-2xl font-extralight tracking-tight text-white">Đặt chế tạo theo yêu cầu</h2>
            <p className="mt-3 max-w-md text-[12.5px] leading-relaxed text-zinc-500">
              Gương kích thước riêng, chân đế khác, hay hệ tracking cho chân xích đạo của bạn — gửi yêu cầu để shop báo
              giá và thời gian hoàn thiện.
            </p>
            <a href="#/yeu-cau" className="link-underline mt-6 inline-flex">
              Gửi yêu cầu <IconArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="rounded-[26px] border border-white/[0.08] bg-gradient-to-br from-accent/[0.08] to-transparent p-6 sm:p-8">
            <p className="eyebrow">Cần người chọn cùng?</p>
            <h2 className="mt-4 text-2xl font-extralight tracking-tight text-white">Tư vấn 1:1 qua Zalo</h2>
            <p className="mt-3 max-w-md text-[12.5px] leading-relaxed text-zinc-500">
              Cho shop biết mục tiêu quan sát và ngân sách. Shop sẽ gợi ý cấu hình phù hợp thay vì bán chiếc đắt nhất.
            </p>
            <button type="button" onClick={() => openConsult(null)} className="btn-primary mt-6">
              <IconChat className="h-4 w-4" /> Nhắn Zalo
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
