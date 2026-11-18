'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { formatMoney, getLocalizedProductName, type TranslationBundle } from '../i18n/translations.ts';
import { safeFetchJson } from '../lib/fetch-json.ts';
import type {
  CartItem,
  Currency,
  CustomerProfile,
  Language,
  PaymentMethod,
  Product,
} from '../types.ts';

interface OrderConfirmation {
  orderReference: string;
  status: string;
  currency: Currency;
  paymentMethod: PaymentMethod;
  boxPeriod: string;
  householdSize: number;
  totalAmount: string;
  createdAt: string;
  items: { productName: string; quantity: number; lineTotal: string }[];
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  products: Product[];
  lang: Language;
  currency: Currency;
  onCurrencyChange: (c: Currency) => void;
  onUpdateQty: (productId: number, delta: number) => void;
  onRemoveItem: (productId: number) => void;
  onClearCart: () => void;
  t: TranslationBundle;
  customerProfile: CustomerProfile | null;
  getAuthToken: () => Promise<string | null>;
}

const PAYMENT_OPTIONS: PaymentMethod[] = [
  'cash_on_delivery',
  'moncash',
  'natcash',
  'wire',
];

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  products,
  lang,
  currency,
  onCurrencyChange,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  t,
  customerProfile,
  getAuthToken,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orderInstructions, setOrderInstructions] = useState('');
  const [periodUnit, setPeriodUnit] = useState<'week' | 'month' | ''>('');
  const [periodCount, setPeriodCount] = useState<number | null>(null);
  const [householdSize, setHouseholdSize] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash_on_delivery');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<OrderConfirmation | null>(null);

  useEffect(() => {
    if (customerProfile) {
      if (!customerName && customerProfile.fullName) setCustomerName(customerProfile.fullName);
      if (!customerPhone && customerProfile.phone) setCustomerPhone(customerProfile.phone);
      if (!deliveryAddress && customerProfile.defaultDeliveryAddress) {
        setDeliveryAddress(customerProfile.defaultDeliveryAddress);
      }
    }
  }, [customerProfile]);

  if (!isOpen) return null;

  const productMap = new Map(products.map((p) => [p.id, p]));
  const cartRows = cart
    .map((item) => {
      const product = productMap.get(item.productId);
      if (!product) return null;
      const unitPrice = currency === 'HTG' ? Number(product.priceHtg) : Number(product.priceUsd);
      return {
        product,
        quantity: item.quantity,
        unitPrice,
        lineTotal: unitPrice * item.quantity,
      };
    })
    .filter((row): row is NonNullable<typeof row> => row !== null);

  const subtotal = cartRows.reduce((sum, row) => sum + row.lineTotal, 0);

  const resolvedBoxPeriod =
    periodUnit && periodCount
      ? `${periodCount} ${
          periodUnit === 'week'
            ? periodCount === 1
              ? t.cart.periodPresets.weekSingular
              : t.cart.periodPresets.weekPlural
            : periodCount === 1
              ? t.cart.periodPresets.monthSingular
              : t.cart.periodPresets.monthPlural
        }`
      : '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (cartRows.length === 0) return;

    const parsedPersons = Number(householdSize);
    if (
      resolvedBoxPeriod.length < 2 ||
      !Number.isInteger(parsedPersons) ||
      parsedPersons < 1 ||
      parsedPersons > 99
    ) {
      setErrorMsg(t.cart.periodAndPersonsError);
      return;
    }

    if (
      customerName.trim().length < 2 ||
      customerPhone.trim().length < 5 ||
      deliveryAddress.trim().length < 4
    ) {
      setErrorMsg(t.cart.validationError);
      return;
    }

    setSubmitting(true);
    try {
      const token = await getAuthToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const { res, data } = await safeFetchJson<any>('/api/orders', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim(),
          deliveryAddress: deliveryAddress.trim(),
          orderInstructions: orderInstructions.trim(),
          boxPeriod: resolvedBoxPeriod,
          householdSize: parsedPersons,
          currency,
          paymentMethod,
          items: cartRows.map((row) => ({
            productId: row.product.id,
            quantity: row.quantity,
          })),
        }),
      });

      if (!res.ok) {
        throw new Error(data.error || 'Order submission failed');
      }

      setConfirmation(data);
      onClearCart();
      setOrderInstructions('');
      setPeriodUnit('');
      setPeriodCount(null);
      setHouseholdSize('');
    } catch (err: any) {
      setErrorMsg(err.message || 'Could not submit your order.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseDrawer = () => {
    if (confirmation) {
      setConfirmation(null);
    }
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={t.cart.title}>
      <div
        className="fixed inset-0 bg-black/55 backdrop-blur-[2px] transition-opacity"
        onClick={handleCloseDrawer}
      />

      <div className="relative z-10 flex h-full w-full max-w-lg flex-col bg-[var(--ufb-card)] text-[var(--ufb-text)] shadow-2xl border-l border-[var(--ufb-border)]">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 border-b border-[var(--ufb-border)] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5 text-[#F47B20]" aria-hidden="true" />
            <h2 className="font-display text-lg font-bold tracking-tight">{t.cart.title}</h2>
          </div>
          <button
            type="button"
            onClick={handleCloseDrawer}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--ufb-border)] hover:bg-[var(--ufb-surface)] transition-colors"
            aria-label={t.productModal.close}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">
          {confirmation ? (
            <div className="space-y-5 py-4">
              <div className="rounded-xl border border-[#238447]/30 bg-[#238447]/8 p-5">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-6 w-6 shrink-0 text-[#238447] mt-0.5" />
                  <div className="space-y-1.5">
                    <h3 className="font-display text-lg font-bold text-[#238447]">
                      {t.cart.confirmationTitle}
                    </h3>
                    <p className="text-sm text-[var(--ufb-muted)] leading-relaxed">
                      {t.cart.confirmationSubtitle}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-xl border border-[var(--ufb-border)] bg-[var(--ufb-surface)] p-5 space-y-4">
                <div>
                  <div className="text-xs font-medium text-[var(--ufb-muted)]">{t.cart.orderRefLabel}</div>
                  <div className="mt-1 font-mono-num text-xl font-bold tracking-tight text-[#F47B20]">
                    {confirmation.orderReference}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-[var(--ufb-border)] pt-4 text-sm">
                  <div>
                    <div className="text-xs text-[var(--ufb-muted)]">{t.cart.paymentSelected}</div>
                    <div className="mt-0.5 font-medium">
                      {t.paymentMethods[confirmation.paymentMethod]}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs text-[var(--ufb-muted)]">{t.cart.total}</div>
                    <div className="mt-0.5 font-mono-num font-bold">
                      {formatMoney(confirmation.totalAmount, confirmation.currency)}
                    </div>
                  </div>
                  {confirmation.boxPeriod && (
                    <div>
                      <div className="text-xs text-[var(--ufb-muted)]">{t.cart.boxPeriodLabel}</div>
                      <div className="mt-0.5 font-medium">{confirmation.boxPeriod}</div>
                    </div>
                  )}
                  {confirmation.householdSize > 0 && (
                    <div>
                      <div className="text-xs text-[var(--ufb-muted)]">{t.cart.householdSizeLabel}</div>
                      <div className="mt-0.5 font-medium">
                        {confirmation.householdSize}{' '}
                        {confirmation.householdSize === 1 ? t.cart.personSingular : t.cart.personsUnit}
                      </div>
                    </div>
                  )}
                </div>

                <div className="border-t border-[var(--ufb-border)] pt-4 space-y-2">
                  <div className="text-xs font-medium text-[var(--ufb-muted)]">{t.tracker.items}</div>
                  {confirmation.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <span>
                        {item.productName} × {item.quantity}
                      </span>
                      <span className="font-mono-num font-medium">
                        {formatMoney(item.lineTotal, confirmation.currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleCloseDrawer}
                className="w-full rounded-lg bg-[#238447] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1b6b38] transition-colors"
              >
                {t.cart.continueShopping}
              </button>
            </div>
          ) : cartRows.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--ufb-surface)] border border-[var(--ufb-border)]">
                <ShoppingBag className="h-6 w-6 text-[var(--ufb-muted)]" />
              </div>
              <h3 className="font-display text-base font-semibold">{t.cart.emptyTitle}</h3>
              <p className="mt-1.5 max-w-xs text-sm text-[var(--ufb-muted)]">{t.cart.emptyDesc}</p>
              <button
                type="button"
                onClick={handleCloseDrawer}
                className="mt-6 rounded-lg bg-[#F47B20] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#df6912] transition-colors"
              >
                {t.cart.browseBoxes}
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Currency Selector */}
              <div className="flex items-center justify-between rounded-xl border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-4 py-3">
                <span className="text-xs font-medium text-[var(--ufb-muted)]">
                  {t.cart.currencyLabel}
                </span>
                <div className="inline-flex rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-card)] p-0.5">
                  {(['USD', 'HTG'] as const).map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => onCurrencyChange(c)}
                      className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                        currency === c
                          ? 'bg-[#F47B20] text-white'
                          : 'text-[var(--ufb-muted)] hover:text-[var(--ufb-text)]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cart Items */}
              <div className="divide-y divide-[var(--ufb-border)] border-y border-[var(--ufb-border)]">
                {cartRows.map(({ product, quantity, unitPrice, lineTotal }) => (
                  <div key={product.id} className="flex items-center justify-between gap-4 py-4">
                    <div className="min-w-0 flex-1">
                      <div className="font-display text-sm font-semibold truncate">
                        {getLocalizedProductName(product, lang)}
                      </div>
                      <div className="mt-0.5 font-mono-num text-xs text-[var(--ufb-muted)]">
                        {formatMoney(unitPrice, currency)} × {quantity}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="inline-flex items-center rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)]">
                        <button
                          type="button"
                          onClick={() => onUpdateQty(product.id, -1)}
                          className="inline-flex h-9 w-9 items-center justify-center hover:text-[#F47B20] transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-7 text-center font-mono-num text-xs font-semibold">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => onUpdateQty(product.id, 1)}
                          className="inline-flex h-9 w-9 items-center justify-center hover:text-[#238447] transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="w-24 text-right font-mono-num text-sm font-semibold">
                        {formatMoney(lineTotal, currency)}
                      </div>

                      <button
                        type="button"
                        onClick={() => onRemoveItem(product.id)}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-[var(--ufb-muted)] hover:text-red-600 transition-colors"
                        aria-label={t.cart.remove}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 rounded-xl bg-[var(--ufb-surface)] border border-[var(--ufb-border)] p-4">
                <div className="flex items-center justify-between text-sm text-[var(--ufb-muted)]">
                  <span>{t.cart.subtotal}</span>
                  <span className="font-mono-num">{formatMoney(subtotal, currency)}</span>
                </div>
                <div className="flex items-center justify-between border-t border-[var(--ufb-border)] pt-2 text-base font-bold">
                  <span>{t.cart.total}</span>
                  <span className="font-mono-num text-[#F47B20]">{formatMoney(subtotal, currency)}</span>
                </div>
              </div>

              {/* Guest Checkout Form */}
              <form id="urfoodbox-checkout-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="font-display text-base font-bold">{t.cart.checkoutTitle}</h3>
                  <span className="text-xs text-[#238447] font-medium">{t.cart.guestBadge}</span>
                </div>

                {customerProfile && customerProfile.savedAddresses.length > 0 && (
                  <div className="space-y-1.5">
                    <div className="text-xs text-[var(--ufb-muted)]">{t.cart.savedAddressUse}</div>
                    <div className="flex flex-wrap gap-2">
                      {customerProfile.savedAddresses.map((addr) => (
                        <button
                          key={addr.id}
                          type="button"
                          onClick={() => {
                            setDeliveryAddress(addr.address);
                            if (addr.phone) setCustomerPhone(addr.phone);
                          }}
                          className="rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3 py-1.5 text-xs font-medium hover:border-[#F47B20] transition-colors"
                        >
                          {addr.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-[var(--ufb-muted)] mb-1.5">
                    {t.cart.fullName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={t.cart.fullNamePlaceholder}
                    className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-card)] px-3.5 py-2.5 text-sm focus:border-[#F47B20] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--ufb-muted)] mb-1.5">
                    {t.cart.phone} *
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder={t.cart.phonePlaceholder}
                    className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-card)] px-3.5 py-2.5 text-sm focus:border-[#F47B20] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--ufb-muted)] mb-1.5">
                    {t.cart.address} *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder={t.cart.addressPlaceholder}
                    className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-card)] px-3.5 py-2.5 text-sm focus:border-[#F47B20] focus:outline-none"
                  />
                </div>

                {/* Food Box Duration & Household Size */}
                <div className="rounded-xl border border-[var(--ufb-border)] bg-[var(--ufb-surface)] p-4 space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <label className="block text-xs font-semibold text-[var(--ufb-text)]">
                        {t.cart.boxPeriodLabel} *
                      </label>
                      {resolvedBoxPeriod && (
                        <span className="font-mono-num text-xs font-bold text-[#F47B20]">
                          {resolvedBoxPeriod}
                        </span>
                      )}
                    </div>

                    {/* Step 1: Choose Week or Month */}
                    <div className="grid grid-cols-2 gap-2">
                      {(
                        [
                          ['week', t.cart.periodPresets.weekPlural],
                          ['month', t.cart.periodPresets.monthPlural],
                        ] as const
                      ).map(([unit, label]) => {
                        const active = periodUnit === unit;
                        return (
                          <button
                            key={unit}
                            type="button"
                            onClick={() => setPeriodUnit(unit)}
                            className={`rounded-lg border px-3 py-2 text-xs font-semibold transition-colors ${
                              active
                                ? 'border-[#F47B20] bg-[#F47B20] text-white'
                                : 'border-[var(--ufb-border)] bg-[var(--ufb-card)] text-[var(--ufb-text)] hover:border-[#F47B20]'
                            }`}
                          >
                            {label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Step 2: Choose Number 1 to 5 */}
                    <div className="grid grid-cols-5 gap-2">
                      {[1, 2, 3, 4, 5].map((num) => {
                        const active = periodCount === num;
                        return (
                          <button
                            key={num}
                            type="button"
                            onClick={() => setPeriodCount(num)}
                            className={`rounded-lg border py-2 font-mono-num text-xs font-semibold transition-colors ${
                              active
                                ? 'border-[#F47B20] bg-[#F47B20]/15 text-[#F47B20] ring-1 ring-[#F47B20]'
                                : 'border-[var(--ufb-border)] bg-[var(--ufb-card)] text-[var(--ufb-text)] hover:border-[#F47B20]'
                            }`}
                          >
                            {num}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[var(--ufb-text)] mb-2">
                      {t.cart.householdSizeLabel} *
                    </label>
                    <div className="flex flex-wrap items-center gap-2">
                      {['1', '2', '3', '4', '5'].map((count) => {
                        const active = householdSize === count;
                        return (
                          <button
                            key={count}
                            type="button"
                            onClick={() => setHouseholdSize(count)}
                            className={`min-w-[2.5rem] rounded-lg border px-3 py-2 font-mono-num text-xs font-semibold transition-colors ${
                              active
                                ? 'border-[#238447] bg-[#238447] text-white'
                                : 'border-[var(--ufb-border)] bg-[var(--ufb-card)] text-[var(--ufb-text)] hover:border-[#238447]'
                            }`}
                          >
                            {count}
                          </button>
                        );
                      })}
                      <div className="flex items-center gap-1.5 ml-auto">
                        <input
                          type="number"
                          min={1}
                          max={99}
                          required
                          value={householdSize}
                          onChange={(e) => setHouseholdSize(e.target.value)}
                          placeholder="#"
                          aria-label={t.cart.householdSizeLabel}
                          className="w-16 rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-card)] px-2.5 py-2 text-center font-mono-num text-xs font-semibold focus:border-[#F47B20] focus:outline-none"
                        />
                        <span className="text-xs text-[var(--ufb-muted)]">
                          {Number(householdSize) === 1 ? t.cart.personSingular : t.cart.personsUnit}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--ufb-muted)] mb-1.5">
                    {t.cart.instructions}
                  </label>
                  <input
                    type="text"
                    value={orderInstructions}
                    onChange={(e) => setOrderInstructions(e.target.value)}
                    placeholder={t.cart.instructionsPlaceholder}
                    className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-card)] px-3.5 py-2.5 text-sm focus:border-[#F47B20] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[var(--ufb-muted)] mb-2">
                    {t.cart.paymentMethod} *
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    {PAYMENT_OPTIONS.map((method) => {
                      const active = paymentMethod === method;
                      return (
                        <button
                          key={method}
                          type="button"
                          onClick={() => setPaymentMethod(method)}
                          className={`rounded-lg border px-3 py-2.5 text-left text-xs font-semibold transition-colors ${
                            active
                              ? 'border-[#238447] bg-[#238447]/10 text-[#238447]'
                              : 'border-[var(--ufb-border)] bg-[var(--ufb-card)] text-[var(--ufb-text)] hover:border-[#F47B20]'
                          }`}
                        >
                          {t.paymentMethods[method]}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {errorMsg && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-xs font-medium text-red-600 dark:text-red-400">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-lg bg-[#238447] px-5 py-3.5 text-sm font-semibold text-white hover:bg-[#1b6b38] disabled:opacity-60 transition-colors"
                >
                  {submitting ? t.cart.submitting : t.cart.submitOrder}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
