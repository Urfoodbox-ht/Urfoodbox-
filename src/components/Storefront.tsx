import React, { useState } from 'react';
import {
  Check,
  ExternalLink,
  Globe,
  MessageCircle,
  MessageSquare,
  Moon,
  Package,
  Palette,
  Search,
  ShoppingBag,
  ShoppingCart,
  Star,
  Sun,
  Truck,
  User,
} from 'lucide-react';
import {
  formatMoney,
  getLocalizedProductDescription,
  getLocalizedProductName,
  type TranslationBundle,
} from '../i18n/translations.ts';
import type {
  BusinessSettings,
  CartItem,
  Currency,
  CustomerComment,
  Language,
  OrderStatus,
  PaymentMethod,
  Product,
  ThemeMode,
} from '../types.ts';

interface StorefrontProps {
  settings: BusinessSettings | null;
  products: Product[];
  comments: CustomerComment[];
  onCommentAdded: (comment: CustomerComment) => void;
  loading: boolean;
  error: string | null;
  onRetry: () => void;
  lang: Language;
  onLangChange: (l: Language) => void;
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  theme: ThemeMode;
  onThemeChange: (t: ThemeMode) => void;
  t: TranslationBundle;
  cart: CartItem[];
  onAddToCart: (productId: number, quantity?: number) => void;
  onOpenCart: () => void;
  onSelectProduct: (product: Product) => void;
  onOpenAccount: () => void;
  customerEmail: string | null;
  onOpenAdmin: () => void;
}

interface TrackedOrderResult {
  orderReference: string;
  boxPeriod?: string;
  householdSize?: number;
  currency: Currency;
  paymentMethod: PaymentMethod;
  totalAmount: string;
  status: OrderStatus;
  createdAt: string;
  items: { productName: string; quantity: number; lineTotal: string }[];
}

