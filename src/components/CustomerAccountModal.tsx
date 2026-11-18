'use client';

import React, { useState } from 'react';
import { CalendarClock, LogOut, MapPin, PackageCheck, User, X } from 'lucide-react';
import {
  formatMoney,
  getLocalizedProductName,
  type TranslationBundle,
} from '../i18n/translations.ts';
import { safeFetchJson } from '../lib/fetch-json.ts';
import type {
  CustomerProfile,
  Language,
  OrderRecord,
  Product,
  SavedAddress,
  SubscriptionRecord,
} from '../types.ts';

interface CustomerAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: Language;
  t: TranslationBundle;
  firebaseEmail: string | null;
  profile: CustomerProfile | null;
  orders: OrderRecord[];
  subscriptions: SubscriptionRecord[];
  products: Product[];
  subscriptionsEnabled: boolean;
  signingIn: boolean;
  onSignInGoogle: () => Promise<void>;
  onSignOut: () => Promise<void>;
  getAuthToken: () => Promise<string | null>;
  onRefreshAccount: () => Promise<void>;
}

export const CustomerAccountModal: React.FC<CustomerAccountModalProps> = ({
  isOpen,
  onClose,
  lang,
  t,
  firebaseEmail,
  profile,
  orders,
  subscriptions,
  products,
  subscriptionsEnabled,
  signingIn,
  onSignInGoogle,
  onSignOut,
  getAuthToken,
  onRefreshAccount,
}) => {
  const [tab, setTab] = useState<'profile' | 'orders' | 'subscriptions'>('profile');
  const [fullName, setFullName] = useState(profile?.fullName || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [defaultDeliveryAddress, setDefaultDeliveryAddress] = useState(
    profile?.defaultDeliveryAddress || ''
  );
  const [newAddrLabel, setNewAddrLabel] = useState('');
  const [newAddrText, setNewAddrText] = useState('');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  // Subscription preference form
  const [subFrequency, setSubFrequency] = useState<'weekly' | 'monthly'>('monthly');
  const [subDay, setSubDay] = useState('Saturday');
  const [subProductId, setSubProductId] = useState<string>(products[0] ? String(products[0].id) : '');
  const [subNotes, setSubNotes] = useState('');

  React.useEffect(() => {
    if (profile) {
      setFullName(profile.fullName || '');
      setPhone(profile.phone || '');
      setDefaultDeliveryAddress(profile.defaultDeliveryAddress || '');
    }
  }, [profile]);

  if (!isOpen) return null;

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const token = await getAuthToken();
      if (!token) return;
      const { res, data } = await safeFetchJson('/api/customer/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName,
          phone,
          defaultDeliveryAddress,
        }),
      });
      if (!res.ok) throw new Error(data.error || 'Failed to save profile');
      await onRefreshAccount();
      setFeedback(t.account.savedSuccess);
    } catch (err: any) {
      setFeedback(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSavedAddress = async () => {
    if (!newAddrLabel.trim() || !newAddrText.trim() || !profile) return;
    setSaving(true);
    setFeedback(null);
    try {
      const token = await getAuthToken();
      if (!token) return;
      const updatedAddresses: SavedAddress[] = [
        ...(profile.savedAddresses || []),
        {
          id: `${Date.now()}`,
          label: newAddrLabel.trim(),
          address: newAddrText.trim(),
          phone: phone.trim(),
          isDefault: (profile.savedAddresses || []).length === 0,
        },
      ];
      const { res, data } = await safeFetchJson('/api/customer/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          savedAddresses: updatedAddresses,
          defaultDeliveryAddress: defaultDeliveryAddress || newAddrText.trim(),
        }),
      });
      if (!res.ok) throw new Error(data.error || 'Could not save address');
      setNewAddrLabel('');
      setNewAddrText('');
      await onRefreshAccount();
    } finally {
      setSaving(false);
    }
  };

  const handleRemoveSavedAddress = async (addrId: string) => {
    if (!profile) return;
    const token = await getAuthToken();
    if (!token) return;
    const updatedAddresses = (profile.savedAddresses || []).filter((a) => a.id !== addrId);
    await safeFetchJson('/api/customer/me', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ savedAddresses: updatedAddresses }),
    });
    await onRefreshAccount();
  };

  const handleSaveSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setFeedback(null);
    try {
      const token = await getAuthToken();
      if (!token) return;
      const { res, data } = await safeFetchJson('/api/customer/subscriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: subProductId ? Number(subProductId) : null,
          frequency: subFrequency,
          preferredDeliveryDay: subDay,
          deliveryAddress: defaultDeliveryAddress,
          notes: subNotes,
        }),
      });
      if (!res.ok) throw new Error(data.error || 'Could not save preference');
      setSubNotes('');
      await onRefreshAccount();
      setFeedback(t.account.subSaved);
    } catch (err: any) {
      setFeedback(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-[var(--ufb-border)] bg-[var(--ufb-card)] text-[var(--ufb-text)] shadow-2xl">
        <div className="flex items-center justify-between border-b border-[var(--ufb-border)] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <User className="h-5 w-5 text-[#F47B20]" />
            <h2 className="font-display text-lg font-bold">{t.account.title}</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--ufb-border)] hover:bg-[var(--ufb-surface)]"
            aria-label={t.productModal.close}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {!firebaseEmail ? (
            <div className="space-y-5 py-6 text-center max-w-md mx-auto">
              <p className="text-sm text-[var(--ufb-muted)] leading-relaxed">{t.account.subtitle}</p>
              <div className="rounded-xl border border-[var(--ufb-border)] bg-[var(--ufb-surface)] p-4 text-xs text-[var(--ufb-muted)]">
                {t.account.guestReminder}
              </div>
              <button
                type="button"
                disabled={signingIn}
                onClick={onSignInGoogle}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#238447] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1b6b38] disabled:opacity-60 transition-colors"
              >
                <span>{signingIn ? t.account.signingIn : t.account.signInGoogle}</span>
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-4 py-3">
                <div className="text-sm">
                  <span className="font-medium">{firebaseEmail}</span>
                </div>
                <button
                  type="button"
                  onClick={onSignOut}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--ufb-muted)] hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>{t.account.signOut}</span>
                </button>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-1 rounded-lg bg-[var(--ufb-surface)] p-1 border border-[var(--ufb-border)]">
                {(
                  [
                    ['profile', t.account.tabProfile],
                    ['orders', t.account.tabOrders],
                    ['subscriptions', t.account.tabSubscriptions],
                  ] as const
                ).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => {
                      setTab(key);
                      setFeedback(null);
                    }}
                    className={`flex-1 rounded-md px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                      tab === key
                        ? 'bg-[var(--ufb-card)] text-[#F47B20] shadow-sm'
                        : 'text-[var(--ufb-muted)] hover:text-[var(--ufb-text)]'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {feedback && (
                <div className="rounded-lg border border-[#238447]/30 bg-[#238447]/10 px-4 py-2.5 text-xs font-medium text-[#238447]">
                  {feedback}
                </div>
              )}

              {tab === 'profile' && (
                <div className="space-y-6">
                  <form onSubmit={handleSaveProfile} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[var(--ufb-muted)] mb-1">
                          {t.account.fullName}
                        </label>
                        <input
                          type="text"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-card)] px-3.5 py-2.5 text-sm focus:border-[#F47B20] focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[var(--ufb-muted)] mb-1">
                          {t.account.phone}
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-card)] px-3.5 py-2.5 text-sm focus:border-[#F47B20] focus:outline-none"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[var(--ufb-muted)] mb-1">
                        {t.account.defaultAddress}
                      </label>
                      <input
                        type="text"
                        value={defaultDeliveryAddress}
                        onChange={(e) => setDefaultDeliveryAddress(e.target.value)}
                        className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-card)] px-3.5 py-2.5 text-sm focus:border-[#F47B20] focus:outline-none"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-lg bg-[#238447] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1b6b38] disabled:opacity-60 transition-colors"
                    >
                      {saving ? t.account.saving : t.account.saveProfile}
                    </button>
                  </form>

                  <div className="border-t border-[var(--ufb-border)] pt-5 space-y-3">
                    <h4 className="font-display text-sm font-bold flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-[#F47B20]" />
                      <span>{t.account.savedAddressesTitle}</span>
                    </h4>
                    {profile?.savedAddresses?.map((addr) => (
                      <div
                        key={addr.id}
                        className="flex items-center justify-between rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3.5 py-2.5 text-sm"
                      >
                        <div>
                          <span className="font-semibold">{addr.label}:</span>{' '}
                          <span className="text-[var(--ufb-muted)]">{addr.address}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveSavedAddress(addr.id)}
                          className="text-xs font-medium text-red-600 hover:underline"
                        >
                          {t.cart.remove}
                        </button>
                      </div>
                    ))}

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
                      <input
                        type="text"
                        value={newAddrLabel}
                        onChange={(e) => setNewAddrLabel(e.target.value)}
                        placeholder={t.account.addressLabelPlaceholder}
                        className="rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-card)] px-3 py-2 text-xs focus:border-[#F47B20] focus:outline-none"
                      />
                      <input
                        type="text"
                        value={newAddrText}
                        onChange={(e) => setNewAddrText(e.target.value)}
                        placeholder={t.account.addressTextPlaceholder}
                        className="sm:col-span-2 rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-card)] px-3 py-2 text-xs focus:border-[#F47B20] focus:outline-none"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddSavedAddress}
                      disabled={saving || !newAddrLabel.trim() || !newAddrText.trim()}
                      className="rounded-lg border border-[var(--ufb-border)] px-4 py-2 text-xs font-semibold hover:border-[#F47B20] disabled:opacity-50 transition-colors"
                    >
                      {t.account.addAddressBtn}
                    </button>
                  </div>
                </div>
              )}

              {tab === 'orders' && (
                <div className="space-y-3">
                  {orders.length === 0 ? (
                    <p className="py-8 text-center text-sm text-[var(--ufb-muted)]">
                      {t.account.noOrders}
                    </p>
                  ) : (
                    orders.map((order) => (
                      <div
                        key={order.id}
                        className="rounded-xl border border-[var(--ufb-border)] bg-[var(--ufb-surface)] p-4 space-y-2"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-mono-num text-sm font-bold text-[#F47B20]">
                            {order.orderReference}
                          </span>
                          <span className="text-xs font-semibold text-[#238447]">
                            {t.orderStatuses[order.status] || order.status}
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--ufb-muted)]">
                          <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                          <span className="font-mono-num font-bold text-[var(--ufb-text)]">
                            {formatMoney(order.totalAmount, order.currency)}
                          </span>
                        </div>
                        {(order.boxPeriod || order.householdSize > 0) && (
                          <div className="text-xs text-[var(--ufb-text)] font-medium">
                            {order.boxPeriod ? `${order.boxPeriod}` : ''}
                            {order.boxPeriod && order.householdSize > 0 ? ' · ' : ''}
                            {order.householdSize > 0
                              ? `${order.householdSize} ${
                                  order.householdSize === 1 ? t.cart.personSingular : t.cart.personsUnit
                                }`
                              : ''}
                          </div>
                        )}
                        <div className="text-xs text-[var(--ufb-muted)]">
                          {order.items.map((i) => `${i.productName} × ${i.quantity}`).join(' · ')}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {tab === 'subscriptions' && (
                <div className="space-y-5">
                  <div className="rounded-xl border border-[#F47B20]/30 bg-[#F47B20]/8 p-4 flex items-start gap-3">
                    <CalendarClock className="h-5 w-5 shrink-0 text-[#F47B20] mt-0.5" />
                    <div className="space-y-1">
                      <div className="font-display text-sm font-bold">{t.account.subTitle}</div>
                      <p className="text-xs text-[var(--ufb-muted)] leading-relaxed">
                        {t.account.subNotice}
                      </p>
                    </div>
                  </div>

                  {subscriptions.length > 0 && (
                    <div className="space-y-2">
                      {subscriptions.map((sub) => {
                        const box = products.find((p) => p.id === sub.productId);
                        return (
                          <div
                            key={sub.id}
                            className="flex items-center justify-between rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-4 py-3 text-xs"
                          >
                            <div className="flex items-center gap-2">
                              <PackageCheck className="h-4 w-4 text-[#238447]" />
                              <span>
                                <strong>{sub.frequency === 'weekly' ? t.account.weekly : t.account.monthly}</strong>
                                {' · '}
                                {box ? getLocalizedProductName(box, lang) : 'Custom'}
                                {' · '}
                                {sub.preferredDeliveryDay}
                              </span>
                            </div>
                            <span className="font-medium text-[#F47B20]">
                              {t.account.subStatusWaitlist}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <form onSubmit={handleSaveSubscription} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[var(--ufb-muted)] mb-1">
                          {t.account.subFrequency}
                        </label>
                        <select
                          value={subFrequency}
                          onChange={(e) => setSubFrequency(e.target.value as 'weekly' | 'monthly')}
                          className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-card)] px-3 py-2.5 text-sm"
                        >
                          <option value="weekly">{t.account.weekly}</option>
                          <option value="monthly">{t.account.monthly}</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[var(--ufb-muted)] mb-1">
                          {t.account.subDay}
                        </label>
                        <select
                          value={subDay}
                          onChange={(e) => setSubDay(e.target.value)}
                          className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-card)] px-3 py-2.5 text-sm"
                        >
                          {['Monday', 'Wednesday', 'Friday', 'Saturday', 'Sunday'].map((d) => (
                            <option key={d} value={d}>
                              {d}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[var(--ufb-muted)] mb-1">
                        {t.account.subBox}
                      </label>
                      <select
                        value={subProductId}
                        onChange={(e) => setSubProductId(e.target.value)}
                        className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-card)] px-3 py-2.5 text-sm"
                      >
                        {products.map((p) => (
                          <option key={p.id} value={p.id}>
                            {getLocalizedProductName(p, lang)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[var(--ufb-muted)] mb-1">
                        {t.account.subNotes}
                      </label>
                      <input
                        type="text"
                        value={subNotes}
                        onChange={(e) => setSubNotes(e.target.value)}
                        className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-card)] px-3.5 py-2.5 text-sm"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-lg bg-[#238447] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1b6b38] disabled:opacity-60 transition-colors"
                    >
                      {subscriptionsEnabled ? t.account.subSaveBtn : t.account.subSaveBtn}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
