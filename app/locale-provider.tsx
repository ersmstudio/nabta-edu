"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { messages, type Locale, type MessageKey } from "./i18n";

type LocaleContextValue = { locale: Locale; t: (key: MessageKey) => string; toggleLocale: () => void };
const LocaleContext = createContext<LocaleContextValue | null>(null);
const arabicCountryCodes = new Set(["dz", "bh", "km", "dj", "eg", "iq", "jo", "kw", "lb", "ly", "mr", "ma", "om", "ps", "qa", "sa", "so", "sd", "sy", "tn", "ae", "ye"]);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("ar");
  const [ready, setReady] = useState(false);
  const [locationPrompt, setLocationPrompt] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [locationError, setLocationError] = useState(false);

  useEffect(() => {
    const saved = window.localStorage.getItem("nabta-locale");
    const preferred = navigator.languages.some((language) => language.toLowerCase().startsWith("ar")) ? "ar" : "en";
    setLocale(saved === "ar" || saved === "en" ? saved : preferred);
    if (saved !== "ar" && saved !== "en" && "geolocation" in navigator) setLocationPrompt(true);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "ar" ? "rtl" : "ltr";
    document.title = locale === "ar" ? "نبتة | نتعلّم وننمو" : "Nabta | Learn and grow";
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) description.content = locale === "ar"
      ? "تعلّم الأنيميشن والبرمجة واكتشف عوالم جديدة، خطوة بخطوة مع نبتة التعليمية."
      : "Learn animation and coding, and explore new worlds step by step with Nabta Education.";
    window.localStorage.setItem("nabta-locale", locale);
  }, [locale, ready]);

  function toggleLocale() {
    setLocale((current) => current === "ar" ? "en" : "ar");
  }

  function chooseBrowserLanguage() {
    setLocationPrompt(false);
    setLocationError(false);
  }

  function detectLocationLanguage() {
    if (!("geolocation" in navigator)) {
      setLocationError(true);
      return;
    }
    setDetecting(true);
    setLocationError(false);
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
      try {
        const response = await fetch("/api/geolocate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ latitude: coords.latitude, longitude: coords.longitude }),
        });
        if (!response.ok) throw new Error("Country lookup failed");
        const result = await response.json() as { countryCode?: string };
        if (!result.countryCode) throw new Error("Country was not found");
        setLocale(arabicCountryCodes.has(result.countryCode.toLowerCase()) ? "ar" : "en");
        setLocationPrompt(false);
      } catch {
        setLocationError(true);
      } finally {
        setDetecting(false);
      }
    }, () => {
      setLocationError(true);
      setDetecting(false);
    }, { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 });
  }

  const value = { locale, t: (key: MessageKey) => messages[locale][key], toggleLocale };
  return <LocaleContext.Provider value={value}>{children}{locationPrompt && <div className="location-overlay"><section className="location-dialog" role="dialog" aria-modal="true" aria-labelledby="location-title" lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}><span className="location-leaf">🌍</span><h2 id="location-title">{locale === "ar" ? "نختار لغتك تلقائيًا؟" : "Set your language automatically?"}</h2><p>{locale === "ar" ? "بموافقتك، سيستخدم نبتة موقع جهازك لتحديد الدولة واللغة المناسبة. ستُرسل الإحداثيات إلى OpenStreetMap Nominatim لتحويلها إلى دولة، ولن نطلب الموقع مرة أخرى على هذا الجهاز." : "With your permission, Nabta can use your device location to identify your country and choose a language. Your coordinates will be sent to OpenStreetMap Nominatim to determine the country. We won’t ask again on this device."}</p><p className="location-attribution">© OpenStreetMap contributors · <a href="https://operations.osmfoundation.org/policies/nominatim/" target="_blank" rel="noreferrer">{locale === "ar" ? "سياسة الخدمة" : "Service policy"}</a></p>{locationError && <p className="location-error" role="alert">{locale === "ar" ? "لم نتمكن من تحديد موقعك. يمكنك المتابعة بلغة المتصفح أو المحاولة مرة أخرى." : "We couldn’t determine your location. Continue with your browser language or try again."}</p>}<div className="location-actions"><button type="button" className="button" onClick={detectLocationLanguage} disabled={detecting}>{detecting ? (locale === "ar" ? "جارٍ تحديد الموقع..." : "Finding your location...") : (locale === "ar" ? "استخدم موقعي" : "Use my location")}</button><button type="button" className="location-skip" onClick={chooseBrowserLanguage}>{locale === "ar" ? "استخدم لغة المتصفح" : "Use browser language"}</button></div></section></div>}</LocaleContext.Provider>;
}

export function useLocale() {
  const value = useContext(LocaleContext);
  if (!value) throw new Error("useLocale must be used inside LocaleProvider");
  return value;
}
