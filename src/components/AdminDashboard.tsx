'use client';

import React, { useEffect, useRef, useState } from 'react';
import {
  EmailAuthProvider,
  getRedirectResult,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  signOut,
  updatePassword,
} from 'firebase/auth';
import {
  ArrowLeft,
  Check,
  Eye,
  EyeOff,
  ImagePlus,
  KeyRound,
  Lock,
  LogOut,
  MessageSquare,
  Package,
  Plus,
  RefreshCw,
  Settings,
  ShoppingBag,
  Star,
  Trash2,
  Upload,
} from 'lucide-react';
import { auth, googleAuthProvider } from '../lib/firebase.ts';
import { safeFetchJson } from '../lib/fetch-json.ts';
import { formatMoney, type TranslationBundle } from '../i18n/translations.ts';
import type {
  BusinessSettings,
  CustomerComment,
  OrderRecord,
  OrderStatus,
  Product,
} from '../types.ts';

interface AdminDashboardProps {
  onExitAdmin: () => void;
  onStorefrontUpdated: () => Promise<void>;
  t: TranslationBundle;
}

interface AdminUser {
  id: number;
  email: string;
  fullName: string;
  role: string;
}

const ORDER_STATUSES: OrderStatus[] = [
  'New',
  'Confirmed',
  'Preparing',
  'Out for delivery',
  'Delivered',
  'Cancelled',
];

const ADMIN_TOKEN_STORAGE_KEY = 'ufb_admin_token';
const ADMIN_REDIRECT_FLAG_KEY = 'ufb_admin_google_redirect';

function readStoredAdminToken(): string | null {
  try {
    return typeof window !== 'undefined' ? sessionStorage.getItem(ADMIN_TOKEN_STORAGE_KEY) : null;
  } catch {
    return null;
  }
}

function writeStoredAdminToken(token: string | null) {
  try {
    if (typeof window === 'undefined') return;
    if (token) {
      sessionStorage.setItem(ADMIN_TOKEN_STORAGE_KEY, token);
    } else {
      sessionStorage.removeItem(ADMIN_TOKEN_STORAGE_KEY);
    }
  } catch {
    // ignore storage errors
  }
}

