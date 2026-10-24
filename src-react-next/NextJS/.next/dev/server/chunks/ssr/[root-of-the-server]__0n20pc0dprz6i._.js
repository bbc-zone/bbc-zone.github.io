module.exports = [
(()=>{"use strict";return[
"[project]/src/components/layout/ConfigNotice.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ConfigNotice",
    ()=>ConfigNotice
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$providers$2f$RuntimeConfigProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/providers/RuntimeConfigProvider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$whatsapp$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/whatsapp.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
function ConfigNotice() {
    const { whatsappNumber, loaded } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$providers$2f$RuntimeConfigProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRuntimeConfig"])();
    if (!loaded || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$whatsapp$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isWhatsAppConfigured"])(whatsappNumber)) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "border-b border-amber-400/20 bg-amber-400/10 px-4 py-2 text-center text-xs text-amber-100 md:text-sm",
        children: [
            "Nomor WhatsApp belum dikonfigurasi. Atur di",
            " ",
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("code", {
                className: "rounded bg-black/30 px-1",
                children: "site-config.json"
            }, void 0, false, {
                fileName: "[project]/src/components/layout/ConfigNotice.tsx",
                lineNumber: 13,
                columnNumber: 7
            }, this),
            " sebelum memublikasikan situs."
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/layout/ConfigNotice.tsx",
        lineNumber: 11,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/components/providers/RuntimeConfigProvider.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "RuntimeConfigProvider",
    ()=>RuntimeConfigProvider,
    "useRuntimeConfig",
    ()=>useRuntimeConfig
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$paths$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/paths.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$whatsapp$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/whatsapp.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const RuntimeConfigContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])({
    whatsappNumber: null,
    loaded: false
});
function RuntimeConfigProvider({ children }) {
    const [config, setConfig] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useState"])({
        whatsappNumber: null,
        loaded: false
    });
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        const controller = new AbortController();
        fetch(`${__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$paths$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["basePath"]}/site-config.json?v=${Date.now()}`, {
            cache: "no-store",
            signal: controller.signal
        }).then((response)=>{
            if (!response.ok) throw new Error("Runtime config request failed");
            return response.json();
        }).then((data)=>{
            const whatsapp = typeof data.whatsapp === "string" ? data.whatsapp : "";
            setConfig({
                whatsappNumber: (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$whatsapp$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["normalizeWhatsAppNumber"])(whatsapp),
                loaded: true
            });
        }).catch((error)=>{
            if (error instanceof DOMException && error.name === "AbortError") return;
            setConfig({
                whatsappNumber: null,
                loaded: true
            });
        });
        return ()=>controller.abort();
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(RuntimeConfigContext.Provider, {
        value: config,
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/providers/RuntimeConfigProvider.tsx",
        lineNumber: 46,
        columnNumber: 10
    }, this);
}
function useRuntimeConfig() {
    return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(RuntimeConfigContext);
}
}),
"[project]/src/components/seo/JsonLd.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "JsonLd",
    ()=>JsonLd
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$business$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/business.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$providers$2f$RuntimeConfigProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/components/providers/RuntimeConfigProvider.tsx [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$contact$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/contact.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
function JsonLd() {
    const { whatsappNumber } = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$components$2f$providers$2f$RuntimeConfigProvider$2e$tsx__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRuntimeConfig"])();
    const phone = whatsappNumber;
    const data = {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$business$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["businessConfig"].name,
        description: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$business$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["businessConfig"].description,
        founder: {
            "@type": "Person",
            name: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$business$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["businessConfig"].owner
        },
        areaServed: "ID"
    };
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$contact$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isSiteUrlConfigured"])()) {
        data.url = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$business$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["businessConfig"].siteUrl;
    }
    if (phone) {
        data.telephone = `+${phone}`;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$contact$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["isAddressConfigured"])()) {
        data.address = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$business$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["businessConfig"].address;
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("script", {
        type: "application/ld+json",
        dangerouslySetInnerHTML: {
            __html: JSON.stringify(data)
        }
    }, void 0, false, {
        fileName: "[project]/src/components/seo/JsonLd.tsx",
        lineNumber: 36,
        columnNumber: 5
    }, this);
}
}),
"[project]/src/config/business.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PLACEHOLDERS",
    ()=>PLACEHOLDERS,
    "businessConfig",
    ()=>businessConfig,
    "navItems",
    ()=>navItems
]);
const businessConfig = {
    name: "DicoFix",
    owner: "Dico Hermawan",
    tagline: "HP Rusak? DicoFix Aja!",
    secondaryTagline: "Your Phone, Our Priority.",
    description: "DicoFix merupakan layanan perbaikan smartphone yang membantu pelanggan menangani berbagai permasalahan perangkat, mulai dari layar rusak, baterai bermasalah, kerusakan port charger, gangguan software, hingga diagnosis HP mati total.",
    address: "Alamat toko belum dikonfigurasi",
    mapsUrl: "",
    openingHours: "Jam operasional belum dikonfigurasi",
    siteUrl: ""
};
const PLACEHOLDERS = {
    address: "Alamat toko belum dikonfigurasi",
    openingHours: "Jam operasional belum dikonfigurasi"
};
const navItems = [
    {
        href: "#beranda",
        label: "Beranda"
    },
    {
        href: "#layanan",
        label: "Layanan"
    },
    {
        href: "#keunggulan",
        label: "Keunggulan"
    },
    {
        href: "#testimoni",
        label: "Testimoni"
    },
    {
        href: "#faq",
        label: "FAQ"
    },
    {
        href: "#kontak",
        label: "Kontak"
    }
];
}),
"[project]/src/config/paths.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// Next.js inlines this value at build time. Development stays at the domain
// root; production assets are served from the Apache subfolder.
__turbopack_context__.s([
    "basePath",
    ()=>basePath,
    "publicAssetPath",
    ()=>publicAssetPath
]);
const basePath = ("TURBOPACK compile-time falsy", 0) ? "TURBOPACK unreachable" : "";
function publicAssetPath(path) {
    return `${basePath}${path}`;
}
}),
"[project]/src/lib/contact.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "formatWhatsAppDisplay",
    ()=>formatWhatsAppDisplay,
    "isAddressConfigured",
    ()=>isAddressConfigured,
    "isMapsConfigured",
    ()=>isMapsConfigured,
    "isOpeningHoursConfigured",
    ()=>isOpeningHoursConfigured,
    "isSiteUrlConfigured",
    ()=>isSiteUrlConfigured
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$business$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/config/business.ts [app-ssr] (ecmascript)");
;
function isAddressConfigured() {
    const address = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$business$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["businessConfig"].address.trim();
    return Boolean(address) && address !== __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$business$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PLACEHOLDERS"].address;
}
function isOpeningHoursConfigured() {
    const hours = __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$business$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["businessConfig"].openingHours.trim();
    return Boolean(hours) && hours !== __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$business$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["PLACEHOLDERS"].openingHours;
}
function isMapsConfigured() {
    try {
        const url = new URL(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$business$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["businessConfig"].mapsUrl);
        return url.protocol === "https:" || url.protocol === "http:";
    } catch  {
        return false;
    }
}
function isSiteUrlConfigured() {
    try {
        const url = new URL(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$config$2f$business$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["businessConfig"].siteUrl);
        return url.protocol === "https:" || url.protocol === "http:";
    } catch  {
        return false;
    }
}
function formatWhatsAppDisplay(digits) {
    if (digits.startsWith("62") && digits.length >= 11) {
        return `+${digits.slice(0, 2)} ${digits.slice(2, 5)}-${digits.slice(5, 9)}-${digits.slice(9)}`;
    }
    return `+${digits}`;
}
}),
"[project]/src/lib/whatsapp.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "buildWhatsAppUrl",
    ()=>buildWhatsAppUrl,
    "isWhatsAppConfigured",
    ()=>isWhatsAppConfigured,
    "normalizeWhatsAppNumber",
    ()=>normalizeWhatsAppNumber,
    "openWhatsApp",
    ()=>openWhatsApp,
    "whatsappMessages",
    ()=>whatsappMessages
]);
function normalizeWhatsAppNumber(number) {
    if (!number) return null;
    const trimmed = number.trim();
    if (!trimmed || /x/i.test(trimmed)) return null;
    let digits = trimmed.replace(/\D/g, "");
    if (digits.startsWith("00")) {
        digits = digits.slice(2);
    } else if (digits.startsWith("0")) {
        // Indonesian domestic numbers (08...) become international 628...
        digits = `62${digits.slice(1)}`;
    }
    if (digits.length < 10 || digits.length > 15) return null;
    if (!/^[1-9]\d{9,14}$/.test(digits)) return null;
    return digits;
}
function isWhatsAppConfigured(number) {
    return normalizeWhatsAppNumber(number) !== null;
}
function buildWhatsAppUrl(message, number) {
    const phone = normalizeWhatsAppNumber(number);
    if (!phone) return null;
    return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
function openWhatsApp(message, number) {
    const url = buildWhatsAppUrl(message, number);
    if ("TURBOPACK compile-time truthy", 1) return false;
    //TURBOPACK unreachable
    ;
}
const whatsappMessages = {
    general: "Halo DicoFix, saya ingin konsultasi mengenai perbaikan smartphone. Mohon informasi lebih lanjut.",
    hero: "Halo DicoFix, saya ingin konsultasi gratis mengenai perbaikan smartphone. Mohon informasi lebih lanjut.",
    cta: "Halo DicoFix, saya ingin chat untuk konsultasi perbaikan smartphone. Terima kasih.",
    contact: "Halo DicoFix, saya ingin bertanya mengenai layanan perbaikan smartphone. Mohon informasinya.",
    estimate (brand, model, problem) {
        return `Halo DicoFix, saya ingin menanyakan estimasi biaya service.

Merek HP: ${brand}
Model HP: ${model}
Kerusakan: ${problem}

Mohon informasi estimasi biaya perbaikannya. Terima kasih.`;
    }
};
}),
]})(),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/runtime-reacts.external.js [external] (next/dist/server/runtime-reacts.external.js, cjs)", ((__turbopack_context__, module, exports) => {

var mod = __turbopack_context__.x("next/dist/server/runtime-reacts.external.js", () => require("next/dist/server/runtime-reacts.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0n20pc0dprz6i._.js.map