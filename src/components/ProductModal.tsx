'use client';

import React, { useState } from 'react';
import { Minus, Package, Plus, ShoppingCart, X } from 'lucide-react';
import {
  formatMoney,
  getLocalizedProductDescription,
  getLocalizedProductName,
  type TranslationBundle,
} from '../i18n/translations.ts';
import type { Currency, Language, Product } from '../types.ts';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  lang: Language;
  currency: Currency;
  t: TranslationBundle;
  onAddToCart: (productId: number, quantity: number) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  lang,
  currency,
  t,
  onAddToCart,
}) => {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const title = getLocalizedProductName(product, lang);
  const desc = getLocalizedProductDescription(product, lang);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-[var(--ufb-border)] bg-[var(--ufb-card)] text-[var(--ufb-text)] shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 z-20 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-card)]/90 hover:bg-[var(--ufb-surface)] transition-colors"
          aria-label={t.productModal.close}
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left Image / Empty Placeholder */}
          <div className="aspect-[4/3] md:aspect-auto md:h-full bg-[var(--ufb-surface)] flex items-center justify-center border-b md:border-b-0 md:border-r border-[var(--ufb-border)] overflow-hidden">
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt={title}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-dashed border-[var(--ufb-border)] bg-[var(--ufb-card)]">
                  <Package className="h-8 w-8 text-[#F47B20]/70" />
                </div>
                <p className="mt-3 text-xs text-[var(--ufb-muted)]">{t.catalog.noPhotoYet}</p>
              </div>
            )}
          </div>

          {/* Right Contiguous Purchase Module */}
          <div className="flex flex-col justify-between p-6 md:p-7 space-y-6">
            <div className="space-y-4">
              <div className="text-xs font-semibold">
                <span className={product.isAvailable ? 'text-[#238447]' : 'text-[var(--ufb-muted)]'}>
                  {product.isAvailable ? t.catalog.available : t.catalog.unavailable}
                </span>
              </div>

              <h3 className="font-display text-2xl font-bold tracking-tight pr-8">{title}</h3>

              <p className="text-sm text-[var(--ufb-muted)] leading-relaxed whitespace-pre-line">
                {desc || t.catalog.noDescriptionYet}
              </p>

              <div className="grid grid-cols-2 gap-3 rounded-xl border border-[var(--ufb-border)] bg-[var(--ufb-surface)] p-3.5">
                <div>
                  <div className="text-[11px] font-medium text-[var(--ufb-muted)]">
                    {t.productModal.usdPrice}
                  </div>
                  <div
                    className={`mt-0.5 font-mono-num text-base font-bold ${
                      currency === 'USD' ? 'text-[#F47B20]' : ''
                    }`}
                  >
                    {formatMoney(product.priceUsd, 'USD')}
                  </div>
                </div>
                <div>
                  <div className="text-[11px] font-medium text-[var(--ufb-muted)]">
                    {t.productModal.htgPrice}
                  </div>
                  <div
                    className={`mt-0.5 font-mono-num text-base font-bold ${
                      currency === 'HTG' ? 'text-[#F47B20]' : ''
                    }`}
                  >
                    {formatMoney(product.priceHtg, 'HTG')}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3 pt-2 border-t border-[var(--ufb-border)]">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[var(--ufb-muted)]">
                  {t.productModal.quantity}
                </span>
                <div className="inline-flex items-center rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="inline-flex h-10 w-10 items-center justify-center hover:text-[#F47B20]"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-9 text-center font-mono-num text-sm font-semibold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(25, q + 1))}
                    className="inline-flex h-10 w-10 items-center justify-center hover:text-[#238447]"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <button
                type="button"
                disabled={!product.isAvailable}
                onClick={() => {
                  onAddToCart(product.id, quantity);
                  setQuantity(1);
                  onClose();
                }}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#238447] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1b6b38] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>{t.productModal.addToCart}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