function buildAdminFetchInit(init: RequestInit = {}): RequestInit {
  const token = readStoredAdminToken();
  const headers = new Headers(init.headers);
  if (token && !headers.has('x-admin-token')) {
    headers.set('x-admin-token', token);
  }
  return {
    ...init,
    credentials: 'include',
    headers,
  };
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onExitAdmin,
  onStorefrontUpdated,
  t,
}) => {
  const [adminUser, setAdminUser] = useState<AdminUser | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);

  // Login & initial-owner bootstrap state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [bootstrapToken, setBootstrapToken] = useState('');
  const [bootstrapStatus, setBootstrapStatus] = useState<{
    bootstrapOpen: boolean;
    bootstrapConfigured: boolean;
    requiresBootstrapToken: boolean;
    hasAdminEmailAllowlist?: boolean;
  } | null>(null);
  const [checkingBootstrap, setCheckingBootstrap] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Dashboard tabs
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'comments' | 'settings' | 'security'>('orders');

  // Overview data
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [comments, setComments] = useState<CustomerComment[]>([]);
  const [settings, setSettings] = useState<BusinessSettings | null>(null);
  const [loadingData, setLoadingData] = useState(false);
  const [toast, setToast] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  // Order filter
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  // Daily Exchange Rate input
  const [exchangeRateInput, setExchangeRateInput] = useState('132.00');

  // Product Editor Modal / Inline state
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [pendingProductImage, setPendingProductImage] = useState<File | null>(null);
  const [savingProduct, setSavingProduct] = useState(false);
  const [uploadingImageFor, setUploadingImageFor] = useState<number | null>(null);

  // Settings form state
  const [settingsForm, setSettingsForm] = useState<Partial<BusinessSettings>>({});
  const [savingSettings, setSavingSettings] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Security password change
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = (type: 'ok' | 'err', text: string) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    setToast({ type, text });
    toastTimerRef.current = setTimeout(() => {
      setToast(null);
      toastTimerRef.current = null;
    }, 4000);
  };

  const openNewBoxModal = () => {
    setActiveTab('products');
    setIsNewProduct(true);
    setPendingProductImage(null);
    setEditingProduct({
      nameEn: '',
      nameFr: '',
      nameHt: '',
      descriptionEn: '',
      descriptionFr: '',
      descriptionHt: '',
      priceUsd: '0.00',
      priceHtg: '0.00',
      isAvailable: true,
      isFeatured: true,
      sortOrder: products.length + 1,
    });
  };

  const loadOverview = async () => {
    setLoadingData(true);
    try {
      const { res, data } = await safeFetchJson('/api/admin/overview', buildAdminFetchInit());
      if (!res.ok) {
        if (res.status === 401) {
          writeStoredAdminToken(null);
          setAdminUser(null);
          return;
        }
        throw new Error(data.error || 'Failed to load dashboard data');
      }
      setOrders(data.orders || []);
      setProducts(data.products || []);
      setComments(data.comments || []);
      setSettings(data.settings || null);
      if (data.settings) {
        setSettingsForm(data.settings);
        setExchangeRateInput(data.settings.exchangeRateHtgPerUsd || '132.00');
      }
    } catch (err: any) {
      showToast('err', err.message || 'Could not refresh admin data');
    } finally {
      setLoadingData(false);
    }
  };

  const refreshBootstrapStatus = async () => {
    setCheckingBootstrap(true);
    try {
      const { res: bRes, data: bData } = await safeFetchJson('/api/admin/bootstrap', {
        cache: 'no-store',
        credentials: 'include',
      });
      if (bRes.ok && typeof bData?.bootstrapOpen === 'boolean') {
        const nextStatus = {
          bootstrapOpen: Boolean(bData.bootstrapOpen),
          bootstrapConfigured: Boolean(bData.bootstrapConfigured),
          requiresBootstrapToken: Boolean(bData.requiresBootstrapToken),
          hasAdminEmailAllowlist: Boolean(bData.hasAdminEmailAllowlist),
        };
        setBootstrapStatus(nextStatus);
        return nextStatus;
      }
    } catch {
      // Non-fatal bootstrap status check failure
    } finally {
      setCheckingBootstrap(false);
    }
    return null;
  };

  useEffect(() => {
    (async () => {
      try {
        let resolvedBootstrapOpen = false;
        let resolvedRequiresToken = false;

        const latestBootstrap = await refreshBootstrapStatus();
        if (latestBootstrap) {
          resolvedBootstrapOpen = latestBootstrap.bootstrapOpen;
          resolvedRequiresToken = latestBootstrap.requiresBootstrapToken;
        }

        const redirectFlag =
          typeof window !== 'undefined' && sessionStorage.getItem(ADMIN_REDIRECT_FLAG_KEY) === '1';
        if (redirectFlag) {
          sessionStorage.removeItem(ADMIN_REDIRECT_FLAG_KEY);
          const redirectCred = await getRedirectResult(auth);
          if (redirectCred?.user) {
            const idToken = await redirectCred.user.getIdToken();
            const useBootstrap = resolvedBootstrapOpen && !resolvedRequiresToken;
            const endpoint = useBootstrap ? '/api/admin/bootstrap' : '/api/admin/login';
            const { res: gRes, data: gData } = await safeFetchJson(endpoint, {
              method: 'POST',
              headers: {
                Authorization: `Bearer ${idToken}`,
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: useBootstrap ? JSON.stringify({}) : undefined,
            });
            if (gRes.ok && gData.admin) {
              if (gData.sessionToken) writeStoredAdminToken(gData.sessionToken);
              if (useBootstrap) {
                setBootstrapStatus((prev) => (prev ? { ...prev, bootstrapOpen: false } : null));
              }
              setAdminUser(gData.admin);
              await loadOverview();
              return;
            }
            if (!gRes.ok) {
              setLoginError(gData.error || 'Unauthorized Google account');
            }
          }
        }

        await auth.authStateReady();
        const sessionInit = buildAdminFetchInit();
        if (auth.currentUser) {
          try {
            const firebaseToken = await auth.currentUser.getIdToken();
            const headers = new Headers(sessionInit.headers);
            if (!headers.has('authorization')) {
              headers.set('Authorization', `Bearer ${firebaseToken}`);
            }
            sessionInit.headers = headers;
          } catch {
            // Fall back to cookie / stored token
          }
        }

        const { res, data } = await safeFetchJson('/api/admin/session', sessionInit);
        if (res.ok && data.admin) {
          setAdminUser(data.admin);
          await loadOverview();
        }
      } catch {
        // Not signed in yet
      } finally {
        setCheckingSession(false);
      }
    })();
  }, []);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoginLoading(true);
    try {
      let currentBootstrap = bootstrapStatus;
      if (currentBootstrap?.bootstrapOpen && !currentBootstrap.bootstrapConfigured) {
        currentBootstrap = (await refreshBootstrapStatus()) ?? currentBootstrap;
      }
      if (currentBootstrap?.bootstrapOpen && !currentBootstrap.bootstrapConfigured) {
        throw new Error(
          'Server authorization is not active yet. Set ADMIN_EMAIL and/or ADMIN_BOOTSTRAP_TOKEN in Vercel Environment Variables (Production), then redeploy.'
        );
      }

      const isBootstrap = Boolean(currentBootstrap?.bootstrapOpen);
      if (isBootstrap && currentBootstrap?.requiresBootstrapToken && !bootstrapToken.trim()) {
        throw new Error('Enter the Bootstrap Authorization Token (ADMIN_BOOTSTRAP_TOKEN).');
      }

      const cred = await signInWithEmailAndPassword(auth, loginEmail.trim(), loginPassword);
      const idToken = await cred.user.getIdToken();
      const endpoint = isBootstrap ? '/api/admin/bootstrap' : '/api/admin/login';
      const { res, data } = await safeFetchJson(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: isBootstrap ? JSON.stringify({ bootstrapToken: bootstrapToken.trim() }) : undefined,
      });
      if (!res.ok) throw new Error(data.error || 'Administrator authorization failed');
      if (data.sessionToken) writeStoredAdminToken(data.sessionToken);
      if (isBootstrap) {
        setBootstrapStatus((prev) => (prev ? { ...prev, bootstrapOpen: false } : null));
        setBootstrapToken('');
      }
      setAdminUser(data.admin);
      setLoginPassword('');
      await loadOverview();
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/operation-not-allowed') {
        setLoginError(
          'Email/password sign-in is not enabled in Firebase Authentication. Enable Email/Password in Firebase Console → Authentication → Sign-in method, or use Google Sign-In.'
        );
      } else if (
        code === 'auth/invalid-credential' ||
        code === 'auth/user-not-found' ||
        code === 'auth/wrong-password'
      ) {
        setLoginError(
          'Firebase rejected this email or password. Verify the user exists in Firebase Authentication → Users with this password.'
        );
      } else if (code === 'auth/too-many-requests') {
        setLoginError('Too many failed sign-in attempts. Please wait a few minutes and try again.');
      } else {
        setLoginError(err.message || 'Invalid administrator credentials.');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleGoogleAdminLogin = async () => {
    setLoginError(null);
    setLoginLoading(true);
    try {
      let currentBootstrap = bootstrapStatus;
      if (currentBootstrap?.bootstrapOpen && !currentBootstrap.bootstrapConfigured) {
        currentBootstrap = (await refreshBootstrapStatus()) ?? currentBootstrap;
      }
      if (currentBootstrap?.bootstrapOpen && !currentBootstrap.bootstrapConfigured) {
        throw new Error(
          'Server authorization is not active yet. Set ADMIN_EMAIL and/or ADMIN_BOOTSTRAP_TOKEN in Vercel Environment Variables (Production), then redeploy.'
        );
      }

      const isBootstrap = Boolean(currentBootstrap?.bootstrapOpen);
      if (isBootstrap && currentBootstrap?.requiresBootstrapToken && !bootstrapToken.trim()) {
        throw new Error(
          'Enter the Bootstrap Authorization Token (ADMIN_BOOTSTRAP_TOKEN) above before signing in with Google.'
        );
      }

      const cred = await signInWithPopup(auth, googleAuthProvider);
      const idToken = await cred.user.getIdToken();
      const endpoint = isBootstrap ? '/api/admin/bootstrap' : '/api/admin/login';
      const { res, data } = await safeFetchJson(endpoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${idToken}`,
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: isBootstrap ? JSON.stringify({ bootstrapToken: bootstrapToken.trim() }) : undefined,
      });
      if (!res.ok) throw new Error(data.error || 'Unauthorized Google account');
      if (data.sessionToken) writeStoredAdminToken(data.sessionToken);
      if (isBootstrap) {
        setBootstrapStatus((prev) => (prev ? { ...prev, bootstrapOpen: false } : null));
        setBootstrapToken('');
      }
      setAdminUser(data.admin);
      await loadOverview();
    } catch (err: any) {
      const code = err?.code || '';
      const isTopLevel = typeof window !== 'undefined' && window.self === window.top;
      if (
        isTopLevel &&
        (code === 'auth/popup-blocked' ||
          code === 'auth/operation-not-supported-in-this-environment' ||
          code === 'auth/web-storage-unsupported')
      ) {
        if (bootstrapStatus?.bootstrapOpen && bootstrapStatus?.requiresBootstrapToken) {
          setLoginError(
            'Your browser blocked the Google sign-in popup. Allow popups for this site or use Email/Password above to submit your Bootstrap Authorization Token.'
          );
          return;
        }
        try {
          sessionStorage.setItem(ADMIN_REDIRECT_FLAG_KEY, '1');
        } catch {
          // ignore
        }
        await signInWithRedirect(auth, googleAuthProvider);
        return;
      }
      if (code === 'auth/unauthorized-domain') {
        const host = typeof window !== 'undefined' ? window.location.hostname : 'this domain';
        setLoginError(
          `Domain "${host}" is not listed in Firebase Authentication → Settings → Authorized domains. Add "${host}" to your Firebase project's Authorized domains (or use your own Firebase project via NEXT_PUBLIC_FIREBASE_* env vars).`
        );
      } else if (code !== 'auth/popup-closed-by-user') {
        setLoginError(err.message || 'Google sign-in failed');
      }
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    writeStoredAdminToken(null);
    try {
      await signOut(auth);
    } catch {
      // Ignore Firebase client sign-out errors
    }
    try {
      await fetch('/api/admin/logout', { method: 'POST', credentials: 'include' });
    } catch {
      // Ignore transient logout network errors
    }
    setAdminUser(null);
    setOrders([]);
  };

  const handleOrderStatusChange = async (orderId: number, status: OrderStatus) => {
    try {
      const { res, data } = await safeFetchJson(
        `/api/admin/orders/${orderId}/status`,
        buildAdminFetchInit({
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        })
      );
      if (!res.ok) throw new Error(data.error || 'Failed to update status');
      setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status } : o)));
      showToast('ok', `Order status updated to ${status}`);
    } catch (err: any) {
      showToast('err', err.message);
    }
  };

  const handleSaveExchangeRate = async () => {
    try {
      const { res, data } = await safeFetchJson(
        '/api/admin/settings',
        buildAdminFetchInit({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ exchangeRateHtgPerUsd: exchangeRateInput }),
        })
      );
      if (!res.ok) throw new Error(data.error || 'Failed to update exchange rate');
      setSettings(data.settings);
      setSettingsForm(data.settings);
      await onStorefrontUpdated();
      showToast('ok', `Exchange rate updated to 1 USD = ${data.settings.exchangeRateHtgPerUsd} HTG`);
    } catch (err: any) {
      showToast('err', err.message);
    }
  };

  const handleToggleProductAvailability = async (product: Product) => {
    try {
      const { res, data } = await safeFetchJson(
        `/api/admin/products/${product.id}`,
        buildAdminFetchInit({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isAvailable: !product.isAvailable }),
        })
      );
      if (!res.ok) throw new Error(data.error || 'Failed to update product');
      setProducts((prev) => prev.map((p) => (p.id === product.id ? data.product : p)));
      await onStorefrontUpdated();
      showToast('ok', `${product.nameEn} marked ${!product.isAvailable ? 'Available' : 'Unavailable'}`);
    } catch (err: any) {
      showToast('err', err.message);
    }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setSavingProduct(true);
    try {
      const url = isNewProduct
        ? '/api/admin/products'
        : `/api/admin/products/${editingProduct.id}`;
      const method = isNewProduct ? 'POST' : 'PUT';

      const { res, data } = await safeFetchJson(
        url,
        buildAdminFetchInit({
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editingProduct),
        })
      );
      if (!res.ok) throw new Error(data.error || 'Failed to save product');

      if (pendingProductImage && data.product?.id) {
        const formData = new FormData();
        formData.append('image', pendingProductImage);
        const { res: imgRes, data: imgData } = await safeFetchJson(
          `/api/admin/products/${data.product.id}/image`,
          buildAdminFetchInit({
            method: 'POST',
            body: formData,
          })
        );
        if (!imgRes.ok) {
          showToast('err', imgData.error || 'Box saved, but photo upload failed.');
        }
      }

      await loadOverview();
      await onStorefrontUpdated();
      setEditingProduct(null);
      setPendingProductImage(null);
      showToast('ok', isNewProduct ? 'New food box added.' : 'Food box updated.');
    } catch (err: any) {
      showToast('err', err.message);
    } finally {
      setSavingProduct(false);
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    try {
      const { res, data } = await safeFetchJson(
        `/api/admin/products/${product.id}`,
        buildAdminFetchInit({
          method: 'DELETE',
        })
      );
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete product');
      }
      setProducts((prev) => prev.filter((p) => p.id !== product.id));
      await onStorefrontUpdated();
      showToast('ok', `${product.nameEn} deleted.`);
    } catch (err: any) {
      showToast('err', err.message);
    }
  };

  const handleToggleCommentVisibility = async (comment: CustomerComment) => {
    try {
      const { res, data } = await safeFetchJson(
        `/api/admin/comments/${comment.id}`,
        buildAdminFetchInit({
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ isVisible: !comment.isVisible }),
        })
      );
      if (!res.ok) throw new Error(data.error || 'Failed to update comment');
      setComments((prev) => prev.map((c) => (c.id === comment.id ? data.comment : c)));
      await onStorefrontUpdated();
      showToast('ok', data.comment.isVisible ? 'Comment is now visible.' : 'Comment hidden.');
    } catch (err: any) {
      showToast('err', err.message);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    try {
      const { res, data } = await safeFetchJson(
        `/api/admin/comments/${commentId}`,
        buildAdminFetchInit({
          method: 'DELETE',
        })
      );
      if (!res.ok) {
        throw new Error(data.error || 'Failed to delete comment');
      }
      setComments((prev) => prev.filter((c) => c.id !== commentId));
      await onStorefrontUpdated();
      showToast('ok', 'Comment deleted.');
    } catch (err: any) {
      showToast('err', err.message);
    }
  };

  const handleUploadProductImage = async (productId: number, file: File) => {
    setUploadingImageFor(productId);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const { res, data } = await safeFetchJson(
        `/api/admin/products/${productId}/image`,
        buildAdminFetchInit({
          method: 'POST',
          body: formData,
        })
      );
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, imageUrl: `${data.imageUrl}?v=${Date.now()}` } : p))
      );
      await onStorefrontUpdated();
      showToast('ok', 'Product photograph uploaded.');
    } catch (err: any) {
      showToast('err', err.message);
    } finally {
      setUploadingImageFor(null);
    }
  };

  const handleRemoveProductImage = async (productId: number) => {
    try {
      const { res, data } = await safeFetchJson(
        `/api/admin/products/${productId}/image`,
        buildAdminFetchInit({
          method: 'DELETE',
        })
      );
      if (!res.ok) throw new Error(data.error || 'Could not remove image');
      setProducts((prev) => prev.map((p) => (p.id === productId ? { ...p, imageUrl: null } : p)));
      await onStorefrontUpdated();
      showToast('ok', 'Product photograph removed.');
    } catch (err: any) {
      showToast('err', err.message);
    }
  };

  const handleUploadLogo = async (file: File) => {
    setUploadingLogo(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      const { res, data } = await safeFetchJson(
        '/api/admin/logo',
        buildAdminFetchInit({
          method: 'POST',
          body: formData,
        })
      );
      if (!res.ok) throw new Error(data.error || 'Logo upload failed');
      await loadOverview();
      await onStorefrontUpdated();
      showToast('ok', 'Business logo updated.');
    } catch (err: any) {
      showToast('err', err.message);
    } finally {
      setUploadingLogo(false);
    }
  };

  const handleResetLogo = async () => {
    try {
      const { res, data } = await safeFetchJson(
        '/api/admin/logo',
        buildAdminFetchInit({
          method: 'DELETE',
        })
      );
      if (!res.ok) throw new Error(data.error || 'Failed to reset logo');
      await loadOverview();
      await onStorefrontUpdated();
      showToast('ok', 'Restored official UrFoodBox logo.');
    } catch (err: any) {
      showToast('err', err.message);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const { res, data } = await safeFetchJson(
        '/api/admin/settings',
        buildAdminFetchInit({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(settingsForm),
        })
      );
      if (!res.ok) throw new Error(data.error || 'Failed to save settings');
      setSettings(data.settings);
      setSettingsForm(data.settings);
      await onStorefrontUpdated();
      showToast('ok', 'Storefront settings & contact links saved.');
    } catch (err: any) {
      showToast('err', err.message);
    } finally {
      setSavingSettings(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showToast('err', 'New passwords do not match.');
      return;
    }
    setSavingPassword(true);
    try {
      await auth.authStateReady();
      const currentUser = auth.currentUser;
      if (!currentUser || !currentUser.email) {
        throw new Error(
          'Sign in again with Firebase Email/Password before updating your Firebase password.'
        );
      }
      const hasPasswordProvider = currentUser.providerData.some(
        (provider) => provider.providerId === 'password'
      );
      if (!hasPasswordProvider) {
        throw new Error(
          'This administrator account signs in with Google. Manage your password through your Google account settings.'
        );
      }
      const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
      await reauthenticateWithCredential(currentUser, credential);
      await updatePassword(currentUser, newPassword);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      showToast('ok', 'Firebase administrator password updated successfully.');
    } catch (err: any) {
      const code = err?.code || '';
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        showToast('err', 'Current password is incorrect.');
      } else if (code === 'auth/weak-password') {
        showToast('err', 'New password is too weak. Use at least 8 characters.');
      } else {
        showToast('err', err.message || 'Failed to update password.');
      }
    } finally {
      setSavingPassword(false);
    }
  };

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--ufb-bg)] text-[var(--ufb-text)]">
        <div className="text-sm text-[var(--ufb-muted)]">Verifying administrator session...</div>
      </div>
    );
  }

  // LOGIN GATE
  if (!adminUser) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--ufb-bg)] text-[var(--ufb-text)] px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-[var(--ufb-border)] bg-[var(--ufb-card)] p-7 sm:p-8 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onExitAdmin}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--ufb-muted)] hover:text-[#F47B20] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Storefront</span>
            </button>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-[#F47B20]">
              <Lock className="h-3.5 w-3.5" />
              <span>Private Owner Portal</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <h1 className="font-display text-2xl font-bold tracking-tight">
              {bootstrapStatus?.bootstrapOpen ? 'Authorize Initial Owner' : 'UrFoodBox Owner Admin'}
            </h1>
            <p className="text-sm text-[var(--ufb-muted)]">
              {bootstrapStatus?.bootstrapOpen
                ? 'No owner administrator is bound yet. Sign in with your Firebase Authentication account to authorize the initial owner.'
                : 'Authorized administrator access only. Sign in with your authorized Firebase account to manage food boxes, pricing, and orders.'}
            </p>
          </div>

          {bootstrapStatus?.bootstrapOpen && !bootstrapStatus.bootstrapConfigured && (
            <div className="rounded-xl border border-amber-500/35 bg-amber-500/10 px-4 py-3 text-xs text-amber-800 dark:text-amber-300 space-y-2">
              <div className="font-semibold">Server Authorization Required Before Setup</div>
              <p>
                This deployment is not seeing{' '}
                <code className="font-mono font-semibold">ADMIN_EMAIL</code> or{' '}
                <code className="font-mono font-semibold">ADMIN_BOOTSTRAP_TOKEN</code> yet. Add
                either (or both) in Vercel Environment Variables for Production and{' '}
                <span className="font-semibold">redeploy</span> so the server loads them.
              </p>
              <div className="flex flex-wrap items-center gap-3 pt-0.5 text-[11px] font-mono">
                <span>ADMIN_EMAIL: {bootstrapStatus.hasAdminEmailAllowlist ? 'Set' : 'Not detected'}</span>
                <span>
                  ADMIN_BOOTSTRAP_TOKEN: {bootstrapStatus.requiresBootstrapToken ? 'Set' : 'Not detected'}
                </span>
              </div>
              <button
                type="button"
                disabled={checkingBootstrap}
                onClick={() => {
                  setLoginError(null);
                  void refreshBootstrapStatus();
                }}
                className="inline-flex items-center gap-1.5 rounded-md border border-amber-500/40 bg-amber-500/15 px-2.5 py-1 text-[11px] font-semibold hover:bg-amber-500/25 disabled:opacity-60 transition-colors"
              >
                <RefreshCw className={`h-3 w-3 ${checkingBootstrap ? 'animate-spin' : ''}`} />
                <span>{checkingBootstrap ? 'Checking server...' : 'Re-check Server Config'}</span>
              </button>
            </div>
          )}

          <form onSubmit={handlePasswordLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-[var(--ufb-muted)] mb-1.5">
                Administrator Email
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3.5 py-2.5 text-sm focus:border-[#F47B20] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-[var(--ufb-muted)] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showLoginPassword ? 'text' : 'password'}
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] pl-3.5 pr-10 py-2.5 text-sm focus:border-[#F47B20] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword((prev) => !prev)}
                  aria-label={showLoginPassword ? 'Hide password' : 'Show password'}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-[var(--ufb-muted)] hover:text-[var(--ufb-text)] transition-colors"
                >
                  {showLoginPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {bootstrapStatus?.bootstrapOpen && bootstrapStatus.requiresBootstrapToken && (
              <div>
                <label className="block text-xs font-medium text-[var(--ufb-muted)] mb-1.5">
                  Bootstrap Authorization Token
                </label>
                <input
                  type="password"
                  required
                  value={bootstrapToken}
                  onChange={(e) => setBootstrapToken(e.target.value)}
                  placeholder="Value of ADMIN_BOOTSTRAP_TOKEN"
                  className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3.5 py-2.5 text-sm focus:border-[#F47B20] focus:outline-none"
                />
              </div>
            )}

            {loginError && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-xs font-medium text-red-600 dark:text-red-400">
                {loginError}
              </div>
            )}

            <button
              type="submit"
              disabled={loginLoading}
              className="w-full rounded-lg bg-[#F47B20] px-5 py-3 text-sm font-semibold text-white hover:bg-[#df6912] disabled:opacity-60 transition-colors"
            >
              {loginLoading
                ? 'Verifying with Firebase...'
                : bootstrapStatus?.bootstrapOpen
                  ? 'Verify & Authorize Initial Owner'
                  : 'Sign In to Dashboard'}
            </button>
          </form>

          <div className="relative py-1">
            <div className="border-t border-[var(--ufb-border)]" />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--ufb-card)] px-3 text-[11px] text-[var(--ufb-muted)]">
              or
            </span>
          </div>

          <button
            type="button"
            disabled={loginLoading}
            onClick={handleGoogleAdminLogin}
            className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-5 py-2.5 text-sm font-semibold hover:border-[#238447] hover:text-[#238447] disabled:opacity-60 transition-colors"
          >
            Sign in with Authorized Google Account
          </button>
        </div>
      </div>
    );
  }

  const filteredOrders =
    statusFilter === 'ALL' ? orders : orders.filter((o) => o.status === statusFilter);

  return (
    <div className="min-h-screen bg-[var(--ufb-bg)] text-[var(--ufb-text)]">
      {/* Admin Top Header */}
      <header className="sticky top-0 z-30 border-b border-[var(--ufb-border)] bg-[var(--ufb-card)]/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 py-3.5">
          <div className="flex items-center gap-4 min-w-0">
            <button
              type="button"
              onClick={onExitAdmin}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--ufb-border)] px-3 py-2 text-xs font-semibold hover:border-[#F47B20] transition-colors whitespace-nowrap shrink-0"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>View Storefront</span>
            </button>
            <div className="min-w-0">
              <div className="font-display text-base font-bold truncate">UrFoodBox Owner Admin</div>
              <div className="text-xs text-[var(--ufb-muted)] truncate">{adminUser.email}</div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={openNewBoxModal}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#F47B20] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#df6912] transition-colors whitespace-nowrap"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add Box</span>
            </button>
            <button
              type="button"
              onClick={loadOverview}
              disabled={loadingData}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--ufb-border)] px-3 py-2 text-xs font-semibold hover:bg-[var(--ufb-surface)] transition-colors whitespace-nowrap"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${loadingData ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#171717] text-white dark:bg-white dark:text-[#171717] px-3.5 py-2 text-xs font-semibold hover:opacity-90 transition-opacity whitespace-nowrap"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 sm:px-6 pb-3">
          {(
            [
              ['orders', `Orders (${orders.length})`, ShoppingBag],
              ['products', `Food Boxes & Rates (${products.length})`, Package],
              ['comments', `Comments (${comments.length})`, MessageSquare],
              ['settings', 'Storefront & Contacts', Settings],
              ['security', 'Security', KeyRound],
            ] as const
          ).map(([key, label, Icon]) => {
            const active = activeTab === key;
            return (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${
                  active
                    ? 'bg-[#F47B20] text-white'
                    : 'bg-[var(--ufb-surface)] text-[var(--ufb-muted)] hover:text-[var(--ufb-text)]'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 rounded-xl border border-[var(--ufb-border)] bg-[var(--ufb-card)] px-4 py-3 shadow-xl flex items-center gap-2.5 text-sm font-medium">
          <span
            className={`h-2.5 w-2.5 rounded-full ${
              toast.type === 'ok' ? 'bg-[#238447]' : 'bg-red-600'
            }`}
          />
          <span>{toast.text}</span>
        </div>
      )}

      <main className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {/* ==================== ORDERS TAB ==================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-bold">Incoming Orders</h2>
                <p className="text-sm text-[var(--ufb-muted)]">
                  Manage customer orders, verify payment methods, and update delivery statuses.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                {(['ALL', ...ORDER_STATUSES] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setStatusFilter(st)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${
                      statusFilter === st
                        ? 'bg-[#238447] text-white'
                        : 'border border-[var(--ufb-border)] bg-[var(--ufb-card)] text-[var(--ufb-muted)] hover:text-[var(--ufb-text)]'
                    }`}
                  >
                    {st === 'ALL' ? 'All' : st}
                  </button>
                ))}
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="rounded-2xl border border-[var(--ufb-border)] bg-[var(--ufb-card)] p-12 text-center">
                <p className="text-sm text-[var(--ufb-muted)]">
                  No orders found in this view yet. When customers place an order, it appears here immediately.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-2xl border border-[var(--ufb-border)] bg-[var(--ufb-card)] p-5 sm:p-6 space-y-4"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-[var(--ufb-border)] pb-4">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="font-mono-num text-base font-bold text-[#F47B20]">
                            {order.orderReference}
                          </span>
                          <span className="text-xs text-[var(--ufb-muted)]">
                            {new Date(order.createdAt).toLocaleString()}
                          </span>
                        </div>
                        <div className="text-sm font-semibold">
                          {order.customerName} ·{' '}
                          <a href={`tel:${order.customerPhone}`} className="text-[#238447] hover:underline font-mono-num">
                            {order.customerPhone}
                          </a>
                        </div>
                        <div className="text-sm text-[var(--ufb-muted)]">
                          Delivery: {order.deliveryAddress}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold pt-0.5">
                          {order.boxPeriod && (
                            <span className="rounded-md bg-[#F47B20]/12 text-[#F47B20] px-2.5 py-1">
                              Period: {order.boxPeriod}
                            </span>
                          )}
                          {order.householdSize > 0 && (
                            <span className="rounded-md bg-[#238447]/12 text-[#238447] px-2.5 py-1">
                              For: {order.householdSize}{' '}
                              {order.householdSize === 1 ? 'person' : 'persons'}
                            </span>
                          )}
                        </div>
                        {order.orderInstructions && (
                          <div className="text-xs text-[var(--ufb-muted)] italic">
                            Instructions: {order.orderInstructions}
                          </div>
                        )}
                      </div>

                      <div className="flex flex-col sm:items-end gap-2">
                        <div className="font-mono-num text-lg font-bold">
                          {formatMoney(order.totalAmount, order.currency)}
                        </div>
                        <div className="text-xs text-[var(--ufb-muted)]">
                          Payment: <strong className="text-[var(--ufb-text)]">{t.paymentMethods[order.paymentMethod]}</strong>
                        </div>
                        <select
                          aria-label={`Order status for ${order.orderReference}`}
                          value={order.status}
                          onChange={(e) =>
                            handleOrderStatusChange(order.id, e.target.value as OrderStatus)
                          }
                          className="rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3 py-2 text-xs font-semibold focus:border-[#F47B20] focus:outline-none"
                        >
                          {ORDER_STATUSES.map((st) => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <div className="text-xs font-semibold text-[var(--ufb-muted)]">Ordered Products</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3 py-2 text-xs"
                          >
                            <span className="font-medium truncate mr-2">
                              {item.productName} × {item.quantity}
                            </span>
                            <span className="font-mono-num font-semibold shrink-0">
                              {formatMoney(item.lineTotal, order.currency)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== PRODUCTS & EXCHANGE RATE TAB ==================== */}
        {activeTab === 'products' && (
          <div className="space-y-8">
            {/* Daily Exchange Rate Bar */}
            <div className="rounded-2xl border border-[var(--ufb-border)] bg-[var(--ufb-card)] p-5 sm:p-6 flex flex-wrap items-end justify-between gap-4">
              <div className="space-y-1 max-w-xl">
                <h3 className="font-display text-base font-bold">Daily Exchange Rate (HTG / USD)</h3>
                <p className="text-xs text-[var(--ufb-muted)]">
                  Set today’s exchange rate for customer display and quick price conversion. USD and HTG product prices remain independently editable.
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3 py-2">
                  <span className="text-xs font-semibold text-[var(--ufb-muted)]">1 USD =</span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    value={exchangeRateInput}
                    onChange={(e) => setExchangeRateInput(e.target.value)}
                    className="w-24 bg-transparent font-mono-num text-sm font-bold focus:outline-none"
                  />
                  <span className="text-xs font-semibold text-[var(--ufb-muted)]">HTG</span>
                </div>
                <button
                  type="button"
                  onClick={handleSaveExchangeRate}
                  className="rounded-lg bg-[#238447] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#1b6b38] transition-colors whitespace-nowrap"
                >
                  Save Rate
                </button>
              </div>
            </div>

            {/* Product Header & Add Button */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <h2 className="font-display text-xl font-bold">Food Box Catalog</h2>
                <p className="text-sm text-[var(--ufb-muted)]">
                  Upload photos, edit multilingual descriptions, set USD & HTG prices independently, or add new boxes.
                </p>
              </div>
              <button
                type="button"
                onClick={openNewBoxModal}
                className="inline-flex items-center gap-2 rounded-lg bg-[#F47B20] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#df6912] transition-colors whitespace-nowrap"
              >
                <Plus className="h-4 w-4" />
                <span>Add New Food Box</span>
              </button>
            </div>

            {/* Product Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--ufb-border)] bg-[var(--ufb-card)]"
                >
                  <div>
                    <div className="relative aspect-[4/3] bg-[var(--ufb-surface)] border-b border-[var(--ufb-border)] flex items-center justify-center overflow-hidden">
                      {product.imageUrl ? (
                        <img
                          src={product.imageUrl}
                          alt={product.nameEn}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center text-center p-4">
                          <ImagePlus className="h-8 w-8 text-[var(--ufb-muted)]" />
                          <span className="mt-2 text-xs text-[var(--ufb-muted)]">No photograph yet</span>
                        </div>
                      )}
                    </div>

                    <div className="p-5 space-y-3">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display text-base font-bold">{product.nameEn}</h3>
                        <button
                          type="button"
                          onClick={() => handleToggleProductAvailability(product)}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-md border transition-colors whitespace-nowrap ${
                            product.isAvailable
                              ? 'border-[#238447]/30 bg-[#238447]/10 text-[#238447]'
                              : 'border-[var(--ufb-border)] bg-[var(--ufb-surface)] text-[var(--ufb-muted)]'
                          }`}
                        >
                          {product.isAvailable ? 'Available' : 'Unavailable'}
                        </button>
                      </div>

                      <p className="text-xs text-[var(--ufb-muted)] line-clamp-2 min-h-[2rem]">
                        {product.descriptionEn || 'No description added yet.'}
                      </p>

                      <div className="grid grid-cols-2 gap-2 rounded-lg bg-[var(--ufb-surface)] border border-[var(--ufb-border)] p-2.5 text-xs">
                        <div>
                          <span className="text-[var(--ufb-muted)]">USD: </span>
                          <span className="font-mono-num font-bold">
                            {formatMoney(product.priceUsd, 'USD')}
                          </span>
                        </div>
                        <div>
                          <span className="text-[var(--ufb-muted)]">HTG: </span>
                          <span className="font-mono-num font-bold">
                            {formatMoney(product.priceHtg, 'HTG')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-[var(--ufb-border)] px-5 py-3.5 flex flex-wrap items-center justify-between gap-2">
                    <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--ufb-border)] px-3 py-1.5 text-xs font-semibold hover:border-[#F47B20] transition-colors">
                      <Upload className="h-3.5 w-3.5" />
                      <span>
                        {uploadingImageFor === product.id
                          ? 'Uploading...'
                          : product.imageUrl
                            ? 'Replace Photo'
                            : 'Upload Photo'}
                      </span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        disabled={uploadingImageFor === product.id}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUploadProductImage(product.id, file);
                          e.target.value = '';
                        }}
                      />
                    </label>

                    <div className="flex items-center gap-2">
                      {product.imageUrl && (
                        <button
                          type="button"
                          onClick={() => handleRemoveProductImage(product.id)}
                          className="rounded-lg border border-[var(--ufb-border)] px-2.5 py-1.5 text-xs font-medium text-[var(--ufb-muted)] hover:text-red-600 transition-colors"
                        >
                          Clear Photo
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => {
                          setIsNewProduct(false);
                          setPendingProductImage(null);
                          setEditingProduct({ ...product });
                        }}
                        className="rounded-lg bg-[var(--ufb-surface)] border border-[var(--ufb-border)] px-3 py-1.5 text-xs font-semibold hover:border-[#F47B20] transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteProduct(product)}
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--ufb-border)] text-[var(--ufb-muted)] hover:text-red-600 transition-colors"
                        aria-label={`Delete ${product.nameEn}`}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================== STOREFRONT & CONTACTS TAB ==================== */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="space-y-8 max-w-4xl">
            {/* Business Logo */}
            <div className="rounded-2xl border border-[var(--ufb-border)] bg-[var(--ufb-card)] p-6 space-y-4">
              <h3 className="font-display text-lg font-bold">Business Logo</h3>
              <div className="flex flex-wrap items-center gap-6">
                <div className="h-24 w-24 overflow-hidden rounded-xl border border-[var(--ufb-border)] bg-[#FAF5EE] p-1.5 flex items-center justify-center">
                  <img
                    src={
                      settings?.logoUrl ||
                      '/assets/aistudio/IMG-20261115-WA0000_6c778049_6c778049.jpg'
                    }
                    alt="UrFoodBox Logo"
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#F47B20] px-4 py-2 text-xs font-semibold text-white hover:bg-[#df6912] transition-colors">
                      <Upload className="h-3.5 w-3.5" />
                      <span>{uploadingLogo ? 'Uploading...' : 'Upload New Logo'}</span>
                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp,image/gif"
                        className="hidden"
                        disabled={uploadingLogo}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleUploadLogo(file);
                          e.target.value = '';
                        }}
                      />
                    </label>
                    {settings?.logoImageId && (
                      <button
                        type="button"
                        onClick={handleResetLogo}
                        className="rounded-lg border border-[var(--ufb-border)] px-3.5 py-2 text-xs font-semibold hover:border-[#F47B20] transition-colors"
                      >
                        Restore Original Logo
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-[var(--ufb-muted)]">
                    Used in the navigation bar, hero showcase, and subtle background watermark.
                  </p>
                </div>
              </div>
            </div>

            {/* Social Media & Contact Settings */}
            <div className="rounded-2xl border border-[var(--ufb-border)] bg-[var(--ufb-card)] p-6 space-y-5">
              <h3 className="font-display text-lg font-bold">Social Media & Contact Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--ufb-muted)] mb-1.5">
                    WhatsApp Telephone Number (with country code, e.g. +50934567890)
                  </label>
                  <input
                    type="text"
                    value={settingsForm.whatsappNumber || ''}
                    onChange={(e) =>
                      setSettingsForm((s) => ({ ...s, whatsappNumber: e.target.value }))
                    }
                    placeholder="+509..."
                    className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--ufb-muted)] mb-1.5">
                    Business Contact Email
                  </label>
                  <input
                    type="email"
                    value={settingsForm.contactEmail || ''}
                    onChange={(e) =>
                      setSettingsForm((s) => ({ ...s, contactEmail: e.target.value }))
                    }
                    placeholder="contact@urfoodbox.com"
                    className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--ufb-muted)] mb-1.5">
                    TikTok Profile URL
                  </label>
                  <input
                    type="url"
                    value={settingsForm.tiktokUrl || ''}
                    onChange={(e) => setSettingsForm((s) => ({ ...s, tiktokUrl: e.target.value }))}
                    placeholder="https://www.tiktok.com/@urfoodbox"
                    className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--ufb-muted)] mb-1.5">
                    Facebook Page URL
                  </label>
                  <input
                    type="url"
                    value={settingsForm.facebookUrl || ''}
                    onChange={(e) =>
                      setSettingsForm((s) => ({ ...s, facebookUrl: e.target.value }))
                    }
                    placeholder="https://www.facebook.com/urfoodbox"
                    className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3.5 py-2.5 text-sm"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-medium text-[var(--ufb-muted)] mb-1.5">
                    Business Address / Service Area
                  </label>
                  <input
                    type="text"
                    value={settingsForm.contactAddress || ''}
                    onChange={(e) =>
                      setSettingsForm((s) => ({ ...s, contactAddress: e.target.value }))
                    }
                    placeholder="Port-au-Prince, Haiti"
                    className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3.5 py-2.5 text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Promotional Text Customization */}
            <div className="rounded-2xl border border-[var(--ufb-border)] bg-[var(--ufb-card)] p-6 space-y-5">
              <h3 className="font-display text-lg font-bold">Homepage Promotional Text</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[var(--ufb-muted)] mb-1">
                    Brand Slogan
                  </label>
                  <input
                    type="text"
                    value={settingsForm.slogan || ''}
                    onChange={(e) => setSettingsForm((s) => ({ ...s, slogan: e.target.value }))}
                    className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3.5 py-2 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[var(--ufb-muted)] mb-1">
                      Hero Headline (English)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.promoTitleEn || ''}
                      onChange={(e) =>
                        setSettingsForm((s) => ({ ...s, promoTitleEn: e.target.value }))
                      }
                      className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--ufb-muted)] mb-1">
                      Hero Headline (French)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.promoTitleFr || ''}
                      onChange={(e) =>
                        setSettingsForm((s) => ({ ...s, promoTitleFr: e.target.value }))
                      }
                      className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--ufb-muted)] mb-1">
                      Hero Headline (Kreyòl)
                    </label>
                    <input
                      type="text"
                      value={settingsForm.promoTitleHt || ''}
                      onChange={(e) =>
                        setSettingsForm((s) => ({ ...s, promoTitleHt: e.target.value }))
                      }
                      className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3 py-2 text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-[var(--ufb-muted)] mb-1">
                      Hero Subtitle (English)
                    </label>
                    <textarea
                      rows={3}
                      value={settingsForm.promoSubtitleEn || ''}
                      onChange={(e) =>
                        setSettingsForm((s) => ({ ...s, promoSubtitleEn: e.target.value }))
                      }
                      className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--ufb-muted)] mb-1">
                      Hero Subtitle (French)
                    </label>
                    <textarea
                      rows={3}
                      value={settingsForm.promoSubtitleFr || ''}
                      onChange={(e) =>
                        setSettingsForm((s) => ({ ...s, promoSubtitleFr: e.target.value }))
                      }
                      className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-[var(--ufb-muted)] mb-1">
                      Hero Subtitle (Kreyòl)
                    </label>
                    <textarea
                      rows={3}
                      value={settingsForm.promoSubtitleHt || ''}
                      onChange={(e) =>
                        setSettingsForm((s) => ({ ...s, promoSubtitleHt: e.target.value }))
                      }
                      className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3 py-2 text-sm"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <button
                type="submit"
                disabled={savingSettings}
                className="inline-flex items-center gap-2 rounded-lg bg-[#238447] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1b6b38] disabled:opacity-60 transition-colors"
              >
                <Check className="h-4 w-4" />
                <span>{savingSettings ? 'Saving Settings...' : 'Save All Storefront Settings'}</span>
              </button>
            </div>
          </form>
        )}

        {/* ==================== CLIENT COMMENTS TAB ==================== */}
        {activeTab === 'comments' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-xl font-bold">Client Comments</h2>
              <p className="text-sm text-[var(--ufb-muted)]">
                Review feedback submitted by visitors and hide or delete comments if needed.
              </p>
            </div>

            {comments.length === 0 ? (
              <div className="rounded-2xl border border-[var(--ufb-border)] bg-[var(--ufb-card)] p-12 text-center">
                <p className="text-sm text-[var(--ufb-muted)]">
                  No client comments have been submitted yet.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {comments.map((c) => (
                  <div
                    key={c.id}
                    className="rounded-2xl border border-[var(--ufb-border)] bg-[var(--ufb-card)] p-5 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-display text-base font-bold truncate">
                          {c.authorName}
                        </span>
                        <div className="flex items-center gap-0.5 shrink-0">
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

                    <div className="border-t border-[var(--ufb-border)] pt-3 flex items-center justify-between gap-3">
                      <span className="text-xs text-[var(--ufb-muted)]">
                        {new Date(c.createdAt).toLocaleString()}
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleToggleCommentVisibility(c)}
                          className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${
                            c.isVisible
                              ? 'border-[#238447]/30 bg-[#238447]/10 text-[#238447]'
                              : 'border-[var(--ufb-border)] bg-[var(--ufb-surface)] text-[var(--ufb-muted)]'
                          }`}
                        >
                          {c.isVisible ? (
                            <>
                              <Eye className="h-3.5 w-3.5" />
                              <span>Visible</span>
                            </>
                          ) : (
                            <>
                              <EyeOff className="h-3.5 w-3.5" />
                              <span>Hidden</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteComment(c.id)}
                          className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--ufb-border)] text-[var(--ufb-muted)] hover:text-red-600 transition-colors"
                          aria-label={`Delete comment by ${c.authorName}`}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== SECURITY TAB ==================== */}
        {activeTab === 'security' && (
          <div className="max-w-lg rounded-2xl border border-[var(--ufb-border)] bg-[var(--ufb-card)] p-6 space-y-5">
            <div>
              <h3 className="font-display text-lg font-bold">Administrator Password</h3>
              <p className="text-xs text-[var(--ufb-muted)] mt-1">
                Update your Firebase Authentication Email/Password credential. Public administrator registration is permanently disabled.
              </p>
            </div>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[var(--ufb-muted)] mb-1">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] pl-3.5 pr-10 py-2.5 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                    aria-label={showCurrentPassword ? 'Hide current password' : 'Show current password'}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-[var(--ufb-muted)] hover:text-[var(--ufb-text)] transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--ufb-muted)] mb-1">
                  New Password (min 8 characters)
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] pl-3.5 pr-10 py-2.5 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword((prev) => !prev)}
                    aria-label={showNewPassword ? 'Hide new password' : 'Show new password'}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-[var(--ufb-muted)] hover:text-[var(--ufb-text)] transition-colors"
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--ufb-muted)] mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] pl-3.5 pr-10 py-2.5 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-[var(--ufb-muted)] hover:text-[var(--ufb-text)] transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                disabled={savingPassword}
                className="rounded-lg bg-[#F47B20] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#df6912] disabled:opacity-60 transition-colors"
              >
                {savingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          </div>
        )}
      </main>

      {/* Product Edit / Create Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-[2px]"
            onClick={() => setEditingProduct(null)}
          />
          <form
            onSubmit={handleSaveProduct}
            className="relative z-10 max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--ufb-border)] bg-[var(--ufb-card)] p-5 sm:p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] space-y-5 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-[var(--ufb-border)] pb-3">
              <h3 className="font-display text-lg font-bold">
                {isNewProduct ? 'Add New Food Box' : `Edit ${editingProduct.nameEn}`}
              </h3>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="text-xs font-semibold text-[var(--ufb-muted)] hover:text-[var(--ufb-text)]"
              >
                Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--ufb-muted)] mb-1">
                  Name (English) *
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.nameEn || ''}
                  onChange={(e) =>
                    setEditingProduct((p) => ({ ...p, nameEn: e.target.value }))
                  }
                  className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--ufb-muted)] mb-1">
                  Name (French)
                </label>
                <input
                  type="text"
                  value={editingProduct.nameFr || ''}
                  onChange={(e) =>
                    setEditingProduct((p) => ({ ...p, nameFr: e.target.value }))
                  }
                  className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--ufb-muted)] mb-1">
                  Name (Kreyòl)
                </label>
                <input
                  type="text"
                  value={editingProduct.nameHt || ''}
                  onChange={(e) =>
                    setEditingProduct((p) => ({ ...p, nameHt: e.target.value }))
                  }
                  className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3 py-2 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-[var(--ufb-muted)] mb-1">
                  Description (English)
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.descriptionEn || ''}
                  onChange={(e) =>
                    setEditingProduct((p) => ({ ...p, descriptionEn: e.target.value }))
                  }
                  className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--ufb-muted)] mb-1">
                  Description (French)
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.descriptionFr || ''}
                  onChange={(e) =>
                    setEditingProduct((p) => ({ ...p, descriptionFr: e.target.value }))
                  }
                  className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--ufb-muted)] mb-1">
                  Description (Kreyòl)
                </label>
                <textarea
                  rows={3}
                  value={editingProduct.descriptionHt || ''}
                  onChange={(e) =>
                    setEditingProduct((p) => ({ ...p, descriptionHt: e.target.value }))
                  }
                  className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3 py-2 text-sm"
                />
              </div>
            </div>

            {/* Independent USD & HTG Pricing + Helper */}
            <div className="rounded-xl border border-[var(--ufb-border)] bg-[var(--ufb-surface)] p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold">Independent Pricing (USD & HTG)</span>
                <button
                  type="button"
                  onClick={() => {
                    const usd = Number(editingProduct.priceUsd) || 0;
                    const rate = Number(exchangeRateInput) || 132;
                    setEditingProduct((p) => ({
                      ...p,
                      priceHtg: (usd * rate).toFixed(2),
                    }));
                  }}
                  className="text-xs font-semibold text-[#F47B20] hover:underline"
                >
                  Apply Rate (× {exchangeRateInput}) to HTG
                </button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-[var(--ufb-muted)] mb-1">Price (USD)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editingProduct.priceUsd ?? '0.00'}
                    onChange={(e) =>
                      setEditingProduct((p) => ({ ...p, priceUsd: e.target.value }))
                    }
                    className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-card)] px-3 py-2 font-mono-num text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs text-[var(--ufb-muted)] mb-1">Price (HTG)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={editingProduct.priceHtg ?? '0.00'}
                    onChange={(e) =>
                      setEditingProduct((p) => ({ ...p, priceHtg: e.target.value }))
                    }
                    className="w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-card)] px-3 py-2 font-mono-num text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-[var(--ufb-border)] bg-[var(--ufb-surface)] p-4 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold">Box Photograph (Optional)</div>
                <div className="text-[11px] text-[var(--ufb-muted)]">
                  {pendingProductImage
                    ? `Selected: ${pendingProductImage.name}`
                    : 'JPG, PNG, WEBP, or GIF up to 4.5 MB'}
                </div>
              </div>
              <label className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-card)] px-3.5 py-2 text-xs font-semibold hover:border-[#F47B20] transition-colors">
                <Upload className="h-3.5 w-3.5" />
                <span>{pendingProductImage ? 'Change Photo' : 'Choose Photo'}</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    setPendingProductImage(file);
                    e.target.value = '';
                  }}
                />
              </label>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <label className="inline-flex items-center gap-2 text-sm font-medium cursor-pointer">
                <input
                  type="checkbox"
                  checked={Boolean(editingProduct.isAvailable)}
                  onChange={(e) =>
                    setEditingProduct((p) => ({ ...p, isAvailable: e.target.checked }))
                  }
                  className="h-4 w-4 accent-[#238447]"
                />
                <span>Available for customers to order</span>
              </label>

              <button
                type="submit"
                disabled={savingProduct}
                className="rounded-lg bg-[#238447] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1b6b38] disabled:opacity-60 transition-colors"
              >
                {savingProduct ? 'Saving...' : isNewProduct ? 'Create Food Box' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