export const Storefront: React.FC<StorefrontProps> = ({
  settings,
  products,
  comments,
  onCommentAdded,
  loading,
  error,
  onRetry,
  lang,
  onLangChange,
  currency,
  onCurrencyChange,
  theme,
  onThemeChange,
  t,
  cart,
  onAddToCart,
  onOpenCart,
  onSelectProduct,
  onOpenAccount,
  customerEmail,
  onOpenAdmin,
}) => {
  const [justAddedId, setJustAddedId] = useState<number | null>(null);
  const [trackInput, setTrackInput] = useState('');
  const [tracking, setTracking] = useState(false);
  const [trackedOrder, setTrackedOrder] = useState<TrackedOrderResult | null>(null);
  const [trackError, setTrackError] = useState<string | null>(null);
  const [customBoxUnit, setCustomBoxUnit] = useState<'week' | 'month' | ''>('');
  const [customBoxCount, setCustomBoxCount] = useState<number | null>(null);
  const [customBoxPersons, setCustomBoxPersons] = useState<string>('');
  const [commentAuthor, setCommentAuthor] = useState('');
  const [commentRating, setCommentRating] = useState(5);
  const [commentText, setCommentText] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const [commentFeedback, setCommentFeedback] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  const logoUrl =
    settings?.logoUrl || '/assets/aistudio/IMG-20261115-WA0000_6c778049_6c778049.jpg';

  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const heroTitle =
    lang === 'fr'
      ? settings?.promoTitleFr
      : lang === 'ht'
        ? settings?.promoTitleHt
        : settings?.promoTitleEn;

  const heroSubtitle =
    lang === 'fr'
      ? settings?.promoSubtitleFr
      : lang === 'ht'
        ? settings?.promoSubtitleHt
        : settings?.promoSubtitleEn;

  const cleanWhatsappDigits = (settings?.whatsappNumber || '').replace(/[^\d]/g, '');
  const resolvedCustomPeriod =
    customBoxUnit && customBoxCount
      ? `${customBoxCount} ${
          customBoxUnit === 'week'
            ? customBoxCount === 1
              ? t.cart.periodPresets.weekSingular
              : t.cart.periodPresets.weekPlural
            : customBoxCount === 1
              ? t.cart.periodPresets.monthSingular
              : t.cart.periodPresets.monthPlural
        }`
      : '';
  const customBoxDetails = [
    resolvedCustomPeriod ? `${t.cart.boxPeriodLabel}: ${resolvedCustomPeriod}` : '',
    customBoxPersons ? `${t.cart.householdSizeLabel}: ${customBoxPersons}` : '',
  ]
    .filter(Boolean)
    .join(' | ');
  const whatsappText = customBoxDetails
    ? `${t.customBox.whatsappPrefill} (${customBoxDetails})`
    : t.customBox.whatsappPrefill;
  const whatsappHref = cleanWhatsappDigits
    ? `https://wa.me/${cleanWhatsappDigits}?text=${encodeURIComponent(whatsappText)}`
    : null;

  const handleAdd = (productId: number) => {
    onAddToCart(productId, 1);
    setJustAddedId(productId);
    setTimeout(() => {
      setJustAddedId((curr) => (curr === productId ? null : curr));
    }, 1200);
  };

  const handleTrackOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackInput.trim()) return;
    setTracking(true);
    setTrackError(null);
    setTrackedOrder(null);
    try {
      const res = await fetch(`/api/orders/track/${encodeURIComponent(trackInput.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || t.tracker.notFound);
      }
      setTrackedOrder(data);
    } catch (err: any) {
      setTrackError(err.message || t.tracker.notFound);
    } finally {
      setTracking(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    setCommentFeedback(null);
    if (commentAuthor.trim().length < 2 || commentText.trim().length < 3) {
      setCommentFeedback({ type: 'err', text: t.comments.validationError });
      return;
    }
    setCommentSubmitting(true);
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: commentAuthor.trim(),
          rating: commentRating,
          commentText: commentText.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Could not submit comment.');
      }
      onCommentAdded(data.comment);
      setCommentAuthor('');
      setCommentRating(5);
      setCommentText('');
      setCommentFeedback({ type: 'ok', text: t.comments.successMsg });
    } catch (err: any) {
      setCommentFeedback({ type: 'err', text: err.message || 'Could not post comment.' });
    } finally {
      setCommentSubmitting(false);
    }
  };

  return (
    <div id="top" className="relative min-h-screen bg-[var(--ufb-bg)] text-[var(--ufb-text)] transition-colors duration-200">
      {/* Subtle Large Official Logo Background Watermark */}
      <div
        className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden select-none"
        aria-hidden="true"
      >
        <img
          src={logoUrl}
          alt=""
          className={`w-[min(88vw,780px)] max-h-[82vh] object-contain transition-opacity duration-300 ${
            theme === 'dark' ? 'opacity-[0.045] rounded-3xl' : 'opacity-[var(--ufb-watermark-opacity)]'
          }`}
        />
      </div>

      {/* Top Navigation Bar (Strict 3-Zone Contract) */}
      <header className="sticky top-0 z-30 border-b border-[var(--ufb-border)] bg-[var(--ufb-bg)]/92 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 py-3">
          {/* Zone 1: Brand Mark */}
          <a href="#top" className="flex items-center gap-2.5 whitespace-nowrap shrink-0">
            <img
              src={logoUrl}
              alt="UrFoodBox"
              className="h-9 w-9 rounded-lg object-contain bg-[#FAF5EE] border border-[var(--ufb-border)] p-0.5"
            />
            <span className="font-display text-lg font-extrabold tracking-tight">
              <span>Ur</span>
              <span className="text-[#F47B20]">Food</span>
              <span>Box</span>
            </span>
          </a>

          {/* Zone 2: Concise Single-Line Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[var(--ufb-muted)]">
            <a
              href="#boxes"
              className="hover:text-[var(--ufb-text)] transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.boxes}
            </a>
            <a
              href="#delivery"
              className="hover:text-[var(--ufb-text)] transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.delivery}
            </a>
            <a
              href="#custom-box"
              className="hover:text-[var(--ufb-text)] transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.customBox}
            </a>
            <a
              href="#track"
              className="hover:text-[var(--ufb-text)] transition-colors whitespace-nowrap shrink-0"
            >
              {t.nav.trackOrder}
            </a>
          </nav>

          {/* Zone 3: 1 Primary Action (Cart) */}
          <div className="flex items-center shrink-0">
            <button
              type="button"
              onClick={onOpenCart}
              className="inline-flex items-center gap-2 rounded-lg bg-[#238447] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1b6b38] transition-colors whitespace-nowrap shrink-0"
            >
              <ShoppingBag className="h-4 w-4" />
              <span>
                {t.nav.cart} ({totalCartItems})
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Storefront Controls Bar: Language, Currency, Theme, Optional Customer Account */}
      <div className="relative z-20 border-b border-[var(--ufb-border)] bg-[var(--ufb-surface)]/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 sm:px-6 py-2">
          <div className="flex flex-wrap items-center gap-3">
            {/* Language Switcher */}
            <div className="inline-flex items-center gap-1 rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-card)] p-0.5">
              <Globe className="ml-2 h-3.5 w-3.5 text-[var(--ufb-muted)]" aria-hidden="true" />
              {(['en', 'fr', 'ht'] as const).map((code) => (
                <button
                  key={code}
                  type="button"
                  onClick={() => onLangChange(code)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                    lang === code
                      ? 'bg-[#F47B20] text-white'
                      : 'text-[var(--ufb-muted)] hover:text-[var(--ufb-text)]'
                  }`}
                >
                  {t.languages[code]}
                </button>
              ))}
            </div>

            {/* Currency Switcher */}
            <div className="inline-flex items-center rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-card)] p-0.5">
              {(['USD', 'HTG'] as const).map((curr) => (
                <button
                  key={curr}
                  type="button"
                  onClick={() => onCurrencyChange(curr)}
                  className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                    currency === curr
                      ? 'bg-[#238447] text-white'
                      : 'text-[var(--ufb-muted)] hover:text-[var(--ufb-text)]'
                  }`}
                >
                  {curr}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Theme Switcher */}
            <div className="inline-flex items-center rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-card)] p-0.5">
              <button
                type="button"
                onClick={() => onThemeChange('light')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  theme === 'light'
                    ? 'bg-[#171717] text-white'
                    : 'text-[var(--ufb-muted)] hover:text-[var(--ufb-text)]'
                }`}
              >
                <Sun className="h-3 w-3" />
                <span>{t.themes.light}</span>
              </button>
              <button
                type="button"
                onClick={() => onThemeChange('dark')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  theme === 'dark'
                    ? 'bg-white text-[#171717]'
                    : 'text-[var(--ufb-muted)] hover:text-[var(--ufb-text)]'
                }`}
              >
                <Moon className="h-3 w-3" />
                <span>{t.themes.dark}</span>
              </button>
              <button
                type="button"
                onClick={() => onThemeChange('brand')}
                className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  theme === 'brand'
                    ? 'bg-[#F47B20] text-white'
                    : 'text-[var(--ufb-muted)] hover:text-[var(--ufb-text)]'
                }`}
              >
                <Palette className="h-3 w-3" />
                <span>{t.themes.brand}</span>
              </button>
            </div>

            {/* Optional Customer Account */}
            <button
              type="button"
              onClick={onOpenAccount}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-card)] px-3 py-1.5 text-xs font-semibold hover:border-[#F47B20] transition-colors whitespace-nowrap"
            >
              <User className="h-3.5 w-3.5 text-[#F47B20]" />
              <span className="max-w-[140px] truncate">
                {customerEmail || t.nav.account}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Foreground Content */}
      <main className="relative z-10">
        {/* 1. HERO SECTION */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 pt-10 pb-14 lg:pt-14 lg:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
            <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
              <div className="text-sm font-semibold text-[#F47B20] tracking-tight">
                {settings?.slogan || 'Machew devan pot kay ou.'}
              </div>

              <h1
                className="font-display font-extrabold tracking-tight text-[var(--ufb-text)] leading-[1.1]"
                style={{ fontSize: 'clamp(2.25rem, 4.2vw, 3.6rem)', textWrap: 'balance' }}
              >
                {heroTitle || 'Your Grocery Market, Right at Your Door'}
              </h1>

              <p className="max-w-2xl text-base sm:text-lg text-[var(--ufb-muted)] leading-relaxed">
                {heroSubtitle ||
                  'Order quality food boxes effortlessly in USD or HTG and let UrFoodBox handle careful preparation and doorstep delivery.'}
              </p>

              <div className="flex flex-wrap items-center gap-3.5 pt-1">
                <a
                  href="#boxes"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#F47B20] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#df6912] transition-colors whitespace-nowrap"
                >
                  <span>{t.hero.exploreCta}</span>
                </a>
                <a
                  href="#custom-box"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-card)] px-6 py-3.5 text-sm font-semibold hover:border-[#238447] hover:text-[#238447] transition-colors whitespace-nowrap"
                >
                  <span>{t.hero.customCta}</span>
                </a>
              </div>

              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-2 text-xs text-[var(--ufb-muted)]">
                <span>{t.hero.guestNote}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono-num font-medium">
                  {t.hero.exchangeRateLabel}: 1 USD = {settings?.exchangeRateHtgPerUsd || '132.00'} HTG
                </span>
              </div>
            </div>

            {/* Official UrFoodBox Logo Showcase */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <div className="w-full h-full min-h-[280px] rounded-2xl border border-[var(--ufb-border)] bg-[#FAF5EE] p-8 flex items-center justify-center shadow-sm">
                <img
                  src={logoUrl}
                  alt="UrFoodBox — Machew devan pot kay ou."
                  className="max-h-[300px] w-auto object-contain"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 2. PRODUCT CATALOG */}
        <section id="boxes" className="mx-auto max-w-7xl px-4 sm:px-6 py-12 border-t border-[var(--ufb-border)]">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div className="space-y-2">
              <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                {t.catalog.heading}
              </h2>
              <p className="text-sm sm:text-base text-[var(--ufb-muted)] max-w-2xl">
                {t.catalog.subheading}
              </p>
            </div>
            <div className="text-xs font-medium text-[var(--ufb-muted)]">
              {t.catalog.priceNote}
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {[1, 2, 3].map((idx) => (
                <div
                  key={idx}
                  className="h-96 rounded-2xl border border-[var(--ufb-border)] bg-[var(--ufb-card)] animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-[var(--ufb-border)] bg-[var(--ufb-card)] p-8 text-center space-y-3">
              <p className="text-sm text-red-600 dark:text-red-400">{error || t.catalog.errorLoad}</p>
              <button
                type="button"
                onClick={onRetry}
                className="rounded-lg bg-[#F47B20] px-4 py-2 text-xs font-semibold text-white"
              >
                {t.catalog.retry}
              </button>
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-[var(--ufb-border)] bg-[var(--ufb-card)] p-10 text-center text-sm text-[var(--ufb-muted)]">
              {t.catalog.emptyCatalog}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {products.map((product) => {
                const name = getLocalizedProductName(product, lang);
                const desc = getLocalizedProductDescription(product, lang);
                const activePrice = currency === 'HTG' ? product.priceHtg : product.priceUsd;
                const secondaryCurrency = currency === 'HTG' ? 'USD' : 'HTG';
                const secondaryPrice = currency === 'HTG' ? product.priceUsd : product.priceHtg;
                const isAdded = justAddedId === product.id;

                return (
                  <article
                    key={product.id}
                    className="group flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--ufb-border)] bg-[var(--ufb-card)] transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    <div>
                      {/* Image or Clean Empty Placeholder */}
                      <button
                        type="button"
                        onClick={() => onSelectProduct(product)}
                        className="block w-full aspect-[4/3] bg-[var(--ufb-surface)] border-b border-[var(--ufb-border)] overflow-hidden text-left"
                      >
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={name}
                            referrerPolicy="no-referrer"
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                          />
                        ) : (
                          <div className="flex h-full w-full flex-col items-center justify-center p-6 text-center">
                            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-dashed border-[var(--ufb-border)] bg-[var(--ufb-card)]">
                              <Package className="h-7 w-7 text-[#F47B20]/70" />
                            </div>
                            <span className="mt-3 text-xs text-[var(--ufb-muted)]">
                              {t.catalog.noPhotoYet}
                            </span>
                          </div>
                        )}
                      </button>

                      {/* Card Content */}
                      <div className="p-6 space-y-3">
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span
                            className={`font-semibold ${
                              product.isAvailable ? 'text-[#238447]' : 'text-[var(--ufb-muted)]'
                            }`}
                          >
                            {product.isAvailable ? t.catalog.available : t.catalog.unavailable}
                          </span>
                        </div>

                        <h3 className="font-display text-lg font-bold tracking-tight">{name}</h3>

                        <p className="text-sm text-[var(--ufb-muted)] line-clamp-3 min-h-[3.75rem] leading-relaxed">
                          {desc || t.catalog.noDescriptionYet}
                        </p>

                        <div className="pt-1 flex items-baseline justify-between gap-2">
                          <div className="font-mono-num text-lg font-bold text-[#F47B20]">
                            {formatMoney(activePrice, currency)}
                          </div>
                          <div className="font-mono-num text-xs text-[var(--ufb-muted)]">
                            {formatMoney(secondaryPrice, secondaryCurrency)}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="border-t border-[var(--ufb-border)] px-6 py-4 flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => onSelectProduct(product)}
                        className="flex-1 rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3.5 py-2.5 text-xs font-semibold hover:border-[#F47B20] transition-colors whitespace-nowrap"
                      >
                        {t.catalog.viewDetails}
                      </button>
                      <button
                        type="button"
                        disabled={!product.isAvailable}
                        onClick={() => handleAdd(product.id)}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#238447] px-3.5 py-2.5 text-xs font-semibold text-white hover:bg-[#1b6b38] disabled:opacity-45 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                      >
                        {isAdded ? (
                          <>
                            <Check className="h-3.5 w-3.5" />
                            <span>{t.catalog.addedToCart}</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="h-3.5 w-3.5" />
                            <span>{t.catalog.addToCart}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* 3. HOW DELIVERY WORKS + BUILD YOUR OWN BOX */}
        <section id="delivery" className="mx-auto max-w-7xl px-4 sm:px-6 py-12 border-t border-[var(--ufb-border)]">
          <div className="space-y-2 mb-8">
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2.5">
              <Truck className="h-6 w-6 text-[#F47B20]" />
              <span>{t.delivery.heading}</span>
            </h2>
            <p className="text-sm sm:text-base text-[var(--ufb-muted)]">{t.delivery.subheading}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: t.delivery.step1Title, desc: t.delivery.step1Desc },
              { title: t.delivery.step2Title, desc: t.delivery.step2Desc },
              { title: t.delivery.step3Title, desc: t.delivery.step3Desc },
            ].map((step, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-[var(--ufb-border)] bg-[var(--ufb-card)] p-6 space-y-2.5"
              >
                <h3 className="font-display text-base font-bold">{step.title}</h3>
                <p className="text-sm text-[var(--ufb-muted)] leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 4. BUILD YOUR OWN BOX (WhatsApp) + ORDER TRACKER */}
        <section id="custom-box" className="mx-auto max-w-7xl px-4 sm:px-6 py-12 border-t border-[var(--ufb-border)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Build Your Own Box */}
            <div className="lg:col-span-7 rounded-2xl border border-[var(--ufb-border)] bg-[var(--ufb-card)] p-7 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="text-xs font-semibold text-[#F47B20]">{t.customBox.subheading}</div>
                <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
                  {t.customBox.heading}
                </h2>
                <p className="text-sm sm:text-base text-[var(--ufb-muted)] leading-relaxed max-w-xl">
                  {t.customBox.description}
                </p>

                {/* Period & Household Size selector for Custom WhatsApp Box */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-[var(--ufb-muted)]">
                        {t.cart.boxPeriodLabel}
                      </span>
                      {resolvedCustomPeriod && (
                        <span className="font-mono-num text-xs font-bold text-[#F47B20]">
                          {resolvedCustomPeriod}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {(
                        [
                          ['week', t.cart.periodPresets.weekPlural],
                          ['month', t.cart.periodPresets.monthPlural],
                        ] as const
                      ).map(([unit, label]) => (
                        <button
                          key={unit}
                          type="button"
                          onClick={() =>
                            setCustomBoxUnit((prev) => (prev === unit ? '' : unit))
                          }
                          className={`rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                            customBoxUnit === unit
                              ? 'border-[#F47B20] bg-[#F47B20] text-white'
                              : 'border-[var(--ufb-border)] bg-[var(--ufb-surface)] text-[var(--ufb-text)] hover:border-[#F47B20]'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          type="button"
                          onClick={() =>
                            setCustomBoxCount((prev) => (prev === num ? null : num))
                          }
                          className={`w-8 rounded-lg border py-1.5 font-mono-num text-xs font-semibold transition-colors ${
                            customBoxCount === num
                              ? 'border-[#F47B20] bg-[#F47B20]/15 text-[#F47B20]'
                              : 'border-[var(--ufb-border)] bg-[var(--ufb-surface)] text-[var(--ufb-text)] hover:border-[#F47B20]'
                          }`}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-xs font-medium text-[var(--ufb-muted)]">
                      {t.cart.householdSizeLabel}
                    </label>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {['1', '2', '3', '4', '5'].map((count) => (
                        <button
                          key={count}
                          type="button"
                          onClick={() =>
                            setCustomBoxPersons((prev) => (prev === count ? '' : count))
                          }
                          className={`w-8 rounded-lg border py-1.5 font-mono-num text-xs font-semibold transition-colors ${
                            customBoxPersons === count
                              ? 'border-[#238447] bg-[#238447] text-white'
                              : 'border-[var(--ufb-border)] bg-[var(--ufb-surface)] text-[var(--ufb-text)] hover:border-[#238447]'
                          }`}
                        >
                          {count}
                        </button>
                      ))}
                      <input
                        type="number"
                        min={1}
                        max={99}
                        value={customBoxPersons}
                        onChange={(e) => setCustomBoxPersons(e.target.value)}
                        placeholder="#"
                        className="w-16 rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-2 py-1.5 text-center font-mono-num text-xs font-semibold focus:border-[#F47B20] focus:outline-none"
                      />
                      <span className="text-xs text-[var(--ufb-muted)]">
                        {Number(customBoxPersons) === 1 ? t.cart.personSingular : t.cart.personsUnit}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                {whatsappHref ? (
                  <a
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 rounded-lg bg-[#238447] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#1b6b38] transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                    <span>{t.customBox.whatsappCta}</span>
                    <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                  </a>
                ) : (
                  <div className="inline-flex items-center gap-2.5 rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-4 py-3 text-xs text-[var(--ufb-muted)]">
                    <MessageCircle className="h-4 w-4 text-[#238447]" />
                    <span>{t.customBox.whatsappNotConfigured}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Order Status Lookup */}
            <div
              id="track"
              className="lg:col-span-5 rounded-2xl border border-[var(--ufb-border)] bg-[var(--ufb-card)] p-7 sm:p-8 space-y-5"
            >
              <div className="space-y-1.5">
                <h3 className="font-display text-xl font-bold">{t.tracker.heading}</h3>
                <p className="text-xs sm:text-sm text-[var(--ufb-muted)]">{t.tracker.subheading}</p>
              </div>

              <form onSubmit={handleTrackOrder} className="flex gap-2">
                <input
                  type="text"
                  value={trackInput}
                  onChange={(e) => setTrackInput(e.target.value)}
                  placeholder={t.tracker.placeholder}
                  className="min-w-0 flex-1 rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3.5 py-2.5 font-mono-num text-xs sm:text-sm focus:border-[#F47B20] focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={tracking}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#F47B20] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#df6912] disabled:opacity-60 transition-colors whitespace-nowrap"
                >
                  <Search className="h-3.5 w-3.5" />
                  <span>{tracking ? t.tracker.searching : t.tracker.button}</span>
                </button>
              </form>

              {trackError && (
                <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-600 dark:text-red-400">
                  {trackError}
                </div>
              )}

              {trackedOrder && (
                <div className="rounded-xl border border-[var(--ufb-border)] bg-[var(--ufb-surface)] p-4 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--ufb-muted)]">{t.tracker.reference}</span>
                    <span className="font-mono-num font-bold text-[#F47B20]">
                      {trackedOrder.orderReference}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--ufb-muted)]">{t.tracker.status}</span>
                    <span className="font-semibold text-[#238447]">
                      {t.orderStatuses[trackedOrder.status] || trackedOrder.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--ufb-muted)]">{t.tracker.total}</span>
                    <span className="font-mono-num font-bold">
                      {formatMoney(trackedOrder.totalAmount, trackedOrder.currency)}
                    </span>
                  </div>
                  {trackedOrder.boxPeriod && (
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--ufb-muted)]">{t.cart.boxPeriodLabel}</span>
                      <span className="font-medium">{trackedOrder.boxPeriod}</span>
                    </div>
                  )}
                  {trackedOrder.householdSize ? (
                    <div className="flex items-center justify-between">
                      <span className="text-[var(--ufb-muted)]">{t.cart.householdSizeLabel}</span>
                      <span className="font-medium">
                        {trackedOrder.householdSize}{' '}
                        {trackedOrder.householdSize === 1 ? t.cart.personSingular : t.cart.personsUnit}
                      </span>
                    </div>
                  ) : null}
                  <div className="border-t border-[var(--ufb-border)] pt-2 text-[var(--ufb-muted)]">
                    {trackedOrder.items.map((i) => `${i.productName} × ${i.quantity}`).join(' · ')}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 5. CLIENT COMMENTS SECTION */}
        <section id="comments" className="mx-auto max-w-7xl px-4 sm:px-6 py-12 border-t border-[var(--ufb-border)]">
          <div className="space-y-2 mb-8">
            <h2 className="font-display text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-2.5">
              <MessageSquare className="h-6 w-6 text-[#F47B20]" />
              <span>{t.comments.heading}</span>
            </h2>
            <p className="text-sm sm:text-base text-[var(--ufb-muted)] max-w-2xl">
              {t.comments.subheading}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Leave a Comment Form */}
            <form
              onSubmit={handleSubmitComment}
              className="lg:col-span-5 rounded-2xl border border-[var(--ufb-border)] bg-[var(--ufb-card)] p-6 sm:p-7 space-y-4"
            >
              <div>
                <label className="block text-xs font-medium text-[var(--ufb-muted)] mb-1.5">
                  {t.comments.nameLabel} *
                </label>
                <input
                  type="text"
                  required
                  maxLength={80}
                  value={commentAuthor}
                  onChange={(e) => setCommentAuthor(e.target.value)}
                  placeholder={t.comments.namePlaceholder}
                  className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3.5 py-2.5 text-sm focus:border-[#F47B20] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--ufb-muted)] mb-1.5">
                  {t.comments.ratingLabel}
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setCommentRating(star)}
                      aria-label={`${star} / 5`}
                      className="rounded-md p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`h-5 w-5 ${
                          star <= commentRating
                            ? 'fill-[#F47B20] text-[#F47B20]'
                            : 'text-[var(--ufb-border)]'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-[var(--ufb-muted)] mb-1.5">
                  {t.comments.commentLabel} *
                </label>
                <textarea
                  required
                  rows={4}
                  maxLength={600}
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={t.comments.commentPlaceholder}
                  className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3.5 py-2.5 text-sm focus:border-[#F47B20] focus:outline-none"
                />
              </div>

              {commentFeedback && (
                <div
                  className={`rounded-lg border px-3.5 py-2.5 text-xs font-medium ${
                    commentFeedback.type === 'ok'
                      ? 'border-[#238447]/30 bg-[#238447]/10 text-[#238447]'
                      : 'border-red-500/30 bg-red-500/10 text-red-600 dark:text-red-400'
                  }`}
                >
                  {commentFeedback.text}
                </div>
              )}

              <button
                type="submit"
                disabled={commentSubmitting}
                className="w-full rounded-lg bg-[#F47B20] px-5 py-3 text-sm font-semibold text-white hover:bg-[#df6912] disabled:opacity-60 transition-colors"
              >
                {commentSubmitting ? t.comments.submitting : t.comments.submitBtn}
              </button>
            </form>

            {/* Published Comments Feed */}
            <div className="lg:col-span-7 space-y-4">
              {comments.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[var(--ufb-border)] bg-[var(--ufb-card)] p-10 text-center text-sm text-[var(--ufb-muted)]">
                  {t.comments.emptyState}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {comments.map((c) => (
                    <article
                      key={c.id}
                      className="rounded-2xl border border-[var(--ufb-border)] bg-[var(--ufb-card)] p-5 space-y-3 flex flex-col justify-between"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-display text-sm font-bold truncate">
                            {c.authorName}
                          </span>
                          <div className="flex items-center gap-0.5 shrink-0" aria-label={`${c.rating} out of 5`}>
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-3.5 w-3.5 ${
                                  star <= c.rating
                                    ? 'fill-[#F47B20] text-[#F47B20]'
                                    : 'text-[var(--ufb-border)]'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-[var(--ufb-muted)] leading-relaxed whitespace-pre-line">
                          {c.commentText}
                        </p>
                      </div>
                      <div className="text-[11px] text-[var(--ufb-muted)] pt-1 border-t border-[var(--ufb-border)]">
                        {new Date(c.createdAt).toLocaleDateString()}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-[var(--ufb-border)] bg-[var(--ufb-surface)]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-2.5">
              <div className="font-display text-lg font-extrabold">
                <span>Ur</span>
                <span className="text-[#F47B20]">Food</span>
                <span>Box</span>
              </div>
              <p className="text-sm font-medium text-[#F47B20]">
                {settings?.slogan || t.footer.tagline}
              </p>
              {settings?.contactAddress && (
                <p className="text-xs text-[var(--ufb-muted)]">{settings.contactAddress}</p>
              )}
            </div>

            <div className="space-y-2">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[var(--ufb-muted)]">
                {t.footer.contactTitle}
              </h4>
              <div className="space-y-1.5 text-sm">
                {settings?.contactEmail && (
                  <div>
                    <a
                      href={`mailto:${settings.contactEmail}`}
                      className="hover:text-[#F47B20] transition-colors"
                    >
                      {settings.contactEmail}
                    </a>
                  </div>
                )}
                {whatsappHref && (
                  <div>
                    <a
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#238447] font-semibold hover:underline"
                    >
                      <MessageCircle className="h-3.5 w-3.5" />
                      <span>
                        {t.footer.whatsappLabel}: {settings?.whatsappNumber}
                      </span>
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[var(--ufb-muted)]">
                {t.footer.socialTitle}
              </h4>
              <div className="flex flex-col space-y-1.5 text-sm">
                {settings?.tiktokUrl ? (
                  <a
                    href={settings.tiktokUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-[#F47B20] transition-colors"
                  >
                    <span>TikTok</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-xs text-[var(--ufb-muted)]">TikTok</span>
                )}
                {settings?.facebookUrl ? (
                  <a
                    href={settings.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-[#F47B20] transition-colors"
                  >
                    <span>Facebook</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                ) : (
                  <span className="text-xs text-[var(--ufb-muted)]">Facebook</span>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <h4 className="font-display text-xs font-bold uppercase tracking-wider text-[var(--ufb-muted)]">
                {t.footer.linksTitle}
              </h4>
              <div className="flex flex-col items-start space-y-1.5 text-sm">
                <a href="#boxes" className="hover:text-[#F47B20] transition-colors">
                  {t.nav.boxes}
                </a>
                <a href="#custom-box" className="hover:text-[#F47B20] transition-colors">
                  {t.nav.customBox}
                </a>
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="text-left text-xs font-semibold text-[var(--ufb-muted)] hover:text-[#F47B20] transition-colors pt-1"
                >
                  {t.footer.adminLink}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-[var(--ufb-border)] pt-5 flex flex-wrap items-center justify-between gap-3 text-xs text-[var(--ufb-muted)]">
            <span>
              © {new Date().getFullYear()} {settings?.businessName || 'UrFoodBox'}. {t.footer.rights}
            </span>
            <span>{settings?.slogan || 'Machew devan pot kay ou.'}</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
