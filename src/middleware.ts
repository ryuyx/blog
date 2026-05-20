import { defineMiddleware } from "astro/middleware";
import { getRelativeLocaleUrl } from "astro:i18n";

const LOCALE_COOKIE = "x-locale";
const SUPPORTED_LOCALES = ["zh", "en"];
const DEFAULT_LOCALE = "zh";

export const onRequest = defineMiddleware(async (context, next) => {
  const { request, url, cookies } = context;
  const pathname = url.pathname;

  // Skip assets, API routes, and file extensions
  if (
    pathname.includes(".") ||
    pathname.startsWith("/_astro") ||
    pathname.startsWith("/pagefind")
  ) {
    return next();
  }

  const cookieLocale = cookies.get(LOCALE_COOKIE)?.value;

  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
    const lang = cookieLocale;
    const relativePath = pathname.replace(/^\/blog/, "") || "/";
    const isRoot = relativePath === "/";
    const alreadyPrefixed = SUPPORTED_LOCALES.some(
      loc => loc !== DEFAULT_LOCALE && relativePath.startsWith(`/${loc}`)
    );

    if (lang !== DEFAULT_LOCALE && !alreadyPrefixed && isRoot) {
      context.cookies.set(LOCALE_COOKIE, lang, {
        path: "/",
        maxAge: 365 * 24 * 60 * 60,
        httpOnly: false,
      });
      return context.redirect(getRelativeLocaleUrl(lang, ""), 302);
    }
  }

  if (!cookieLocale) {
    const acceptLanguage = request.headers.get("accept-language") || "";
    const preferred = parsePreferredLocale(acceptLanguage);

    context.cookies.set(LOCALE_COOKIE, preferred, {
      path: "/",
      maxAge: 365 * 24 * 60 * 60,
      httpOnly: false,
    });

    const relativePath = pathname.replace(/^\/blog/, "") || "/";
    const isRoot = relativePath === "/";
    const alreadyPrefixed = SUPPORTED_LOCALES.some(
      loc => loc !== DEFAULT_LOCALE && relativePath.startsWith(`/${loc}`)
    );

    if (preferred !== DEFAULT_LOCALE && !alreadyPrefixed && isRoot) {
      return context.redirect(getRelativeLocaleUrl(preferred, ""), 302);
    }
  }

  return next();
});

function parsePreferredLocale(acceptLanguage: string): string {
  const locales = acceptLanguage
    .split(",")
    .map(s => {
      const [lang, q = "1"] = s.trim().split(";q=");
      return { lang: lang.split("-")[0], q: parseFloat(q) || 1 };
    })
    .sort((a, b) => b.q - a.q);

  for (const { lang } of locales) {
    if (SUPPORTED_LOCALES.includes(lang)) return lang;
  }

  return DEFAULT_LOCALE;
}
