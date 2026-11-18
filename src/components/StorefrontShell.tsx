'use client';

import { useCallback, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged, signInWithPopup, signOut, type User } from 'firebase/auth';
import { CartDrawer } from './CartDrawer.tsx';
import { CustomerAccountModal } from './CustomerAccountModal.tsx';
import { ProductModal } from './ProductModal.tsx';
import { Storefront } from './Storefront.tsx';
import { TRANSLATIONS } from '../i18n/translations.ts';
import { auth, googleAuthProvider } from '../lib/firebase.ts';
import type {
  BusinessSettings,
  CartItem,
  Currency,
  CustomerComment,
  CustomerProfile,
  Language,
  OrderRecord,
  Product,
  SubscriptionRecord,
  ThemeMode,
} from '../types.ts';

function readStored<T extends string>(key: string, allowed: readonly T[], fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  try {
    const val = localStorage.getItem(key) as T | null;
    if (val && allowed.includes(val)) return val;
  } catch {
    // Ignore storage errors
  }
  return fallback;
}

export function StorefrontShell() {
  const router = useRouter();

  const [lang, setLang] = useState<Language>('en');
  const [currency, setCurrency] = useState<Currency>('USD');
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [prefsLoaded, setPrefsLoaded] = useState(false);

  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [comments, setComments] = useState<CustomerComment[]>([]);
  const [loadingStore, setLoadingStore] = useState(true);
  const [storeError, setStoreError] = useState<string | null>(null);

  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Optional Customer Account State
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [signingIn, setSigningIn] = useState(false);
  const [customerProfile, setCustomerProfile] = useState<CustomerProfile | null>(null);
  const [customerOrders, setCustomerOrders] = useState<OrderRecord[]>([]);
  const [customerSubscriptions, setCustomerSubscriptions] = useState<SubscriptionRecord[]>([]);

  const t = TRANSLATIONS[lang];

  // Hydrate persisted client preferences safely after mount
  useEffect(() => {
    setLang(readStored<Language>('ufb_lang', ['en', 'fr', 'ht'] as const, 'en'));
    setCurrency(readStored<Currency>('ufb_currency', ['USD', 'HTG'] as const, 'USD'));
    setTheme(readStored<ThemeMode>('ufb_theme', ['light', 'dark', 'brand'] as const, 'light'));
    try {
      const rawCart = localStorage.getItem('ufb_cart');
      if (rawCart) setCart(JSON.parse(rawCart));
    } catch {
      // ignore
    }
    setPrefsLoaded(true);
  }, []);

  // Sync Theme Classes on <html>
  useEffect(() => {
    if (!prefsLoaded) return;
    const root = document.documentElement;
    root.classList.remove('dark', 'theme-brand');
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'brand') {
      root.classList.add('theme-brand');
    }
    try {
      localStorage.setItem('ufb_theme', theme);
    } catch {
      // ignore
    }
  }, [theme, prefsLoaded]);

  useEffect(() => {
    if (!prefsLoaded) return;
    try {
      localStorage.setItem('ufb_lang', lang);
    } catch {
      // ignore
    }
  }, [lang, prefsLoaded]);

  useEffect(() => {
    if (!prefsLoaded) return;
    try {
      localStorage.setItem('ufb_currency', currency);
    } catch {
      // ignore
    }
  }, [currency, prefsLoaded]);

  useEffect(() => {
    if (!prefsLoaded) return;
    try {
      localStorage.setItem('ufb_cart', JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart, prefsLoaded]);

  const fetchStorefront = useCallback(async () => {
    setLoadingStore(true);
    setStoreError(null);
    try {
      const res = await fetch('/api/storefront');
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to load storefront');
      setSettings(data.settings);
      setProducts(data.products || []);
      setComments(data.comments || []);
    } catch (err: any) {
      setStoreError(err.message || 'Could not load storefront catalog.');
    } finally {
      setLoadingStore(false);
    }
  }, []);

  useEffect(() => {
    fetchStorefront();
  }, [fetchStorefront]);

  const getAuthToken = useCallback(async (): Promise<string | null> => {
    if (!auth.currentUser) return null;
    try {
      return await auth.currentUser.getIdToken();
    } catch {
      return null;
    }
  }, []);

  const loadCustomerAccount = useCallback(async (user: User | null) => {
    if (!user) {
      setCustomerProfile(null);
      setCustomerOrders([]);
      setCustomerSubscriptions([]);
      return;
    }
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/customer/me', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setCustomerProfile(data.profile || null);
        setCustomerOrders(data.orders || []);
        setCustomerSubscriptions(data.subscriptions || []);
      }
    } catch {
      // Non-blocking
    }
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      loadCustomerAccount(user);
    });
    return () => unsub();
  }, [loadCustomerAccount]);

  const handleCustomerSignIn = async () => {
    setSigningIn(true);
    try {
      const cred = await signInWithPopup(auth, googleAuthProvider);
      await loadCustomerAccount(cred.user);
    } finally {
      setSigningIn(false);
    }
  };

  const handleCustomerSignOut = async () => {
    await signOut(auth);
    setCustomerProfile(null);
    setCustomerOrders([]);
    setCustomerSubscriptions([]);
  };

  const handleAddToCart = (productId: number, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === productId ? { ...i, quantity: Math.min(99, i.quantity + quantity) } : i
        );
      }
      return [...prev, { productId, quantity }];
    });
  };

  const handleUpdateQty = (productId: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((i) => (i.productId === productId ? { ...i, quantity: i.quantity + delta } : i))
        .filter((i) => i.quantity > 0)
    );
  };

  const handleRemoveItem = (productId: number) => {
    setCart((prev) => prev.filter((i) => i.productId !== productId));
  };

  return (
    <>
      <Storefront
        settings={settings}
        products={products}
        comments={comments}
        onCommentAdded={(comment) => setComments((prev) => [comment, ...prev])}
        loading={loadingStore}
        error={storeError}
        onRetry={fetchStorefront}
        lang={lang}
        onLangChange={setLang}
        currency={currency}
        onCurrencyChange={setCurrency}
        theme={theme}
        onThemeChange={setTheme}
        t={t}
        cart={cart}
        onAddToCart={handleAddToCart}
        onOpenCart={() => setCartOpen(true)}
        onSelectProduct={(p) => setSelectedProduct(p)}
        onOpenAccount={() => setAccountOpen(true)}
        customerEmail={firebaseUser?.email || null}
        onOpenAdmin={() => router.push('/admin')}
      />

      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        lang={lang}
        currency={currency}
        t={t}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        products={products}
        lang={lang}
        currency={currency}
        onCurrencyChange={setCurrency}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCart([])}
        t={t}
        customerProfile={customerProfile}
        getAuthToken={getAuthToken}
      />

      <CustomerAccountModal
        isOpen={accountOpen}
        onClose={() => setAccountOpen(false)}
        lang={lang}
        t={t}
        firebaseEmail={firebaseUser?.email || null}
        profile={customerProfile}
        orders={customerOrders}
        subscriptions={customerSubscriptions}
        products={products}
        subscriptionsEnabled={Boolean(settings?.subscriptionsEnabled)}
        signingIn={signingIn}
        onSignInGoogle={handleCustomerSignIn}
        onSignOut={handleCustomerSignOut}
        getAuthToken={getAuthToken}
        onRefreshAccount={() => loadCustomerAccount(firebaseUser)}
      />
    </>
  );
}
