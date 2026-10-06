import type { Metadata } from "next";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "نبتة | نتعلّم وننمو",
  description: "تعلّم الأنيميشن والبرمجة واكتشف عوالم جديدة، خطوة بخطوة مع نبتة التعليمية.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ar" dir="rtl">
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
