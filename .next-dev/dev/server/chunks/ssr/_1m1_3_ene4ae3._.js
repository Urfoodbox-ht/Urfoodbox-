module.exports = [
"[project]/firebase-applet-config.json.[json].cjs [app-ssr] (ecmascript)", ((__turbopack_context__, module, exports) => {

module.exports = {
    "projectId": "distributed-modem-mmn89",
    "appId": "1:851009050280:web:f7743a582f6dd8c5c7d49d",
    "apiKey": "AIzaSyBgwDP4kcAv4w_H6WILd7fhGGpYgJdeUWE",
    "authDomain": "distributed-modem-mmn89.firebaseapp.com",
    "firestoreDatabaseId": "ai-studio-urfoodbox-71f9c957-1da1-4bec-812c-38cf63b1b6de",
    "storageBucket": "distributed-modem-mmn89.firebasestorage.app",
    "messagingSenderId": "851009050280",
    "measurementId": "",
    "oAuthClientId": "851009050280-d7vqv584h7ugieno711nigk5e55g2bqm.apps.googleusercontent.com",
    "recaptchaSiteKey": ""
};
}),
"[project]/src/app/admin/page.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>AdminPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AdminDashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/AdminDashboard.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$translations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/i18n/translations.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
function AdminPage() {
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        try {
            const savedTheme = localStorage.getItem('ufb_theme');
            const root = document.documentElement;
            root.classList.remove('dark', 'theme-brand');
            if (savedTheme === 'dark') {
                root.classList.add('dark');
            } else if (savedTheme === 'brand') {
                root.classList.add('theme-brand');
            }
        } catch  {
        // ignore
        }
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$AdminDashboard$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AdminDashboard"], {
        onExitAdmin: ()=>router.push('/'),
        onStorefrontUpdated: async ()=>{
            router.refresh();
        },
        t: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$translations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["TRANSLATIONS"].en
    }, void 0, false, {
        fileName: "[project]/src/app/admin/page.tsx",
        lineNumber: 27,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/AdminDashboard.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AdminDashboard",
    ()=>AdminDashboard
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$totp$2d$Cx8BEadN$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__ai__as__signInWithPopup$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/node-esm/totp-Cx8BEadN.js [app-ssr] (ecmascript) <export ai as signInWithPopup>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$totp$2d$Cx8BEadN$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__ak__as__signOut$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/node-esm/totp-Cx8BEadN.js [app-ssr] (ecmascript) <export ak as signOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/arrow-left.js [app-ssr] (ecmascript) <export default as ArrowLeft>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-ssr] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye.js [app-ssr] (ecmascript) <export default as Eye>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/eye-off.js [app-ssr] (ecmascript) <export default as EyeOff>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2d$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ImagePlus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/image-plus.js [app-ssr] (ecmascript) <export default as ImagePlus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$key$2d$round$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__KeyRound$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/key-round.js [app-ssr] (ecmascript) <export default as KeyRound>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/lock.js [app-ssr] (ecmascript) <export default as Lock>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/log-out.js [app-ssr] (ecmascript) <export default as LogOut>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/message-square.js [app-ssr] (ecmascript) <export default as MessageSquare>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/package.js [app-ssr] (ecmascript) <export default as Package>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-ssr] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/refresh-cw.js [app-ssr] (ecmascript) <export default as RefreshCw>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-ssr] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/shopping-bag.js [app-ssr] (ecmascript) <export default as ShoppingBag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/star.js [app-ssr] (ecmascript) <export default as Star>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-ssr] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/upload.js [app-ssr] (ecmascript) <export default as Upload>");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fetch$2d$json$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/fetch-json.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$translations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/i18n/translations.ts [app-ssr] (ecmascript)");
'use client';
;
;
;
;
;
;
;
const ORDER_STATUSES = [
    'New',
    'Confirmed',
    'Preparing',
    'Out for delivery',
    'Delivered',
    'Cancelled'
];
const ADMIN_TOKEN_STORAGE_KEY = 'ufb_admin_token';
const ADMIN_REDIRECT_FLAG_KEY = 'ufb_admin_google_redirect';
function readStoredAdminToken() {
    try {
        return ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : null;
    } catch  {
        return null;
    }
}
function writeStoredAdminToken(token) {
    try {
        if ("TURBOPACK compile-time truthy", 1) return;
        //TURBOPACK unreachable
        ;
    } catch  {
    // ignore storage errors
    }
}
function buildAdminFetchInit(init = {}) {
    const token = readStoredAdminToken();
    const headers = new Headers(init.headers);
    if (token && !headers.has('x-admin-token')) //TURBOPACK unreachable
    ;
    return {
        ...init,
        credentials: 'include',
        headers
    };
}
const AdminDashboard = ({ onExitAdmin, onStorefrontUpdated, t })=>{
    const [adminUser, setAdminUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [checkingSession, setCheckingSession] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(true);
    // Login form state
    const [loginEmail, setLoginEmail] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [loginPassword, setLoginPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [showLoginPassword, setShowLoginPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loginLoading, setLoginLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [loginError, setLoginError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Dashboard tabs
    const [activeTab, setActiveTab] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('orders');
    // Overview data
    const [orders, setOrders] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [products, setProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [comments, setComments] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])([]);
    const [settings, setSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loadingData, setLoadingData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [toast, setToast] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Order filter
    const [statusFilter, setStatusFilter] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('ALL');
    // Daily Exchange Rate input
    const [exchangeRateInput, setExchangeRateInput] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('132.00');
    // Product Editor Modal / Inline state
    const [editingProduct, setEditingProduct] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isNewProduct, setIsNewProduct] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [pendingProductImage, setPendingProductImage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    const [savingProduct, setSavingProduct] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [uploadingImageFor, setUploadingImageFor] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(null);
    // Settings form state
    const [settingsForm, setSettingsForm] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({});
    const [savingSettings, setSavingSettings] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [uploadingLogo, setUploadingLogo] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    // Security password change
    const [currentPassword, setCurrentPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [newPassword, setNewPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [confirmPassword, setConfirmPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])('');
    const [showCurrentPassword, setShowCurrentPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showNewPassword, setShowNewPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showConfirmPassword, setShowConfirmPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const [savingPassword, setSavingPassword] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])(false);
    const toastTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    const showToast = (type, text)=>{
        if (toastTimerRef.current) {
            clearTimeout(toastTimerRef.current);
        }
        setToast({
            type,
            text
        });
        toastTimerRef.current = setTimeout(()=>{
            setToast(null);
            toastTimerRef.current = null;
        }, 4000);
    };
    const openNewBoxModal = ()=>{
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
            sortOrder: products.length + 1
        });
    };
    const loadOverview = async ()=>{
        setLoadingData(true);
        try {
            const { res, data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fetch$2d$json$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["safeFetchJson"])('/api/admin/overview', buildAdminFetchInit());
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
        } catch (err) {
            showToast('err', err.message || 'Could not refresh admin data');
        } finally{
            setLoadingData(false);
        }
    };
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        (async ()=>{
            try {
                const redirectFlag = ("TURBOPACK compile-time value", "undefined") !== 'undefined' && sessionStorage.getItem(ADMIN_REDIRECT_FLAG_KEY) === '1';
                if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
                ;
                const sessionInit = buildAdminFetchInit();
                if (__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["auth"].currentUser) {
                    try {
                        const firebaseToken = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["auth"].currentUser.getIdToken();
                        const headers = new Headers(sessionInit.headers);
                        if (!headers.has('authorization')) {
                            headers.set('Authorization', `Bearer ${firebaseToken}`);
                        }
                        sessionInit.headers = headers;
                    } catch  {
                    // Fall back to cookie / stored token
                    }
                }
                const { res, data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fetch$2d$json$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["safeFetchJson"])('/api/admin/session', sessionInit);
                if (res.ok && data.admin) {
                    setAdminUser(data.admin);
                    await loadOverview();
                }
            } catch  {
            // Not signed in yet
            } finally{
                setCheckingSession(false);
            }
        })();
    }, []);
    const handlePasswordLogin = async (e)=>{
        e.preventDefault();
        setLoginError(null);
        setLoginLoading(true);
        try {
            const { res, data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fetch$2d$json$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["safeFetchJson"])('/api/admin/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({
                    email: loginEmail.trim(),
                    password: loginPassword
                })
            });
            if (!res.ok) throw new Error(data.error || 'Login failed');
            if (data.sessionToken) writeStoredAdminToken(data.sessionToken);
            setAdminUser(data.admin);
            setLoginPassword('');
            await loadOverview();
        } catch (err) {
            setLoginError(err.message || 'Invalid email or password');
        } finally{
            setLoginLoading(false);
        }
    };
    const handleGoogleAdminLogin = async ()=>{
        setLoginError(null);
        setLoginLoading(true);
        try {
            const cred = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$totp$2d$Cx8BEadN$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__ai__as__signInWithPopup$3e$__["signInWithPopup"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["auth"], __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["googleAuthProvider"]);
            const idToken = await cred.user.getIdToken();
            const { res, data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fetch$2d$json$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["safeFetchJson"])('/api/admin/login', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${idToken}`
                },
                credentials: 'include'
            });
            if (!res.ok) throw new Error(data.error || 'Unauthorized Google account');
            if (data.sessionToken) writeStoredAdminToken(data.sessionToken);
            setAdminUser(data.admin);
            await loadOverview();
        } catch (err) {
            const code = err?.code || '';
            const isTopLevel = ("TURBOPACK compile-time value", "undefined") !== 'undefined' && window.self === window.top;
            if ("TURBOPACK compile-time falsy", 0) //TURBOPACK unreachable
            ;
            if (code !== 'auth/popup-closed-by-user') {
                setLoginError(err.message || 'Google sign-in failed');
            }
        } finally{
            setLoginLoading(false);
        }
    };
    const handleLogout = async ()=>{
        writeStoredAdminToken(null);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$totp$2d$Cx8BEadN$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__ak__as__signOut$3e$__["signOut"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["auth"]);
        } catch  {
        // Ignore Firebase client sign-out errors
        }
        try {
            await fetch('/api/admin/logout', {
                method: 'POST',
                credentials: 'include'
            });
        } catch  {
        // Ignore transient logout network errors
        }
        setAdminUser(null);
        setOrders([]);
    };
    const handleOrderStatusChange = async (orderId, status)=>{
        try {
            const { res, data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fetch$2d$json$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["safeFetchJson"])(`/api/admin/orders/${orderId}/status`, buildAdminFetchInit({
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    status
                })
            }));
            if (!res.ok) throw new Error(data.error || 'Failed to update status');
            setOrders((prev)=>prev.map((o)=>o.id === orderId ? {
                        ...o,
                        status
                    } : o));
            showToast('ok', `Order status updated to ${status}`);
        } catch (err) {
            showToast('err', err.message);
        }
    };
    const handleSaveExchangeRate = async ()=>{
        try {
            const { res, data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fetch$2d$json$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["safeFetchJson"])('/api/admin/settings', buildAdminFetchInit({
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    exchangeRateHtgPerUsd: exchangeRateInput
                })
            }));
            if (!res.ok) throw new Error(data.error || 'Failed to update exchange rate');
            setSettings(data.settings);
            setSettingsForm(data.settings);
            await onStorefrontUpdated();
            showToast('ok', `Exchange rate updated to 1 USD = ${data.settings.exchangeRateHtgPerUsd} HTG`);
        } catch (err) {
            showToast('err', err.message);
        }
    };
    const handleToggleProductAvailability = async (product)=>{
        try {
            const { res, data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fetch$2d$json$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["safeFetchJson"])(`/api/admin/products/${product.id}`, buildAdminFetchInit({
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    isAvailable: !product.isAvailable
                })
            }));
            if (!res.ok) throw new Error(data.error || 'Failed to update product');
            setProducts((prev)=>prev.map((p)=>p.id === product.id ? data.product : p));
            await onStorefrontUpdated();
            showToast('ok', `${product.nameEn} marked ${!product.isAvailable ? 'Available' : 'Unavailable'}`);
        } catch (err) {
            showToast('err', err.message);
        }
    };
    const handleSaveProduct = async (e)=>{
        e.preventDefault();
        if (!editingProduct) return;
        setSavingProduct(true);
        try {
            const url = isNewProduct ? '/api/admin/products' : `/api/admin/products/${editingProduct.id}`;
            const method = isNewProduct ? 'POST' : 'PUT';
            const { res, data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fetch$2d$json$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["safeFetchJson"])(url, buildAdminFetchInit({
                method,
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(editingProduct)
            }));
            if (!res.ok) throw new Error(data.error || 'Failed to save product');
            if (pendingProductImage && data.product?.id) {
                const formData = new FormData();
                formData.append('image', pendingProductImage);
                const { res: imgRes, data: imgData } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fetch$2d$json$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["safeFetchJson"])(`/api/admin/products/${data.product.id}/image`, buildAdminFetchInit({
                    method: 'POST',
                    body: formData
                }));
                if (!imgRes.ok) {
                    showToast('err', imgData.error || 'Box saved, but photo upload failed.');
                }
            }
            await loadOverview();
            await onStorefrontUpdated();
            setEditingProduct(null);
            setPendingProductImage(null);
            showToast('ok', isNewProduct ? 'New food box added.' : 'Food box updated.');
        } catch (err) {
            showToast('err', err.message);
        } finally{
            setSavingProduct(false);
        }
    };
    const handleDeleteProduct = async (product)=>{
        try {
            const { res, data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fetch$2d$json$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["safeFetchJson"])(`/api/admin/products/${product.id}`, buildAdminFetchInit({
                method: 'DELETE'
            }));
            if (!res.ok) {
                throw new Error(data.error || 'Failed to delete product');
            }
            setProducts((prev)=>prev.filter((p)=>p.id !== product.id));
            await onStorefrontUpdated();
            showToast('ok', `${product.nameEn} deleted.`);
        } catch (err) {
            showToast('err', err.message);
        }
    };
    const handleToggleCommentVisibility = async (comment)=>{
        try {
            const { res, data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fetch$2d$json$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["safeFetchJson"])(`/api/admin/comments/${comment.id}`, buildAdminFetchInit({
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    isVisible: !comment.isVisible
                })
            }));
            if (!res.ok) throw new Error(data.error || 'Failed to update comment');
            setComments((prev)=>prev.map((c)=>c.id === comment.id ? data.comment : c));
            await onStorefrontUpdated();
            showToast('ok', data.comment.isVisible ? 'Comment is now visible.' : 'Comment hidden.');
        } catch (err) {
            showToast('err', err.message);
        }
    };
    const handleDeleteComment = async (commentId)=>{
        try {
            const { res, data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fetch$2d$json$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["safeFetchJson"])(`/api/admin/comments/${commentId}`, buildAdminFetchInit({
                method: 'DELETE'
            }));
            if (!res.ok) {
                throw new Error(data.error || 'Failed to delete comment');
            }
            setComments((prev)=>prev.filter((c)=>c.id !== commentId));
            await onStorefrontUpdated();
            showToast('ok', 'Comment deleted.');
        } catch (err) {
            showToast('err', err.message);
        }
    };
    const handleUploadProductImage = async (productId, file)=>{
        setUploadingImageFor(productId);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const { res, data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fetch$2d$json$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["safeFetchJson"])(`/api/admin/products/${productId}/image`, buildAdminFetchInit({
                method: 'POST',
                body: formData
            }));
            if (!res.ok) throw new Error(data.error || 'Upload failed');
            setProducts((prev)=>prev.map((p)=>p.id === productId ? {
                        ...p,
                        imageUrl: `${data.imageUrl}?v=${Date.now()}`
                    } : p));
            await onStorefrontUpdated();
            showToast('ok', 'Product photograph uploaded.');
        } catch (err) {
            showToast('err', err.message);
        } finally{
            setUploadingImageFor(null);
        }
    };
    const handleRemoveProductImage = async (productId)=>{
        try {
            const { res, data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fetch$2d$json$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["safeFetchJson"])(`/api/admin/products/${productId}/image`, buildAdminFetchInit({
                method: 'DELETE'
            }));
            if (!res.ok) throw new Error(data.error || 'Could not remove image');
            setProducts((prev)=>prev.map((p)=>p.id === productId ? {
                        ...p,
                        imageUrl: null
                    } : p));
            await onStorefrontUpdated();
            showToast('ok', 'Product photograph removed.');
        } catch (err) {
            showToast('err', err.message);
        }
    };
    const handleUploadLogo = async (file)=>{
        setUploadingLogo(true);
        try {
            const formData = new FormData();
            formData.append('image', file);
            const { res, data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fetch$2d$json$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["safeFetchJson"])('/api/admin/logo', buildAdminFetchInit({
                method: 'POST',
                body: formData
            }));
            if (!res.ok) throw new Error(data.error || 'Logo upload failed');
            await loadOverview();
            await onStorefrontUpdated();
            showToast('ok', 'Business logo updated.');
        } catch (err) {
            showToast('err', err.message);
        } finally{
            setUploadingLogo(false);
        }
    };
    const handleResetLogo = async ()=>{
        try {
            const { res, data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fetch$2d$json$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["safeFetchJson"])('/api/admin/logo', buildAdminFetchInit({
                method: 'DELETE'
            }));
            if (!res.ok) throw new Error(data.error || 'Failed to reset logo');
            await loadOverview();
            await onStorefrontUpdated();
            showToast('ok', 'Restored official UrFoodBox logo.');
        } catch (err) {
            showToast('err', err.message);
        }
    };
    const handleSaveSettings = async (e)=>{
        e.preventDefault();
        setSavingSettings(true);
        try {
            const { res, data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fetch$2d$json$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["safeFetchJson"])('/api/admin/settings', buildAdminFetchInit({
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(settingsForm)
            }));
            if (!res.ok) throw new Error(data.error || 'Failed to save settings');
            setSettings(data.settings);
            setSettingsForm(data.settings);
            await onStorefrontUpdated();
            showToast('ok', 'Storefront settings & contact links saved.');
        } catch (err) {
            showToast('err', err.message);
        } finally{
            setSavingSettings(false);
        }
    };
    const handleChangePassword = async (e)=>{
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            showToast('err', 'New passwords do not match.');
            return;
        }
        setSavingPassword(true);
        try {
            const { res, data } = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$fetch$2d$json$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["safeFetchJson"])('/api/admin/change-password', buildAdminFetchInit({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword
                })
            }));
            if (!res.ok) throw new Error(data.error || 'Failed to update password');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            showToast('ok', 'Administrator password updated successfully.');
        } catch (err) {
            showToast('err', err.message);
        } finally{
            setSavingPassword(false);
        }
    };
    if (checkingSession) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex items-center justify-center bg-[var(--ufb-bg)] text-[var(--ufb-text)]",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "text-sm text-[var(--ufb-muted)]",
                children: "Verifying administrator session..."
            }, void 0, false, {
                fileName: "[project]/src/components/AdminDashboard.tsx",
                lineNumber: 639,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/AdminDashboard.tsx",
            lineNumber: 638,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    // LOGIN GATE
    if (!adminUser) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "min-h-screen flex flex-col items-center justify-center bg-[var(--ufb-bg)] text-[var(--ufb-text)] px-4 py-12",
            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-full max-w-md rounded-2xl border border-[var(--ufb-border)] bg-[var(--ufb-card)] p-7 sm:p-8 shadow-xl space-y-6",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex items-center justify-between",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: onExitAdmin,
                                className: "inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--ufb-muted)] hover:text-[#F47B20] transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 655,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Back to Storefront"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 656,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                lineNumber: 650,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-1.5 text-xs font-semibold text-[#F47B20]",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$lock$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Lock$3e$__["Lock"], {
                                        className: "h-3.5 w-3.5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 659,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Private Owner Portal"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 660,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                lineNumber: 658,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/AdminDashboard.tsx",
                        lineNumber: 649,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-1.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                className: "font-display text-2xl font-bold tracking-tight",
                                children: "UrFoodBox Owner Admin"
                            }, void 0, false, {
                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                lineNumber: 665,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                className: "text-sm text-[var(--ufb-muted)]",
                                children: "Authorized administrator access only. Sign in to manage food boxes, pricing, exchange rates, and incoming orders."
                            }, void 0, false, {
                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                lineNumber: 666,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/AdminDashboard.tsx",
                        lineNumber: 664,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handlePasswordLogin,
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-xs font-medium text-[var(--ufb-muted)] mb-1.5",
                                        children: "Administrator Email"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 673,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "email",
                                        required: true,
                                        value: loginEmail,
                                        onChange: (e)=>setLoginEmail(e.target.value),
                                        placeholder: "owner@urfoodbox.com",
                                        className: "w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3.5 py-2.5 text-sm focus:border-[#F47B20] focus:outline-none"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 676,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                lineNumber: 672,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "block text-xs font-medium text-[var(--ufb-muted)] mb-1.5",
                                        children: "Password"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 687,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "relative",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: showLoginPassword ? 'text' : 'password',
                                                required: true,
                                                value: loginPassword,
                                                onChange: (e)=>setLoginPassword(e.target.value),
                                                placeholder: "••••••••••••",
                                                className: "w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] pl-3.5 pr-10 py-2.5 text-sm focus:border-[#F47B20] focus:outline-none"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 691,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>setShowLoginPassword((prev)=>!prev),
                                                "aria-label": showLoginPassword ? 'Hide password' : 'Show password',
                                                className: "absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-[var(--ufb-muted)] hover:text-[var(--ufb-text)] transition-colors",
                                                children: showLoginPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/AdminDashboard.tsx",
                                                    lineNumber: 705,
                                                    columnNumber: 40
                                                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                    className: "h-4 w-4"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/AdminDashboard.tsx",
                                                    lineNumber: 705,
                                                    columnNumber: 73
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 699,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 690,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                lineNumber: 686,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            loginError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-lg border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-xs font-medium text-red-600 dark:text-red-400",
                                children: loginError
                            }, void 0, false, {
                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                lineNumber: 711,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "submit",
                                disabled: loginLoading,
                                className: "w-full rounded-lg bg-[#F47B20] px-5 py-3 text-sm font-semibold text-white hover:bg-[#df6912] disabled:opacity-60 transition-colors",
                                children: loginLoading ? 'Signing in...' : 'Sign In to Dashboard'
                            }, void 0, false, {
                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                lineNumber: 716,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/AdminDashboard.tsx",
                        lineNumber: 671,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative py-1",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "border-t border-[var(--ufb-border)]"
                            }, void 0, false, {
                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                lineNumber: 726,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                className: "absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-[var(--ufb-card)] px-3 text-[11px] text-[var(--ufb-muted)]",
                                children: "or"
                            }, void 0, false, {
                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                lineNumber: 727,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/AdminDashboard.tsx",
                        lineNumber: 725,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        type: "button",
                        disabled: loginLoading,
                        onClick: handleGoogleAdminLogin,
                        className: "w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-5 py-2.5 text-sm font-semibold hover:border-[#238447] hover:text-[#238447] disabled:opacity-60 transition-colors",
                        children: "Sign in with Authorized Google Account"
                    }, void 0, false, {
                        fileName: "[project]/src/components/AdminDashboard.tsx",
                        lineNumber: 732,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/AdminDashboard.tsx",
                lineNumber: 648,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        }, void 0, false, {
            fileName: "[project]/src/components/AdminDashboard.tsx",
            lineNumber: 647,
            columnNumber: 7
        }, ("TURBOPACK compile-time value", void 0));
    }
    const filteredOrders = statusFilter === 'ALL' ? orders : orders.filter((o)=>o.status === statusFilter);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "min-h-screen bg-[var(--ufb-bg)] text-[var(--ufb-text)]",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("header", {
                className: "sticky top-0 z-30 border-b border-[var(--ufb-border)] bg-[var(--ufb-card)]/95 backdrop-blur-sm",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 py-3.5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-4 min-w-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: onExitAdmin,
                                        className: "inline-flex items-center gap-1.5 rounded-lg border border-[var(--ufb-border)] px-3 py-2 text-xs font-semibold hover:border-[#F47B20] transition-colors whitespace-nowrap shrink-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$arrow$2d$left$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ArrowLeft$3e$__["ArrowLeft"], {
                                                className: "h-3.5 w-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 759,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "View Storefront"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 760,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 754,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "min-w-0",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "font-display text-base font-bold truncate",
                                                children: "UrFoodBox Owner Admin"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 763,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs text-[var(--ufb-muted)] truncate",
                                                children: adminUser.email
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 764,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 762,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                lineNumber: 753,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center gap-2.5 shrink-0",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: openNewBoxModal,
                                        className: "inline-flex items-center gap-1.5 rounded-lg bg-[#F47B20] px-3.5 py-2 text-xs font-semibold text-white hover:bg-[#df6912] transition-colors whitespace-nowrap",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                className: "h-3.5 w-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 774,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Add Box"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 775,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 769,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: loadOverview,
                                        disabled: loadingData,
                                        className: "inline-flex items-center gap-1.5 rounded-lg border border-[var(--ufb-border)] px-3 py-2 text-xs font-semibold hover:bg-[var(--ufb-surface)] transition-colors whitespace-nowrap",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$refresh$2d$cw$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__RefreshCw$3e$__["RefreshCw"], {
                                                className: `h-3.5 w-3.5 ${loadingData ? 'animate-spin' : ''}`
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 783,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "hidden sm:inline",
                                                children: "Refresh"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 784,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 777,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: handleLogout,
                                        className: "inline-flex items-center gap-1.5 rounded-lg bg-[#171717] text-white dark:bg-white dark:text-[#171717] px-3.5 py-2 text-xs font-semibold hover:opacity-90 transition-opacity whitespace-nowrap",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$log$2d$out$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__LogOut$3e$__["LogOut"], {
                                                className: "h-3.5 w-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 791,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Sign Out"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 792,
                                                columnNumber: 15
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 786,
                                        columnNumber: 13
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                lineNumber: 768,
                                columnNumber: 11
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/AdminDashboard.tsx",
                        lineNumber: 752,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4 sm:px-6 pb-3",
                        children: [
                            [
                                'orders',
                                `Orders (${orders.length})`,
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$shopping$2d$bag$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ShoppingBag$3e$__["ShoppingBag"]
                            ],
                            [
                                'products',
                                `Food Boxes & Rates (${products.length})`,
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$package$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Package$3e$__["Package"]
                            ],
                            [
                                'comments',
                                `Comments (${comments.length})`,
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$message$2d$square$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__MessageSquare$3e$__["MessageSquare"]
                            ],
                            [
                                'settings',
                                'Storefront & Contacts',
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"]
                            ],
                            [
                                'security',
                                'Security',
                                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$key$2d$round$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__KeyRound$3e$__["KeyRound"]
                            ]
                        ].map(([key, label, Icon])=>{
                            const active = activeTab === key;
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                type: "button",
                                onClick: ()=>setActiveTab(key),
                                className: `inline-flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap shrink-0 ${active ? 'bg-[#F47B20] text-white' : 'bg-[var(--ufb-surface)] text-[var(--ufb-muted)] hover:text-[var(--ufb-text)]'}`,
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(Icon, {
                                        className: "h-3.5 w-3.5"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 820,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: label
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 821,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, key, true, {
                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                lineNumber: 810,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0));
                        })
                    }, void 0, false, {
                        fileName: "[project]/src/components/AdminDashboard.tsx",
                        lineNumber: 798,
                        columnNumber: 9
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/AdminDashboard.tsx",
                lineNumber: 751,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            toast && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed bottom-5 right-5 z-50 rounded-xl border border-[var(--ufb-border)] bg-[var(--ufb-card)] px-4 py-3 shadow-xl flex items-center gap-2.5 text-sm font-medium",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        className: `h-2.5 w-2.5 rounded-full ${toast.type === 'ok' ? 'bg-[#238447]' : 'bg-red-600'}`
                    }, void 0, false, {
                        fileName: "[project]/src/components/AdminDashboard.tsx",
                        lineNumber: 831,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                        children: toast.text
                    }, void 0, false, {
                        fileName: "[project]/src/components/AdminDashboard.tsx",
                        lineNumber: 836,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/AdminDashboard.tsx",
                lineNumber: 830,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("main", {
                className: "mx-auto max-w-7xl px-4 sm:px-6 py-8",
                children: [
                    activeTab === 'orders' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap items-center justify-between gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "font-display text-xl font-bold",
                                                children: "Incoming Orders"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 846,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-[var(--ufb-muted)]",
                                                children: "Manage customer orders, verify payment methods, and update delivery statuses."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 847,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 845,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap items-center gap-1.5",
                                        children: [
                                            'ALL',
                                            ...ORDER_STATUSES
                                        ].map((st)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>setStatusFilter(st),
                                                className: `rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors whitespace-nowrap ${statusFilter === st ? 'bg-[#238447] text-white' : 'border border-[var(--ufb-border)] bg-[var(--ufb-card)] text-[var(--ufb-muted)] hover:text-[var(--ufb-text)]'}`,
                                                children: st === 'ALL' ? 'All' : st
                                            }, st, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 854,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)))
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 852,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                lineNumber: 844,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            filteredOrders.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-2xl border border-[var(--ufb-border)] bg-[var(--ufb-card)] p-12 text-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-[var(--ufb-muted)]",
                                    children: "No orders found in this view yet. When customers place an order, it appears here immediately."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/AdminDashboard.tsx",
                                    lineNumber: 872,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                lineNumber: 871,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-4",
                                children: filteredOrders.map((order)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-2xl border border-[var(--ufb-border)] bg-[var(--ufb-card)] p-5 sm:p-6 space-y-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex flex-wrap items-start justify-between gap-4 border-b border-[var(--ufb-border)] pb-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "space-y-1",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex flex-wrap items-center gap-3",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-mono-num text-base font-bold text-[#F47B20]",
                                                                        children: order.orderReference
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                        lineNumber: 886,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "text-xs text-[var(--ufb-muted)]",
                                                                        children: new Date(order.createdAt).toLocaleString()
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                        lineNumber: 889,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                lineNumber: 885,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-sm font-semibold",
                                                                children: [
                                                                    order.customerName,
                                                                    " ·",
                                                                    ' ',
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("a", {
                                                                        href: `tel:${order.customerPhone}`,
                                                                        className: "text-[#238447] hover:underline font-mono-num",
                                                                        children: order.customerPhone
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                        lineNumber: 895,
                                                                        columnNumber: 27
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                lineNumber: 893,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-sm text-[var(--ufb-muted)]",
                                                                children: [
                                                                    "Delivery: ",
                                                                    order.deliveryAddress
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                lineNumber: 899,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex flex-wrap items-center gap-3 text-xs font-semibold pt-0.5",
                                                                children: [
                                                                    order.boxPeriod && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "rounded-md bg-[#F47B20]/12 text-[#F47B20] px-2.5 py-1",
                                                                        children: [
                                                                            "Period: ",
                                                                            order.boxPeriod
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                        lineNumber: 904,
                                                                        columnNumber: 29
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    order.householdSize > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "rounded-md bg-[#238447]/12 text-[#238447] px-2.5 py-1",
                                                                        children: [
                                                                            "For: ",
                                                                            order.householdSize,
                                                                            ' ',
                                                                            order.householdSize === 1 ? 'person' : 'persons'
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                        lineNumber: 909,
                                                                        columnNumber: 29
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                lineNumber: 902,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            order.orderInstructions && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-xs text-[var(--ufb-muted)] italic",
                                                                children: [
                                                                    "Instructions: ",
                                                                    order.orderInstructions
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                lineNumber: 916,
                                                                columnNumber: 27
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 884,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-col sm:items-end gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "font-mono-num text-lg font-bold",
                                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$translations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatMoney"])(order.totalAmount, order.currency)
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                lineNumber: 923,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "text-xs text-[var(--ufb-muted)]",
                                                                children: [
                                                                    "Payment: ",
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("strong", {
                                                                        className: "text-[var(--ufb-text)]",
                                                                        children: t.paymentMethods[order.paymentMethod]
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                        lineNumber: 927,
                                                                        columnNumber: 36
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                lineNumber: 926,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("select", {
                                                                "aria-label": `Order status for ${order.orderReference}`,
                                                                value: order.status,
                                                                onChange: (e)=>handleOrderStatusChange(order.id, e.target.value),
                                                                className: "rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3 py-2 text-xs font-semibold focus:border-[#F47B20] focus:outline-none",
                                                                children: ORDER_STATUSES.map((st)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("option", {
                                                                        value: st,
                                                                        children: st
                                                                    }, st, false, {
                                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                        lineNumber: 938,
                                                                        columnNumber: 29
                                                                    }, ("TURBOPACK compile-time value", void 0)))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                lineNumber: 929,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 922,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 883,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-1.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "text-xs font-semibold text-[var(--ufb-muted)]",
                                                        children: "Ordered Products"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 947,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2",
                                                        children: order.items.map((item)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center justify-between rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3 py-2 text-xs",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-medium truncate mr-2",
                                                                        children: [
                                                                            item.productName,
                                                                            " × ",
                                                                            item.quantity
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                        lineNumber: 954,
                                                                        columnNumber: 29
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        className: "font-mono-num font-semibold shrink-0",
                                                                        children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$translations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatMoney"])(item.lineTotal, order.currency)
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                        lineNumber: 957,
                                                                        columnNumber: 29
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, item.id, true, {
                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                lineNumber: 950,
                                                                columnNumber: 27
                                                            }, ("TURBOPACK compile-time value", void 0)))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 948,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 946,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, order.id, true, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 879,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)))
                            }, void 0, false, {
                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                lineNumber: 877,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/AdminDashboard.tsx",
                        lineNumber: 843,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    activeTab === 'products' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-8",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-2xl border border-[var(--ufb-border)] bg-[var(--ufb-card)] p-5 sm:p-6 flex flex-wrap items-end justify-between gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "space-y-1 max-w-xl",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                className: "font-display text-base font-bold",
                                                children: "Daily Exchange Rate (HTG / USD)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 977,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-xs text-[var(--ufb-muted)]",
                                                children: "Set today’s exchange rate for customer display and quick price conversion. USD and HTG product prices remain independently editable."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 978,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 976,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center gap-3",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex items-center gap-2 rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3 py-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs font-semibold text-[var(--ufb-muted)]",
                                                        children: "1 USD ="
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 984,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        step: "0.01",
                                                        min: "1",
                                                        value: exchangeRateInput,
                                                        onChange: (e)=>setExchangeRateInput(e.target.value),
                                                        className: "w-24 bg-transparent font-mono-num text-sm font-bold focus:outline-none"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 985,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs font-semibold text-[var(--ufb-muted)]",
                                                        children: "HTG"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 993,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 983,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: handleSaveExchangeRate,
                                                className: "rounded-lg bg-[#238447] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#1b6b38] transition-colors whitespace-nowrap",
                                                children: "Save Rate"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 995,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 982,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                lineNumber: 975,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap items-center justify-between gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                className: "font-display text-xl font-bold",
                                                children: "Food Box Catalog"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1008,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                className: "text-sm text-[var(--ufb-muted)]",
                                                children: "Upload photos, edit multilingual descriptions, set USD & HTG prices independently, or add new boxes."
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1009,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 1007,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: openNewBoxModal,
                                        className: "inline-flex items-center gap-2 rounded-lg bg-[#F47B20] px-4 py-2.5 text-xs font-semibold text-white hover:bg-[#df6912] transition-colors whitespace-nowrap",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                                className: "h-4 w-4"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1018,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Add New Food Box"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1019,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 1013,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                lineNumber: 1006,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6",
                                children: products.map((product)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--ufb-border)] bg-[var(--ufb-card)]",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "relative aspect-[4/3] bg-[var(--ufb-surface)] border-b border-[var(--ufb-border)] flex items-center justify-center overflow-hidden",
                                                        children: product.imageUrl ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                            src: product.imageUrl,
                                                            alt: product.nameEn,
                                                            referrerPolicy: "no-referrer",
                                                            className: "h-full w-full object-cover"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/AdminDashboard.tsx",
                                                            lineNumber: 1033,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            className: "flex flex-col items-center text-center p-4",
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$image$2d$plus$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__ImagePlus$3e$__["ImagePlus"], {
                                                                    className: "h-8 w-8 text-[var(--ufb-muted)]"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                    lineNumber: 1041,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0)),
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    className: "mt-2 text-xs text-[var(--ufb-muted)]",
                                                                    children: "No photograph yet"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                    lineNumber: 1042,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/components/AdminDashboard.tsx",
                                                            lineNumber: 1040,
                                                            columnNumber: 25
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 1031,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "p-5 space-y-3",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-start justify-between gap-2",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                                        className: "font-display text-base font-bold",
                                                                        children: product.nameEn
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                        lineNumber: 1049,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                        type: "button",
                                                                        onClick: ()=>handleToggleProductAvailability(product),
                                                                        className: `text-xs font-semibold px-2.5 py-1 rounded-md border transition-colors whitespace-nowrap ${product.isAvailable ? 'border-[#238447]/30 bg-[#238447]/10 text-[#238447]' : 'border-[var(--ufb-border)] bg-[var(--ufb-surface)] text-[var(--ufb-muted)]'}`,
                                                                        children: product.isAvailable ? 'Available' : 'Unavailable'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                        lineNumber: 1050,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                lineNumber: 1048,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                                className: "text-xs text-[var(--ufb-muted)] line-clamp-2 min-h-[2rem]",
                                                                children: product.descriptionEn || 'No description added yet.'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                lineNumber: 1063,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "grid grid-cols-2 gap-2 rounded-lg bg-[var(--ufb-surface)] border border-[var(--ufb-border)] p-2.5 text-xs",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-[var(--ufb-muted)]",
                                                                                children: "USD: "
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                                lineNumber: 1069,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "font-mono-num font-bold",
                                                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$translations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatMoney"])(product.priceUsd, 'USD')
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                                lineNumber: 1070,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                        lineNumber: 1068,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                        children: [
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "text-[var(--ufb-muted)]",
                                                                                children: "HTG: "
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                                lineNumber: 1075,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                                className: "font-mono-num font-bold",
                                                                                children: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$i18n$2f$translations$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["formatMoney"])(product.priceHtg, 'HTG')
                                                                            }, void 0, false, {
                                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                                lineNumber: 1076,
                                                                                columnNumber: 27
                                                                            }, ("TURBOPACK compile-time value", void 0))
                                                                        ]
                                                                    }, void 0, true, {
                                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                        lineNumber: 1074,
                                                                        columnNumber: 25
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                lineNumber: 1067,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 1047,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1030,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "border-t border-[var(--ufb-border)] px-5 py-3.5 flex flex-wrap items-center justify-between gap-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--ufb-border)] px-3 py-1.5 text-xs font-semibold hover:border-[#F47B20] transition-colors",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                                                className: "h-3.5 w-3.5"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                lineNumber: 1086,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                children: uploadingImageFor === product.id ? 'Uploading...' : product.imageUrl ? 'Replace Photo' : 'Upload Photo'
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                lineNumber: 1087,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "file",
                                                                accept: "image/jpeg,image/png,image/webp,image/gif",
                                                                className: "hidden",
                                                                disabled: uploadingImageFor === product.id,
                                                                onChange: (e)=>{
                                                                    const file = e.target.files?.[0];
                                                                    if (file) handleUploadProductImage(product.id, file);
                                                                    e.target.value = '';
                                                                }
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                lineNumber: 1094,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 1085,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            product.imageUrl && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>handleRemoveProductImage(product.id),
                                                                className: "rounded-lg border border-[var(--ufb-border)] px-2.5 py-1.5 text-xs font-medium text-[var(--ufb-muted)] hover:text-red-600 transition-colors",
                                                                children: "Clear Photo"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                lineNumber: 1109,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>{
                                                                    setIsNewProduct(false);
                                                                    setPendingProductImage(null);
                                                                    setEditingProduct({
                                                                        ...product
                                                                    });
                                                                },
                                                                className: "rounded-lg bg-[var(--ufb-surface)] border border-[var(--ufb-border)] px-3 py-1.5 text-xs font-semibold hover:border-[#F47B20] transition-colors",
                                                                children: "Edit"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                lineNumber: 1117,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>handleDeleteProduct(product),
                                                                className: "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--ufb-border)] text-[var(--ufb-muted)] hover:text-red-600 transition-colors",
                                                                "aria-label": `Delete ${product.nameEn}`,
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                    className: "h-3.5 w-3.5"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                    lineNumber: 1134,
                                                                    columnNumber: 25
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                lineNumber: 1128,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 1107,
                                                        columnNumber: 21
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1084,
                                                columnNumber: 19
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, product.id, true, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 1026,
                                        columnNumber: 17
                                    }, ("TURBOPACK compile-time value", void 0)))
                            }, void 0, false, {
                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                lineNumber: 1024,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/AdminDashboard.tsx",
                        lineNumber: 973,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    activeTab === 'settings' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleSaveSettings,
                        className: "space-y-8 max-w-4xl",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-2xl border border-[var(--ufb-border)] bg-[var(--ufb-card)] p-6 space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-display text-lg font-bold",
                                        children: "Business Logo"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 1149,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap items-center gap-6",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "h-24 w-24 overflow-hidden rounded-xl border border-[var(--ufb-border)] bg-[#FAF5EE] p-1.5 flex items-center justify-center",
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: settings?.logoUrl || '/assets/aistudio/IMG-20261115-WA0000_6c778049_6c778049.jpg',
                                                    alt: "UrFoodBox Logo",
                                                    className: "h-full w-full object-contain"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/components/AdminDashboard.tsx",
                                                    lineNumber: 1152,
                                                    columnNumber: 19
                                                }, ("TURBOPACK compile-time value", void 0))
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1151,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2.5",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex flex-wrap items-center gap-2.5",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "inline-flex cursor-pointer items-center gap-2 rounded-lg bg-[#F47B20] px-4 py-2 text-xs font-semibold text-white hover:bg-[#df6912] transition-colors",
                                                                children: [
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                                                        className: "h-3.5 w-3.5"
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                        lineNumber: 1164,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                        children: uploadingLogo ? 'Uploading...' : 'Upload New Logo'
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                        lineNumber: 1165,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                        type: "file",
                                                                        accept: "image/jpeg,image/png,image/webp,image/gif",
                                                                        className: "hidden",
                                                                        disabled: uploadingLogo,
                                                                        onChange: (e)=>{
                                                                            const file = e.target.files?.[0];
                                                                            if (file) handleUploadLogo(file);
                                                                            e.target.value = '';
                                                                        }
                                                                    }, void 0, false, {
                                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                        lineNumber: 1166,
                                                                        columnNumber: 23
                                                                    }, ("TURBOPACK compile-time value", void 0))
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                lineNumber: 1163,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            settings?.logoImageId && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: handleResetLogo,
                                                                className: "rounded-lg border border-[var(--ufb-border)] px-3.5 py-2 text-xs font-semibold hover:border-[#F47B20] transition-colors",
                                                                children: "Restore Original Logo"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                lineNumber: 1179,
                                                                columnNumber: 23
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 1162,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-xs text-[var(--ufb-muted)]",
                                                        children: "Used in the navigation bar, hero showcase, and subtle background watermark."
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 1188,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1161,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 1150,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                lineNumber: 1148,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-2xl border border-[var(--ufb-border)] bg-[var(--ufb-card)] p-6 space-y-5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-display text-lg font-bold",
                                        children: "Social Media & Contact Settings"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 1197,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-xs font-medium text-[var(--ufb-muted)] mb-1.5",
                                                        children: "WhatsApp Telephone Number (with country code, e.g. +50934567890)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 1200,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        value: settingsForm.whatsappNumber || '',
                                                        onChange: (e)=>setSettingsForm((s)=>({
                                                                    ...s,
                                                                    whatsappNumber: e.target.value
                                                                })),
                                                        placeholder: "+509...",
                                                        className: "w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3.5 py-2.5 text-sm"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 1203,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1199,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-xs font-medium text-[var(--ufb-muted)] mb-1.5",
                                                        children: "Business Contact Email"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 1214,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "email",
                                                        value: settingsForm.contactEmail || '',
                                                        onChange: (e)=>setSettingsForm((s)=>({
                                                                    ...s,
                                                                    contactEmail: e.target.value
                                                                })),
                                                        placeholder: "contact@urfoodbox.com",
                                                        className: "w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3.5 py-2.5 text-sm"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 1217,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1213,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-xs font-medium text-[var(--ufb-muted)] mb-1.5",
                                                        children: "TikTok Profile URL"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 1228,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "url",
                                                        value: settingsForm.tiktokUrl || '',
                                                        onChange: (e)=>setSettingsForm((s)=>({
                                                                    ...s,
                                                                    tiktokUrl: e.target.value
                                                                })),
                                                        placeholder: "https://www.tiktok.com/@urfoodbox",
                                                        className: "w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3.5 py-2.5 text-sm"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 1231,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1227,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-xs font-medium text-[var(--ufb-muted)] mb-1.5",
                                                        children: "Facebook Page URL"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 1240,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "url",
                                                        value: settingsForm.facebookUrl || '',
                                                        onChange: (e)=>setSettingsForm((s)=>({
                                                                    ...s,
                                                                    facebookUrl: e.target.value
                                                                })),
                                                        placeholder: "https://www.facebook.com/urfoodbox",
                                                        className: "w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3.5 py-2.5 text-sm"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 1243,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1239,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "md:col-span-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-xs font-medium text-[var(--ufb-muted)] mb-1.5",
                                                        children: "Business Address / Service Area"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 1254,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        value: settingsForm.contactAddress || '',
                                                        onChange: (e)=>setSettingsForm((s)=>({
                                                                    ...s,
                                                                    contactAddress: e.target.value
                                                                })),
                                                        placeholder: "Port-au-Prince, Haiti",
                                                        className: "w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3.5 py-2.5 text-sm"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 1257,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1253,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 1198,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                lineNumber: 1196,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-2xl border border-[var(--ufb-border)] bg-[var(--ufb-card)] p-6 space-y-5",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-display text-lg font-bold",
                                        children: "Homepage Promotional Text"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 1272,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-1 gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-xs font-medium text-[var(--ufb-muted)] mb-1",
                                                        children: "Brand Slogan"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 1275,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "text",
                                                        value: settingsForm.slogan || '',
                                                        onChange: (e)=>setSettingsForm((s)=>({
                                                                    ...s,
                                                                    slogan: e.target.value
                                                                })),
                                                        className: "w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3.5 py-2 text-sm"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 1278,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1274,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-xs font-medium text-[var(--ufb-muted)] mb-1",
                                                                children: "Hero Headline (English)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                lineNumber: 1288,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "text",
                                                                value: settingsForm.promoTitleEn || '',
                                                                onChange: (e)=>setSettingsForm((s)=>({
                                                                            ...s,
                                                                            promoTitleEn: e.target.value
                                                                        })),
                                                                className: "w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3 py-2 text-sm"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                lineNumber: 1291,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 1287,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-xs font-medium text-[var(--ufb-muted)] mb-1",
                                                                children: "Hero Headline (French)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                lineNumber: 1301,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "text",
                                                                value: settingsForm.promoTitleFr || '',
                                                                onChange: (e)=>setSettingsForm((s)=>({
                                                                            ...s,
                                                                            promoTitleFr: e.target.value
                                                                        })),
                                                                className: "w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3 py-2 text-sm"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                lineNumber: 1304,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 1300,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-xs font-medium text-[var(--ufb-muted)] mb-1",
                                                                children: "Hero Headline (Kreyòl)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                lineNumber: 1314,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                                type: "text",
                                                                value: settingsForm.promoTitleHt || '',
                                                                onChange: (e)=>setSettingsForm((s)=>({
                                                                            ...s,
                                                                            promoTitleHt: e.target.value
                                                                        })),
                                                                className: "w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3 py-2 text-sm"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                lineNumber: 1317,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 1313,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1286,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "grid grid-cols-1 md:grid-cols-3 gap-4",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-xs font-medium text-[var(--ufb-muted)] mb-1",
                                                                children: "Hero Subtitle (English)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                lineNumber: 1330,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                                rows: 3,
                                                                value: settingsForm.promoSubtitleEn || '',
                                                                onChange: (e)=>setSettingsForm((s)=>({
                                                                            ...s,
                                                                            promoSubtitleEn: e.target.value
                                                                        })),
                                                                className: "w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3 py-2 text-sm"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                lineNumber: 1333,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 1329,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-xs font-medium text-[var(--ufb-muted)] mb-1",
                                                                children: "Hero Subtitle (French)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                lineNumber: 1343,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                                rows: 3,
                                                                value: settingsForm.promoSubtitleFr || '',
                                                                onChange: (e)=>setSettingsForm((s)=>({
                                                                            ...s,
                                                                            promoSubtitleFr: e.target.value
                                                                        })),
                                                                className: "w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3 py-2 text-sm"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                lineNumber: 1346,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 1342,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                                className: "block text-xs font-medium text-[var(--ufb-muted)] mb-1",
                                                                children: "Hero Subtitle (Kreyòl)"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                lineNumber: 1356,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                                rows: 3,
                                                                value: settingsForm.promoSubtitleHt || '',
                                                                onChange: (e)=>setSettingsForm((s)=>({
                                                                            ...s,
                                                                            promoSubtitleHt: e.target.value
                                                                        })),
                                                                className: "w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3 py-2 text-sm"
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                lineNumber: 1359,
                                                                columnNumber: 21
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 1355,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1328,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 1273,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                lineNumber: 1271,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-end",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    type: "submit",
                                    disabled: savingSettings,
                                    className: "inline-flex items-center gap-2 rounded-lg bg-[#238447] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1b6b38] disabled:opacity-60 transition-colors",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                            className: "h-4 w-4"
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/AdminDashboard.tsx",
                                            lineNumber: 1378,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0)),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            children: savingSettings ? 'Saving Settings...' : 'Save All Storefront Settings'
                                        }, void 0, false, {
                                            fileName: "[project]/src/components/AdminDashboard.tsx",
                                            lineNumber: 1379,
                                            columnNumber: 17
                                        }, ("TURBOPACK compile-time value", void 0))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/components/AdminDashboard.tsx",
                                    lineNumber: 1373,
                                    columnNumber: 15
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                lineNumber: 1372,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/AdminDashboard.tsx",
                        lineNumber: 1146,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    activeTab === 'comments' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-6",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        className: "font-display text-xl font-bold",
                                        children: "Client Comments"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 1389,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-sm text-[var(--ufb-muted)]",
                                        children: "Review feedback submitted by visitors and hide or delete comments if needed."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 1390,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                lineNumber: 1388,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            comments.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-2xl border border-[var(--ufb-border)] bg-[var(--ufb-card)] p-12 text-center",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    className: "text-sm text-[var(--ufb-muted)]",
                                    children: "No client comments have been submitted yet."
                                }, void 0, false, {
                                    fileName: "[project]/src/components/AdminDashboard.tsx",
                                    lineNumber: 1397,
                                    columnNumber: 17
                                }, ("TURBOPACK compile-time value", void 0))
                            }, void 0, false, {
                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                lineNumber: 1396,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                                children: comments.map((c)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "rounded-2xl border border-[var(--ufb-border)] bg-[var(--ufb-card)] p-5 space-y-3 flex flex-col justify-between",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "space-y-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center justify-between gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                className: "font-display text-base font-bold truncate",
                                                                children: c.authorName
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                lineNumber: 1410,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                className: "flex items-center gap-0.5 shrink-0",
                                                                children: [
                                                                    1,
                                                                    2,
                                                                    3,
                                                                    4,
                                                                    5
                                                                ].map((star)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$star$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Star$3e$__["Star"], {
                                                                        className: `h-3.5 w-3.5 ${star <= c.rating ? 'fill-[#F47B20] text-[#F47B20]' : 'text-[var(--ufb-border)]'}`
                                                                    }, star, false, {
                                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                        lineNumber: 1415,
                                                                        columnNumber: 29
                                                                    }, ("TURBOPACK compile-time value", void 0)))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                lineNumber: 1413,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 1409,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                        className: "text-sm text-[var(--ufb-muted)] leading-relaxed whitespace-pre-line",
                                                        children: c.commentText
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 1426,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1408,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "border-t border-[var(--ufb-border)] pt-3 flex items-center justify-between gap-3",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        className: "text-xs text-[var(--ufb-muted)]",
                                                        children: new Date(c.createdAt).toLocaleString()
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 1432,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        className: "flex items-center gap-2",
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>handleToggleCommentVisibility(c),
                                                                className: `inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-semibold transition-colors ${c.isVisible ? 'border-[#238447]/30 bg-[#238447]/10 text-[#238447]' : 'border-[var(--ufb-border)] bg-[var(--ufb-surface)] text-[var(--ufb-muted)]'}`,
                                                                children: c.isVisible ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                                            className: "h-3.5 w-3.5"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                            lineNumber: 1447,
                                                                            columnNumber: 31
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            children: "Visible"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                            lineNumber: 1448,
                                                                            columnNumber: 31
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                    lineNumber: 1446,
                                                                    columnNumber: 29
                                                                }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["Fragment"], {
                                                                    children: [
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                                                                            className: "h-3.5 w-3.5"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                            lineNumber: 1452,
                                                                            columnNumber: 31
                                                                        }, ("TURBOPACK compile-time value", void 0)),
                                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                            children: "Hidden"
                                                                        }, void 0, false, {
                                                                            fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                            lineNumber: 1453,
                                                                            columnNumber: 31
                                                                        }, ("TURBOPACK compile-time value", void 0))
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                    lineNumber: 1451,
                                                                    columnNumber: 29
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                lineNumber: 1436,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0)),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                                type: "button",
                                                                onClick: ()=>handleDeleteComment(c.id),
                                                                className: "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[var(--ufb-border)] text-[var(--ufb-muted)] hover:text-red-600 transition-colors",
                                                                "aria-label": `Delete comment by ${c.authorName}`,
                                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                                    className: "h-3.5 w-3.5"
                                                                }, void 0, false, {
                                                                    fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                    lineNumber: 1463,
                                                                    columnNumber: 27
                                                                }, ("TURBOPACK compile-time value", void 0))
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                                lineNumber: 1457,
                                                                columnNumber: 25
                                                            }, ("TURBOPACK compile-time value", void 0))
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 1435,
                                                        columnNumber: 23
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1431,
                                                columnNumber: 21
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, c.id, true, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 1404,
                                        columnNumber: 19
                                    }, ("TURBOPACK compile-time value", void 0)))
                            }, void 0, false, {
                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                lineNumber: 1402,
                                columnNumber: 15
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/AdminDashboard.tsx",
                        lineNumber: 1387,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    activeTab === 'security' && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "max-w-lg rounded-2xl border border-[var(--ufb-border)] bg-[var(--ufb-card)] p-6 space-y-5",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-display text-lg font-bold",
                                        children: "Administrator Password"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 1478,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-[var(--ufb-muted)] mt-1",
                                        children: "Update the private password used for owner dashboard login. Public admin registration is permanently disabled."
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 1479,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                lineNumber: 1477,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                                onSubmit: handleChangePassword,
                                className: "space-y-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-xs font-medium text-[var(--ufb-muted)] mb-1",
                                                children: "Current Password"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1485,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: showCurrentPassword ? 'text' : 'password',
                                                        required: true,
                                                        value: currentPassword,
                                                        onChange: (e)=>setCurrentPassword(e.target.value),
                                                        className: "w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] pl-3.5 pr-10 py-2.5 text-sm"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 1489,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>setShowCurrentPassword((prev)=>!prev),
                                                        "aria-label": showCurrentPassword ? 'Hide current password' : 'Show current password',
                                                        className: "absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-[var(--ufb-muted)] hover:text-[var(--ufb-text)] transition-colors",
                                                        children: showCurrentPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/AdminDashboard.tsx",
                                                            lineNumber: 1502,
                                                            columnNumber: 44
                                                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/AdminDashboard.tsx",
                                                            lineNumber: 1502,
                                                            columnNumber: 77
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 1496,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1488,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 1484,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-xs font-medium text-[var(--ufb-muted)] mb-1",
                                                children: "New Password (min 8 characters)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1507,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: showNewPassword ? 'text' : 'password',
                                                        required: true,
                                                        minLength: 8,
                                                        value: newPassword,
                                                        onChange: (e)=>setNewPassword(e.target.value),
                                                        className: "w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] pl-3.5 pr-10 py-2.5 text-sm"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 1511,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>setShowNewPassword((prev)=>!prev),
                                                        "aria-label": showNewPassword ? 'Hide new password' : 'Show new password',
                                                        className: "absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-[var(--ufb-muted)] hover:text-[var(--ufb-text)] transition-colors",
                                                        children: showNewPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/AdminDashboard.tsx",
                                                            lineNumber: 1525,
                                                            columnNumber: 40
                                                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/AdminDashboard.tsx",
                                                            lineNumber: 1525,
                                                            columnNumber: 73
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 1519,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1510,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 1506,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-xs font-medium text-[var(--ufb-muted)] mb-1",
                                                children: "Confirm New Password"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1530,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "relative",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: showConfirmPassword ? 'text' : 'password',
                                                        required: true,
                                                        minLength: 8,
                                                        value: confirmPassword,
                                                        onChange: (e)=>setConfirmPassword(e.target.value),
                                                        className: "w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] pl-3.5 pr-10 py-2.5 text-sm"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 1534,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        type: "button",
                                                        onClick: ()=>setShowConfirmPassword((prev)=>!prev),
                                                        "aria-label": showConfirmPassword ? 'Hide confirm password' : 'Show confirm password',
                                                        className: "absolute right-2.5 top-1/2 -translate-y-1/2 rounded p-1 text-[var(--ufb-muted)] hover:text-[var(--ufb-text)] transition-colors",
                                                        children: showConfirmPassword ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2d$off$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__EyeOff$3e$__["EyeOff"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/AdminDashboard.tsx",
                                                            lineNumber: 1548,
                                                            columnNumber: 44
                                                        }, ("TURBOPACK compile-time value", void 0)) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$eye$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Eye$3e$__["Eye"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/components/AdminDashboard.tsx",
                                                            lineNumber: 1548,
                                                            columnNumber: 77
                                                        }, ("TURBOPACK compile-time value", void 0))
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 1542,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1533,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 1529,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        disabled: savingPassword,
                                        className: "rounded-lg bg-[#F47B20] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#df6912] disabled:opacity-60 transition-colors",
                                        children: savingPassword ? 'Updating...' : 'Update Password'
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 1552,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                lineNumber: 1483,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/AdminDashboard.tsx",
                        lineNumber: 1476,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/AdminDashboard.tsx",
                lineNumber: 840,
                columnNumber: 7
            }, ("TURBOPACK compile-time value", void 0)),
            editingProduct && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "fixed inset-0 z-50 flex items-center justify-center p-4",
                role: "dialog",
                "aria-modal": "true",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "fixed inset-0 bg-black/60 backdrop-blur-[2px]",
                        onClick: ()=>setEditingProduct(null)
                    }, void 0, false, {
                        fileName: "[project]/src/components/AdminDashboard.tsx",
                        lineNumber: 1567,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0)),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("form", {
                        onSubmit: handleSaveProduct,
                        className: "relative z-10 max-h-[90dvh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-[var(--ufb-border)] bg-[var(--ufb-card)] p-5 sm:p-6 pb-[calc(1.5rem+env(safe-area-inset-bottom))] space-y-5 shadow-2xl",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex items-center justify-between border-b border-[var(--ufb-border)] pb-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                        className: "font-display text-lg font-bold",
                                        children: isNewProduct ? 'Add New Food Box' : `Edit ${editingProduct.nameEn}`
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 1576,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "button",
                                        onClick: ()=>setEditingProduct(null),
                                        className: "text-xs font-semibold text-[var(--ufb-muted)] hover:text-[var(--ufb-text)]",
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 1579,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                lineNumber: 1575,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-3 gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-xs font-medium text-[var(--ufb-muted)] mb-1",
                                                children: "Name (English) *"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1590,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                required: true,
                                                value: editingProduct.nameEn || '',
                                                onChange: (e)=>setEditingProduct((p)=>({
                                                            ...p,
                                                            nameEn: e.target.value
                                                        })),
                                                className: "w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3 py-2 text-sm"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1593,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 1589,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-xs font-medium text-[var(--ufb-muted)] mb-1",
                                                children: "Name (French)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1604,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: editingProduct.nameFr || '',
                                                onChange: (e)=>setEditingProduct((p)=>({
                                                            ...p,
                                                            nameFr: e.target.value
                                                        })),
                                                className: "w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3 py-2 text-sm"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1607,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 1603,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-xs font-medium text-[var(--ufb-muted)] mb-1",
                                                children: "Name (Kreyòl)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1617,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                value: editingProduct.nameHt || '',
                                                onChange: (e)=>setEditingProduct((p)=>({
                                                            ...p,
                                                            nameHt: e.target.value
                                                        })),
                                                className: "w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3 py-2 text-sm"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1620,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 1616,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                lineNumber: 1588,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "grid grid-cols-1 md:grid-cols-3 gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-xs font-medium text-[var(--ufb-muted)] mb-1",
                                                children: "Description (English)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1633,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                rows: 3,
                                                value: editingProduct.descriptionEn || '',
                                                onChange: (e)=>setEditingProduct((p)=>({
                                                            ...p,
                                                            descriptionEn: e.target.value
                                                        })),
                                                className: "w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3 py-2 text-sm"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1636,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 1632,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-xs font-medium text-[var(--ufb-muted)] mb-1",
                                                children: "Description (French)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1646,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                rows: 3,
                                                value: editingProduct.descriptionFr || '',
                                                onChange: (e)=>setEditingProduct((p)=>({
                                                            ...p,
                                                            descriptionFr: e.target.value
                                                        })),
                                                className: "w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3 py-2 text-sm"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1649,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 1645,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                className: "block text-xs font-medium text-[var(--ufb-muted)] mb-1",
                                                children: "Description (Kreyòl)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1659,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                                rows: 3,
                                                value: editingProduct.descriptionHt || '',
                                                onChange: (e)=>setEditingProduct((p)=>({
                                                            ...p,
                                                            descriptionHt: e.target.value
                                                        })),
                                                className: "w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-surface)] px-3 py-2 text-sm"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1662,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 1658,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                lineNumber: 1631,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border border-[var(--ufb-border)] bg-[var(--ufb-surface)] p-4 space-y-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex flex-wrap items-center justify-between gap-2",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-xs font-semibold",
                                                children: "Independent Pricing (USD & HTG)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1676,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                type: "button",
                                                onClick: ()=>{
                                                    const usd = Number(editingProduct.priceUsd) || 0;
                                                    const rate = Number(exchangeRateInput) || 132;
                                                    setEditingProduct((p)=>({
                                                            ...p,
                                                            priceHtg: (usd * rate).toFixed(2)
                                                        }));
                                                },
                                                className: "text-xs font-semibold text-[#F47B20] hover:underline",
                                                children: [
                                                    "Apply Rate (× ",
                                                    exchangeRateInput,
                                                    ") to HTG"
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1677,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 1675,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "grid grid-cols-2 gap-4",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-xs text-[var(--ufb-muted)] mb-1",
                                                        children: "Price (USD)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 1694,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        step: "0.01",
                                                        min: "0",
                                                        value: editingProduct.priceUsd ?? '0.00',
                                                        onChange: (e)=>setEditingProduct((p)=>({
                                                                    ...p,
                                                                    priceUsd: e.target.value
                                                                })),
                                                        className: "w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-card)] px-3 py-2 font-mono-num text-sm"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 1695,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1693,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                        className: "block text-xs text-[var(--ufb-muted)] mb-1",
                                                        children: "Price (HTG)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 1707,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0)),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "number",
                                                        step: "0.01",
                                                        min: "0",
                                                        value: editingProduct.priceHtg ?? '0.00',
                                                        onChange: (e)=>setEditingProduct((p)=>({
                                                                    ...p,
                                                                    priceHtg: e.target.value
                                                                })),
                                                        className: "w-full rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-card)] px-3 py-2 font-mono-num text-sm"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                                        lineNumber: 1708,
                                                        columnNumber: 19
                                                    }, ("TURBOPACK compile-time value", void 0))
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1706,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 1692,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                lineNumber: 1674,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "rounded-xl border border-[var(--ufb-border)] bg-[var(--ufb-surface)] p-4 flex flex-wrap items-center justify-between gap-3",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-xs font-semibold",
                                                children: "Box Photograph (Optional)"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1724,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "text-[11px] text-[var(--ufb-muted)]",
                                                children: pendingProductImage ? `Selected: ${pendingProductImage.name}` : 'JPG, PNG, WEBP, or GIF up to 4.5 MB'
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1725,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 1723,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[var(--ufb-border)] bg-[var(--ufb-card)] px-3.5 py-2 text-xs font-semibold hover:border-[#F47B20] transition-colors",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$upload$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__default__as__Upload$3e$__["Upload"], {
                                                className: "h-3.5 w-3.5"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1732,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: pendingProductImage ? 'Change Photo' : 'Choose Photo'
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1733,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "file",
                                                accept: "image/jpeg,image/png,image/webp,image/gif",
                                                className: "hidden",
                                                onChange: (e)=>{
                                                    const file = e.target.files?.[0] || null;
                                                    setPendingProductImage(file);
                                                    e.target.value = '';
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1734,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 1731,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                lineNumber: 1722,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0)),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex flex-wrap items-center justify-between gap-4",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "inline-flex items-center gap-2 text-sm font-medium cursor-pointer",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "checkbox",
                                                checked: Boolean(editingProduct.isAvailable),
                                                onChange: (e)=>setEditingProduct((p)=>({
                                                            ...p,
                                                            isAvailable: e.target.checked
                                                        })),
                                                className: "h-4 w-4 accent-[#238447]"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1749,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0)),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                children: "Available for customers to order"
                                            }, void 0, false, {
                                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                                lineNumber: 1757,
                                                columnNumber: 17
                                            }, ("TURBOPACK compile-time value", void 0))
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 1748,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0)),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        type: "submit",
                                        disabled: savingProduct,
                                        className: "rounded-lg bg-[#238447] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#1b6b38] disabled:opacity-60 transition-colors",
                                        children: savingProduct ? 'Saving...' : isNewProduct ? 'Create Food Box' : 'Save Changes'
                                    }, void 0, false, {
                                        fileName: "[project]/src/components/AdminDashboard.tsx",
                                        lineNumber: 1760,
                                        columnNumber: 15
                                    }, ("TURBOPACK compile-time value", void 0))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/components/AdminDashboard.tsx",
                                lineNumber: 1747,
                                columnNumber: 13
                            }, ("TURBOPACK compile-time value", void 0))
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/components/AdminDashboard.tsx",
                        lineNumber: 1571,
                        columnNumber: 11
                    }, ("TURBOPACK compile-time value", void 0))
                ]
            }, void 0, true, {
                fileName: "[project]/src/components/AdminDashboard.tsx",
                lineNumber: 1566,
                columnNumber: 9
            }, ("TURBOPACK compile-time value", void 0))
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/AdminDashboard.tsx",
        lineNumber: 749,
        columnNumber: 5
    }, ("TURBOPACK compile-time value", void 0));
};
}),
"[project]/src/i18n/translations.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "TRANSLATIONS",
    ()=>TRANSLATIONS,
    "formatMoney",
    ()=>formatMoney,
    "getLocalizedProductDescription",
    ()=>getLocalizedProductDescription,
    "getLocalizedProductName",
    ()=>getLocalizedProductName
]);
const TRANSLATIONS = {
    en: {
        nav: {
            boxes: 'Food Boxes',
            delivery: 'Delivery',
            customBox: 'Build Your Own Box',
            trackOrder: 'Track Order',
            cart: 'Cart',
            account: 'Account',
            admin: 'Owner Admin'
        },
        themes: {
            label: 'Theme',
            light: 'Light',
            dark: 'Dark',
            brand: 'Brand'
        },
        languages: {
            en: 'EN',
            fr: 'FR',
            ht: 'Kreyòl'
        },
        hero: {
            exploreCta: 'Explore Our Food Boxes',
            customCta: 'Build Your Own Box',
            exchangeRateLabel: 'Today’s Rate',
            guestNote: 'Order directly as a guest — no account required.'
        },
        catalog: {
            heading: 'Our Food Boxes',
            subheading: 'Select a box, view details in USD or HTG, and submit your order in seconds.',
            available: 'Available',
            unavailable: 'Currently Unavailable',
            noPhotoYet: 'Photo placeholder — customizable in Admin',
            noDescriptionYet: 'Box contents and details can be configured by the store owner.',
            viewDetails: 'View Details',
            addToCart: 'Add to Cart',
            addedToCart: 'Added',
            priceNote: 'Select USD or HTG at the top or in your cart',
            emptyCatalog: 'No food boxes are listed right now.',
            loading: 'Loading food boxes...',
            errorLoad: 'Could not load storefront catalog.',
            retry: 'Try Again'
        },
        productModal: {
            close: 'Close',
            quantity: 'Quantity',
            usdPrice: 'Price (USD)',
            htgPrice: 'Price (HTG)',
            availability: 'Status',
            addToCart: 'Add to Cart'
        },
        delivery: {
            heading: 'How UrFoodBox Delivery Works',
            subheading: 'Simple, dependable grocery delivery — Machew devan pot kay ou.',
            step1Title: '01. Choose Your Food Box',
            step1Desc: 'Browse our curated food boxes or request a custom grocery package tailored to your household.',
            step2Title: '02. Checkout Without Friction',
            step2Desc: 'Enter your name, phone, and delivery address, then pick Cash on Delivery, Wire, MonCash, or Natcash.',
            step3Title: '03. Doorstep Delivery',
            step3Desc: 'Track your order reference while our team prepares and delivers your groceries directly to your door.'
        },
        customBox: {
            heading: 'Build Your Own Box',
            subheading: 'Want specific groceries or a custom family package?',
            description: 'Tell us exactly which items and quantities you need. Chat directly with the UrFoodBox team on WhatsApp to customize your order.',
            whatsappCta: 'Order Custom Box on WhatsApp',
            whatsappNotConfigured: 'WhatsApp number can be configured by the owner in Admin Settings.',
            whatsappPrefill: 'Hello UrFoodBox! I would like to build a custom grocery box.'
        },
        tracker: {
            heading: 'Track Your Order',
            subheading: 'Enter the unique order reference you received at checkout.',
            placeholder: 'e.g. UFB-20261115-A1B2C3',
            button: 'Check Status',
            searching: 'Checking...',
            notFound: 'No order found with that reference.',
            reference: 'Reference',
            status: 'Status',
            total: 'Total',
            date: 'Order Date',
            items: 'Items'
        },
        cart: {
            title: 'Your Cart & Checkout',
            emptyTitle: 'Your cart is empty',
            emptyDesc: 'Add a food box from our catalog to begin your order.',
            browseBoxes: 'Explore Food Boxes',
            currencyLabel: 'Display & Order Currency',
            subtotal: 'Subtotal',
            total: 'Total',
            remove: 'Remove',
            checkoutTitle: 'Delivery & Payment Details',
            guestBadge: 'Guest checkout — no sign-up needed',
            fullName: 'Full Name',
            fullNamePlaceholder: 'Enter your full name',
            phone: 'Phone Number',
            phonePlaceholder: '+509 ...',
            address: 'Delivery Address',
            addressPlaceholder: 'Street, neighborhood, landmark...',
            instructions: 'Order Instructions (Optional)',
            instructionsPlaceholder: 'Gate code, preferred delivery time, notes...',
            boxPeriodLabel: 'How long do you need this food box for?',
            periodUnitLabel: 'Time unit',
            periodCountLabel: 'Number (1–5)',
            periodPresets: {
                weekSingular: 'Week',
                weekPlural: 'Weeks',
                monthSingular: 'Month',
                monthPlural: 'Months'
            },
            householdSizeLabel: 'For how many persons?',
            personsUnit: 'persons',
            personSingular: 'person',
            periodAndPersonsError: 'Please choose how long you need the food box for and how many persons it is for.',
            paymentMethod: 'Payment Method',
            submitOrder: 'Submit Order',
            submitting: 'Submitting Order...',
            savedAddressUse: 'Saved addresses:',
            validationError: 'Please fill in your full name, phone number, and delivery address.',
            confirmationTitle: 'Order Submitted Successfully',
            confirmationSubtitle: 'Thank you for ordering with UrFoodBox. Save your reference below to track your delivery.',
            orderRefLabel: 'Order Reference',
            paymentSelected: 'Payment Method',
            continueShopping: 'Continue Shopping'
        },
        paymentMethods: {
            cash_on_delivery: 'Cash on Delivery',
            wire: 'Bank Wire Transfer',
            moncash: 'MonCash',
            natcash: 'Natcash'
        },
        orderStatuses: {
            New: 'New',
            Confirmed: 'Confirmed',
            Preparing: 'Preparing',
            'Out for delivery': 'Out for delivery',
            Delivered: 'Delivered',
            Cancelled: 'Cancelled'
        },
        account: {
            title: 'Customer Account (Optional)',
            subtitle: 'Save delivery addresses, view past orders, and register interest for upcoming grocery subscriptions.',
            signInGoogle: 'Continue with Google',
            signingIn: 'Signing in...',
            signOut: 'Sign Out',
            guestReminder: 'Creating an account is completely optional. You can always check out as a guest.',
            tabProfile: 'Profile & Addresses',
            tabOrders: 'Order History',
            tabSubscriptions: 'Subscriptions',
            fullName: 'Full Name',
            phone: 'Phone Number',
            defaultAddress: 'Default Delivery Address',
            saveProfile: 'Save Profile',
            saving: 'Saving...',
            savedSuccess: 'Profile updated.',
            savedAddressesTitle: 'Saved Delivery Addresses',
            addAddressLabel: 'Add Another Address',
            addressLabelPlaceholder: 'Label (e.g. Home, Office)',
            addressTextPlaceholder: 'Full street address',
            addAddressBtn: 'Add Address',
            noOrders: 'No orders linked to this account yet.',
            subTitle: 'Grocery Subscription Preferences',
            subNotice: 'Recurring payments are not yet activated until an online payment provider is configured. You can save your weekly or monthly delivery preference below.',
            subFrequency: 'Delivery Frequency',
            weekly: 'Weekly',
            monthly: 'Monthly',
            subDay: 'Preferred Delivery Day',
            subBox: 'Preferred Food Box',
            subNotes: 'Preference Notes',
            subSaveBtn: 'Save Subscription Preference',
            subSaved: 'Subscription preference saved to waitlist.',
            subStatusWaitlist: 'Waitlist (No billing active)',
            subStatusPaused: 'Paused',
            subStatusCancelled: 'Cancelled'
        },
        comments: {
            heading: 'Client Comments & Reviews',
            subheading: 'Share your experience with UrFoodBox or read what other families say.',
            nameLabel: 'Your Name',
            namePlaceholder: 'Enter your name',
            ratingLabel: 'Rating',
            commentLabel: 'Your Comment',
            commentPlaceholder: 'Tell us about your food box or delivery experience...',
            submitBtn: 'Post Comment',
            submitting: 'Posting...',
            successMsg: 'Thank you! Your comment has been posted.',
            validationError: 'Please enter your name and a comment (at least 3 characters).',
            emptyState: 'No comments yet. Be the first client to share your feedback.'
        },
        footer: {
            tagline: 'Machew devan pot kay ou.',
            contactTitle: 'Contact',
            socialTitle: 'Social Media',
            linksTitle: 'Quick Links',
            adminLink: 'Owner Admin Dashboard',
            whatsappLabel: 'WhatsApp',
            rights: 'All rights reserved.'
        }
    },
    fr: {
        nav: {
            boxes: 'Paniers',
            delivery: 'Livraison',
            customBox: 'Créer Mon Panier',
            trackOrder: 'Suivre Commande',
            cart: 'Panier',
            account: 'Compte',
            admin: 'Admin Propriétaire'
        },
        themes: {
            label: 'Thème',
            light: 'Clair',
            dark: 'Sombre',
            brand: 'Marque'
        },
        languages: {
            en: 'EN',
            fr: 'FR',
            ht: 'Kreyòl'
        },
        hero: {
            exploreCta: 'Découvrir Nos Paniers',
            customCta: 'Créer Mon Panier',
            exchangeRateLabel: 'Taux du Jour',
            guestNote: 'Commandez directement sans créer de compte.'
        },
        catalog: {
            heading: 'Nos Paniers Alimentaires',
            subheading: 'Choisissez un panier, consultez les prix en USD ou HTG et passez votre commande en quelques secondes.',
            available: 'Disponible',
            unavailable: 'Indisponible',
            noPhotoYet: 'Emplacement photo — modifiable dans l’Admin',
            noDescriptionYet: 'Le contenu et les détails peuvent être configurés par le propriétaire.',
            viewDetails: 'Voir Détails',
            addToCart: 'Ajouter au Panier',
            addedToCart: 'Ajouté',
            priceNote: 'Choisissez USD ou HTG en haut ou dans votre panier',
            emptyCatalog: 'Aucun panier alimentaire disponible pour le moment.',
            loading: 'Chargement des paniers...',
            errorLoad: 'Impossible de charger le catalogue.',
            retry: 'Réessayer'
        },
        productModal: {
            close: 'Fermer',
            quantity: 'Quantité',
            usdPrice: 'Prix (USD)',
            htgPrice: 'Prix (HTG)',
            availability: 'Disponibilité',
            addToCart: 'Ajouter au Panier'
        },
        delivery: {
            heading: 'Comment Fonctionne la Livraison',
            subheading: 'Une livraison d’épicerie fiable et simple — Machew devan pot kay ou.',
            step1Title: '01. Choisissez Votre Panier',
            step1Desc: 'Parcourez nos paniers alimentaires ou demandez un panier sur mesure adapté à votre foyer.',
            step2Title: '02. Commande Sans Inscription',
            step2Desc: 'Saisissez votre nom, téléphone et adresse, puis choisissez Paiement à la livraison, Virement, MonCash ou Natcash.',
            step3Title: '03. Livraison à Domicile',
            step3Desc: 'Suivez votre référence de commande pendant que notre équipe prépare et livre vos courses chez vous.'
        },
        customBox: {
            heading: 'Créer Votre Propre Panier',
            subheading: 'Vous souhaitez des produits spécifiques ou un colis personnalisé ?',
            description: 'Indiquez-nous exactement les articles et quantités souhaités. Discutez directement avec l’équipe UrFoodBox sur WhatsApp.',
            whatsappCta: 'Commander sur WhatsApp',
            whatsappNotConfigured: 'Le numéro WhatsApp peut être configuré par le propriétaire dans les paramètres Admin.',
            whatsappPrefill: 'Bonjour UrFoodBox ! Je souhaite composer un panier d’épicerie personnalisé.'
        },
        tracker: {
            heading: 'Suivre Votre Commande',
            subheading: 'Entrez la référence unique reçue lors de la confirmation.',
            placeholder: 'ex. UFB-20261115-A1B2C3',
            button: 'Vérifier Statut',
            searching: 'Recherche...',
            notFound: 'Aucune commande trouvée avec cette référence.',
            reference: 'Référence',
            status: 'Statut',
            total: 'Total',
            date: 'Date',
            items: 'Articles'
        },
        cart: {
            title: 'Votre Panier & Commande',
            emptyTitle: 'Votre panier est vide',
            emptyDesc: 'Ajoutez un panier alimentaire depuis notre catalogue pour commander.',
            browseBoxes: 'Voir les Paniers',
            currencyLabel: 'Devise d’affichage et de commande',
            subtotal: 'Sous-total',
            total: 'Total',
            remove: 'Retirer',
            checkoutTitle: 'Coordonnées de Livraison & Paiement',
            guestBadge: 'Commande invité — aucune inscription requise',
            fullName: 'Nom Complet',
            fullNamePlaceholder: 'Votre nom complet',
            phone: 'Numéro de Téléphone',
            phonePlaceholder: '+509 ...',
            address: 'Adresse de Livraison',
            addressPlaceholder: 'Rue, quartier, repère...',
            instructions: 'Instructions (Optionnel)',
            instructionsPlaceholder: 'Code d’accès, horaire souhaité, remarques...',
            boxPeriodLabel: 'Pour combien de temps souhaitez-vous ce panier ?',
            periodUnitLabel: 'Unité',
            periodCountLabel: 'Nombre (1–5)',
            periodPresets: {
                weekSingular: 'Semaine',
                weekPlural: 'Semaines',
                monthSingular: 'Mois',
                monthPlural: 'Mois'
            },
            householdSizeLabel: 'Pour combien de personnes ?',
            personsUnit: 'personnes',
            personSingular: 'personne',
            periodAndPersonsError: 'Veuillez indiquer la durée souhaitée et le nombre de personnes.',
            paymentMethod: 'Mode de Paiement',
            submitOrder: 'Confirmer la Commande',
            submitting: 'Envoi en cours...',
            savedAddressUse: 'Adresses enregistrées :',
            validationError: 'Veuillez renseigner votre nom, téléphone et adresse de livraison.',
            confirmationTitle: 'Commande Envoyée avec Succès',
            confirmationSubtitle: 'Merci d’avoir commandé chez UrFoodBox. Conservez votre référence pour suivre la livraison.',
            orderRefLabel: 'Référence de Commande',
            paymentSelected: 'Mode de Paiement',
            continueShopping: 'Continuer vos Achats'
        },
        paymentMethods: {
            cash_on_delivery: 'Paiement à la livraison',
            wire: 'Virement bancaire',
            moncash: 'MonCash',
            natcash: 'Natcash'
        },
        orderStatuses: {
            New: 'Nouvelle',
            Confirmed: 'Confirmée',
            Preparing: 'En préparation',
            'Out for delivery': 'En cours de livraison',
            Delivered: 'Livrée',
            Cancelled: 'Annulée'
        },
        account: {
            title: 'Compte Client (Optionnel)',
            subtitle: 'Enregistrez vos adresses, consultez vos commandes et préparez vos préférences d’abonnement.',
            signInGoogle: 'Continuer avec Google',
            signingIn: 'Connexion...',
            signOut: 'Déconnexion',
            guestReminder: 'La création d’un compte est entièrement facultative. Vous pouvez toujours commander en tant qu’invité.',
            tabProfile: 'Profil & Adresses',
            tabOrders: 'Historique',
            tabSubscriptions: 'Abonnements',
            fullName: 'Nom Complet',
            phone: 'Téléphone',
            defaultAddress: 'Adresse par Défaut',
            saveProfile: 'Enregistrer',
            saving: 'Enregistrement...',
            savedSuccess: 'Profil mis à jour.',
            savedAddressesTitle: 'Adresses Enregistrées',
            addAddressLabel: 'Ajouter une Adresse',
            addressLabelPlaceholder: 'Libellé (ex. Maison, Bureau)',
            addressTextPlaceholder: 'Adresse complète',
            addAddressBtn: 'Ajouter',
            noOrders: 'Aucune commande associée à ce compte pour le moment.',
            subTitle: 'Préférences d’Abonnement Épicerie',
            subNotice: 'Les paiements récurrents ne sont pas encore activés tant qu’un prestataire de paiement n’est pas configuré. Enregistrez vos préférences ci-dessous.',
            subFrequency: 'Fréquence',
            weekly: 'Hebdomadaire',
            monthly: 'Mensuel',
            subDay: 'Jour de Livraison Souhaité',
            subBox: 'Panier Souhaité',
            subNotes: 'Notes',
            subSaveBtn: 'Enregistrer la Préférence',
            subSaved: 'Préférence enregistrée sur la liste d’attente.',
            subStatusWaitlist: 'Liste d’attente (Sans facturation)',
            subStatusPaused: 'En pause',
            subStatusCancelled: 'Annulé'
        },
        comments: {
            heading: 'Commentaires & Avis Clients',
            subheading: 'Partagez votre expérience avec UrFoodBox ou lisez les avis d’autres familles.',
            nameLabel: 'Votre Nom',
            namePlaceholder: 'Entrez votre nom',
            ratingLabel: 'Note',
            commentLabel: 'Votre Commentaire',
            commentPlaceholder: 'Parlez-nous de votre panier ou de votre livraison...',
            submitBtn: 'Publier le Commentaire',
            submitting: 'Envoi...',
            successMsg: 'Merci ! Votre commentaire a été publié.',
            validationError: 'Veuillez saisir votre nom et un commentaire (au moins 3 caractères).',
            emptyState: 'Aucun commentaire pour le moment. Soyez le premier client à donner votre avis.'
        },
        footer: {
            tagline: 'Machew devan pot kay ou.',
            contactTitle: 'Contact',
            socialTitle: 'Réseaux Sociaux',
            linksTitle: 'Liens Rapides',
            adminLink: 'Tableau de Bord Propriétaire',
            whatsappLabel: 'WhatsApp',
            rights: 'Tous droits réservés.'
        }
    },
    ht: {
        nav: {
            boxes: 'Bwat Pwovizyon',
            delivery: 'Livrezon',
            customBox: 'Fè Bwat Pa Ou',
            trackOrder: 'Swiv Kòmand',
            cart: 'Panye',
            account: 'Kont',
            admin: 'Espas Pwopriyetè'
        },
        themes: {
            label: 'Tèm',
            light: 'Klè',
            dark: 'Nwa',
            brand: 'Mak'
        },
        languages: {
            en: 'EN',
            fr: 'FR',
            ht: 'Kreyòl'
        },
        hero: {
            exploreCta: 'Dekouvri Bwat Pwovizyon Nou Yo',
            customCta: 'Fè Bwat Pa Ou',
            exchangeRateLabel: 'To Jounen an',
            guestNote: 'Kòmande dirèkteman san ou pa bezwen kreye kont.'
        },
        catalog: {
            heading: 'Bwat Pwovizyon Nou Yo',
            subheading: 'Chwazi yon bwat, gade pri an USD oswa HTG, epi voye kòmand ou byen vit.',
            available: 'Disponib',
            unavailable: 'Pa Disponib Kounye a',
            noPhotoYet: 'Espas foto — pwopriyetè a ka ajoute foto nan Admin',
            noDescriptionYet: 'Pwopriyetè a ka ajoute lis ak detay bwat la nan Espas Pwopriyetè a.',
            viewDetails: 'Gade Detay',
            addToCart: 'Mete nan Panye',
            addedToCart: 'Ajoute',
            priceNote: 'Chwazi USD oswa HTG anlè a oswa nan panye ou',
            emptyCatalog: 'Pa gen bwat pwovizyon ki afiche kounye a.',
            loading: 'Ap chaje bwat pwovizyon yo...',
            errorLoad: 'Nou pa t kapab chaje katalòg la.',
            retry: 'Eseye Ankò'
        },
        productModal: {
            close: 'Fèmen',
            quantity: 'Kantite',
            usdPrice: 'Pri (USD)',
            htgPrice: 'Pri (HTG)',
            availability: 'Disponibilite',
            addToCart: 'Mete nan Panye'
        },
        delivery: {
            heading: 'Kijan Livrezon UrFoodBox Fonksyone',
            subheading: 'Livrezon pwovizyon ki senp epi fyab — Machew devan pot kay ou.',
            step1Title: '01. Chwazi Bwat Pwovizyon Ou',
            step1Desc: 'Gade bwat nou yo oswa mande yon bwat pèsonalize pou fanmi ou.',
            step2Title: '02. Pase Kòmand San Kont',
            step2Desc: 'Mete non ou, telefòn ou, ak adrès ou, epi chwazi Peye lè w resevwa, Viman, MonCash oswa Natcash.',
            step3Title: '03. Livrezon Devan Pòt Kay Ou',
            step3Desc: 'Swiv referans kòmand ou pandan ekip nou an ap prepare epi pote pwovizyon yo devan pòt ou.'
        },
        customBox: {
            heading: 'Fè Bwat Pa Ou',
            subheading: 'Ou bezwen pwodwi espesifik oswa yon pake pèsonalize?',
            description: 'Di nou egzakteman ki pwodwi ak ki kantite ou bezwen. Pale dirèkteman ak ekip UrFoodBox sou WhatsApp.',
            whatsappCta: 'Kòmande Bwat Pèsonalize sou WhatsApp',
            whatsappNotConfigured: 'Pwopriyetè a ka konfigire nimewo WhatsApp la nan Paramèt Admin yo.',
            whatsappPrefill: 'Bonjou UrFoodBox! Mwen ta renmen fè yon bwat pwovizyon pèsonalize.'
        },
        tracker: {
            heading: 'Swiv Kòmand Ou',
            subheading: 'Antre nimewo referans inik ou te resevwa lè w te pase kòmand lan.',
            placeholder: 'egz. UFB-20261115-A1B2C3',
            button: 'Verifye Estati',
            searching: 'Ap chèche...',
            notFound: 'Nou pa jwenn okenn kòmand ak referans sa a.',
            reference: 'Referans',
            status: 'Estati',
            total: 'Total',
            date: 'Dat Kòmand',
            items: 'Pwodwi'
        },
        cart: {
            title: 'Panye & Kòmand Ou',
            emptyTitle: 'Panye ou vid',
            emptyDesc: 'Ajoute yon bwat pwovizyon pou kòmanse kòmand ou.',
            browseBoxes: 'Gade Bwat Yo',
            currencyLabel: 'Lajan pou Afichaj ak Kòmand',
            subtotal: 'Sou-total',
            total: 'Total',
            remove: 'Retire',
            checkoutTitle: 'Enfòmasyon Livrezon & Peman',
            guestBadge: 'Kòmand envite — pa bezwen enskripsyon',
            fullName: 'Non Konplè',
            fullNamePlaceholder: 'Antre non konplè ou',
            phone: 'Nimewo Telefòn',
            phonePlaceholder: '+509 ...',
            address: 'Adrès Livrezon',
            addressPlaceholder: 'Ri, katye, pwen referans...',
            instructions: 'Enstriksyon Kòmand (Opsyonèl)',
            instructionsPlaceholder: 'Lè ou prefere, nòt espesyal...',
            boxPeriodLabel: 'Pou konbyen tan ou bezwen bwat pwovizyon sa a?',
            periodUnitLabel: 'Kalite tan',
            periodCountLabel: 'Chif (1–5)',
            periodPresets: {
                weekSingular: 'Semèn',
                weekPlural: 'Semèn',
                monthSingular: 'Mwa',
                monthPlural: 'Mwa'
            },
            householdSizeLabel: 'Pou konbyen moun?',
            personsUnit: 'moun',
            personSingular: 'moun',
            periodAndPersonsError: 'Tanpri chwazi pou konbyen tan ak pou konbyen moun ou bezwen bwat la.',
            paymentMethod: 'Metòd Peman',
            submitOrder: 'Voye Kòmand lan',
            submitting: 'Ap voye kòmand...',
            savedAddressUse: 'Adrès anrejistre yo:',
            validationError: 'Tanpri ranpli non konplè ou, nimewo telefòn ou, ak adrès livrezon an.',
            confirmationTitle: 'Kòmand Ou Voye ak Siksè',
            confirmationSubtitle: 'Mèsi dèske w kòmande ak UrFoodBox. Konsève referans anba a pou swiv livrezon ou.',
            orderRefLabel: 'Referans Kòmand',
            paymentSelected: 'Metòd Peman',
            continueShopping: 'Kontinye Achte'
        },
        paymentMethods: {
            cash_on_delivery: 'Peye lè ou resevwa (Kach)',
            wire: 'Viman Bankè',
            moncash: 'MonCash',
            natcash: 'Natcash'
        },
        orderStatuses: {
            New: 'Nouvo',
            Confirmed: 'Konfime',
            Preparing: 'Ap prepare',
            'Out for delivery': 'Sou wout livrezon',
            Delivered: 'Livre',
            Cancelled: 'Anile'
        },
        account: {
            title: 'Kont Kliyan (Opsyonèl)',
            subtitle: 'Anrejistre adrès livrezon ou yo, gade ansyen kòmand yo, epi sove preferans abònman.',
            signInGoogle: 'Kontinye ak Google',
            signingIn: 'Ap konekte...',
            signOut: 'Dekonekte',
            guestReminder: 'Kreye yon kont totalman opsyonèl. Ou ka toujou kòmande kòm envite.',
            tabProfile: 'Pwofil & Adrès',
            tabOrders: 'Istorik Kòmand',
            tabSubscriptions: 'Abònman',
            fullName: 'Non Konplè',
            phone: 'Nimewo Telefòn',
            defaultAddress: 'Adrès Prensipal',
            saveProfile: 'Anrejistre Pwofil',
            saving: 'Ap anrejistre...',
            savedSuccess: 'Pwofil mete ajou.',
            savedAddressesTitle: 'Adrès Anrejistre Yo',
            addAddressLabel: 'Ajoute Yon Lòt Adrès',
            addressLabelPlaceholder: 'Tit (egz. Kay, Biwo)',
            addressTextPlaceholder: 'Adrès konplè',
            addAddressBtn: 'Ajoute Adrès',
            noOrders: 'Poko gen kòmand ki lye ak kont sa a.',
            subTitle: 'Preferans Abònman Pwovizyon',
            subNotice: 'Peman otomatik yo poko aktive jiskaske yon founisè peman konfigire. Ou ka anrejistre preferans livrezon ou anba a.',
            subFrequency: 'Frekans Livrezon',
            weekly: 'Chak Semèn',
            monthly: 'Chak Mwa',
            subDay: 'Jou Livrezon Ou Prefere',
            subBox: 'Bwat Pwovizyon Ou Prefere',
            subNotes: 'Nòt Preferans',
            subSaveBtn: 'Anrejistre Preferans Abònman',
            subSaved: 'Preferans abònman anrejistre nan lis datant.',
            subStatusWaitlist: 'Lis datant (Pa gen peman aktif)',
            subStatusPaused: 'Sou poz',
            subStatusCancelled: 'Anile'
        },
        comments: {
            heading: 'Kòmantè & Avi Kliyan Yo',
            subheading: 'Pataje eksperyans ou ak UrFoodBox oswa li sa lòt fanmi yo di.',
            nameLabel: 'Non Ou',
            namePlaceholder: 'Antre non ou',
            ratingLabel: 'Nòt',
            commentLabel: 'Kòmantè Ou',
            commentPlaceholder: 'Di nou kijan ou jwenn bwat pwovizyon ou ak livrezon an...',
            submitBtn: 'Voye Kòmantè',
            submitting: 'Ap voye...',
            successMsg: 'Mèsi! Kòmantè ou pibliye.',
            validationError: 'Tanpri mete non ou ak yon kòmantè (omwen 3 lèt).',
            emptyState: 'Poko gen kòmantè. Se ou ki ka premye kliyan ki kite yon avi.'
        },
        footer: {
            tagline: 'Machew devan pot kay ou.',
            contactTitle: 'Kontak',
            socialTitle: 'Rezo Sosyal',
            linksTitle: 'Lyen Rapid',
            adminLink: 'Espas Pwopriyetè (Admin)',
            whatsappLabel: 'WhatsApp',
            rights: 'Tout dwa rezève.'
        }
    }
};
function formatMoney(amount, currency) {
    const num = Number(amount) || 0;
    if (currency === 'USD') {
        return `$${num.toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        })} USD`;
    }
    return `${num.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })} HTG`;
}
function getLocalizedProductName(product, lang) {
    if (lang === 'fr') return product.nameFr || product.nameEn;
    if (lang === 'ht') return product.nameHt || product.nameEn;
    return product.nameEn;
}
function getLocalizedProductDescription(product, lang) {
    if (lang === 'fr') return product.descriptionFr || product.descriptionEn || '';
    if (lang === 'ht') return product.descriptionHt || product.descriptionEn || '';
    return product.descriptionEn || '';
}
}),
"[project]/src/lib/fetch-json.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "safeFetchJson",
    ()=>safeFetchJson
]);
async function safeFetchJson(input, init) {
    const res = await fetch(input, {
        cache: 'no-store',
        ...init
    });
    const text = await res.text();
    if (!text || !text.trim()) {
        if (!res.ok) {
            throw new Error(`Request failed (HTTP ${res.status}) with an empty response.`);
        }
        return {
            res,
            data: {}
        };
    }
    try {
        const data = JSON.parse(text);
        return {
            res,
            data
        };
    } catch  {
        throw new Error(`Unexpected server response (HTTP ${res.status}). Please refresh and try again.`);
    }
}
}),
"[project]/src/lib/firebase.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "auth",
    ()=>auth,
    "googleAuthProvider",
    ()=>googleAuthProvider
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$app$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/app/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/app/dist/esm/index.esm.js [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/index.mjs [app-ssr] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$totp$2d$Cx8BEadN$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__D__as__getAuth$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/node-esm/totp-Cx8BEadN.js [app-ssr] (ecmascript) <export D as getAuth>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$totp$2d$Cx8BEadN$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__f__as__GoogleAuthProvider$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/node-esm/totp-Cx8BEadN.js [app-ssr] (ecmascript) <export f as GoogleAuthProvider>");
var __TURBOPACK__imported__module__$5b$project$5d2f$firebase$2d$applet$2d$config$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/firebase-applet-config.json.[json].cjs [app-ssr] (ecmascript)");
;
;
;
const app = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$locals$3e$__["initializeApp"])(__TURBOPACK__imported__module__$5b$project$5d2f$firebase$2d$applet$2d$config$2e$json$2e5b$json$5d2e$cjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"]);
const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$totp$2d$Cx8BEadN$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__D__as__getAuth$3e$__["getAuth"])(app);
const googleAuthProvider = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$node$2d$esm$2f$totp$2d$Cx8BEadN$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__$3c$export__f__as__GoogleAuthProvider$3e$__["GoogleAuthProvider"]();
googleAuthProvider.setCustomParameters({
    prompt: 'select_account'
});
}),
];

//# sourceMappingURL=_1m1_3_ene4ae3._.js.map