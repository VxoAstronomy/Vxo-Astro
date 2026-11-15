import { useEffect, useRef, useState } from 'react';
import { handleImageError } from '../lib/format';
import { useLockBody } from '../lib/hooks';
import { useShop } from '../Store';
import { IconChevronLeft, IconChevronRight, IconClose, IconZoom } from './Icons';

export default function Lightbox() {
  const { lightbox, setLightbox } = useShop();
  const open = Boolean(lightbox);
  useLockBody(open);

  const [zoom, setZoom] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const drag = useRef(null);
  const moved = useRef(false);
  const touch = useRef(0);
  const closeRef = useRef(null);

  const count = lightbox?.images?.length || 0;
  const index = lightbox?.index || 0;

  const go = (step) => {
    if (!count) return;
    setLightbox((current) =>
      current ? { ...current, index: (current.index + step + count) % count } : current,
    );
  };

  useEffect(() => {
    if (!open) return;
    setZoom(false);
    setOffset({ x: 0, y: 0 });
    closeRef.current?.focus();
  }, [open, index]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === 'Escape') setLightbox(null);
      if (event.key === 'ArrowLeft') go(-1);
      if (event.key === 'ArrowRight') go(1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!lightbox) return null;

  const images = lightbox.images;
  const current = images[index];

  const toggleZoom = () => {
    setZoom((z) => !z);
    setOffset({ x: 0, y: 0 });
  };

  const onPointerDown = (event) => {
    if (!zoom) return;
    drag.current = { x: event.clientX, y: event.clientY, ox: offset.x, oy: offset.y };
    moved.current = false;
    setDragging(true);
    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!drag.current) return;
    const dx = event.clientX - drag.current.x;
    const dy = event.clientY - drag.current.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) moved.current = true;
    setOffset({ x: drag.current.ox + dx, y: drag.current.oy + dy });
  };

  const onPointerUp = () => {
    drag.current = null;
    setDragging(false);
  };

  const onImageClick = (event) => {
    event.stopPropagation();
    if (moved.current) {
      moved.current = false;
      return;
    }
    toggleZoom();
  };

  return (
    <div
      className="fixed inset-0 z-[90] flex flex-col bg-black/95 backdrop-blur-xl overlay-enter"
      role="dialog"
      aria-modal="true"
      aria-label={`Ảnh sản phẩm ${lightbox.title}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) setLightbox(null);
      }}
    >
      <div className="flex items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-zinc-200">{lightbox.title}</p>
          <p className="mt-0.5 text-[10px] uppercase tracking-[0.24em] text-zinc-500">
            Ảnh {String(index + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
          </p>
        </div>
        <button
          ref={closeRef}
          type="button"
          onClick={() => setLightbox(null)}
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/10 text-zinc-300 transition hover:border-white/30 hover:text-white"
          aria-label="Đóng"
        >
          <IconClose className="h-5 w-5" />
        </button>
      </div>

      <div
        className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-3 sm:px-20"
        onClick={(event) => {
          if (event.target === event.currentTarget) setLightbox(null);
        }}
        onTouchStart={(event) => {
          touch.current = event.touches[0].clientX;
        }}
        onTouchEnd={(event) => {
          if (zoom) return;
          const dx = event.changedTouches[0].clientX - touch.current;
          if (Math.abs(dx) > 45) go(dx > 0 ? -1 : 1);
        }}
      >
        <button
          type="button"
          onClick={() => go(-1)}
          className="absolute left-2 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-ink-950/50 text-zinc-300 backdrop-blur transition hover:border-white/30 hover:text-white sm:left-5"
          aria-label="Ảnh trước"
          disabled={count < 2}
        >
          <IconChevronLeft className="h-5 w-5" />
        </button>

        <img
          src={current}
          alt={`${lightbox.title} – ảnh ${index + 1}`}
          onError={handleImageError}
          draggable="false"
          onClick={onImageClick}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
          style={{
            transform: zoom ? `translate(${offset.x}px, ${offset.y}px) scale(2.15)` : 'none',
            transition: dragging ? 'none' : 'transform 0.4s cubic-bezier(0.22,1,0.36,1)',
          }}
          className={`lightbox-img select-none ${zoom ? 'cursor-grab active:cursor-grabbing' : ''}`}
        />

        <button
          type="button"
          onClick={() => go(1)}
          className="absolute right-2 z-10 grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-ink-950/50 text-zinc-300 backdrop-blur transition hover:border-white/30 hover:text-white sm:right-5"
          aria-label="Ảnh sau"
          disabled={count < 2}
        >
          <IconChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div className="flex flex-col gap-4 px-5 pb-6 pt-3 sm:px-8">
        {images.length > 1 && (
          <div className="no-scrollbar flex justify-center gap-2 overflow-x-auto">
            {images.map((image, i) => (
              <button
                key={`${image}-${i}`}
                type="button"
                onClick={() => setLightbox((currentState) => ({ ...currentState, index: i }))}
                className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-xl border transition-all duration-300 ${
                  i === index ? 'border-white/70 opacity-100' : 'border-white/10 opacity-45 hover:opacity-80'
                }`}
                aria-label={`Xem ảnh ${i + 1}`}
                aria-current={i === index}
              >
                <img src={image} alt="" onError={handleImageError} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.24em] text-zinc-500">
          <span className="hidden sm:inline">Nhấp vào ảnh để phóng to · kéo để di chuyển</span>
          <button
            type="button"
            onClick={toggleZoom}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5 text-[10px] uppercase tracking-[0.16em] text-zinc-300 transition hover:border-white/30 hover:text-white"
          >
            <IconZoom className="h-3.5 w-3.5" />
            {zoom ? 'Thu nhỏ' : 'Phóng to'}
          </button>
          <span className="hidden sm:inline">Esc để đóng</span>
        </div>
      </div>
    </div>
  );
}
