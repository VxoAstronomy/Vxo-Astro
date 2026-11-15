import { PHONES, ZALO } from '../lib/storeConfig';

/* Mỗi số là một liên kết gọi riêng; dấu gạch ngăn cách màu trắng sáng. */
export default function PhoneLinks({ className = '', linkClass = '' }) {
  const list = PHONES.length ? PHONES : [ZALO.phone];
  return (
    <span className={`inline-flex flex-wrap items-center gap-x-2 gap-y-0.5 ${className}`}>
      {list.map((phone, index) => (
        <span key={phone} className="inline-flex items-center gap-2">
          {index > 0 && (
            <span aria-hidden="true" className="text-white/80">
              -
            </span>
          )}
          <a href={`tel:${phone}`} className={`tabular-nums transition-colors hover:text-white ${linkClass}`}>
            {phone}
          </a>
        </span>
      ))}
    </span>
  );
}