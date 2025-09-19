import type React from "react";
import type { Metadata } from "next";
import { Toaster } from "sonner";
import { Suspense } from "react";
import "./globals.css";
import { TranslationProvider } from "@/contexts/translation-context";

export const metadata: Metadata = {
  title: "Indicadores de Performance",
  description: "Sistema de indicadores financeiros",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="font-sans antialiased">
        <TranslationProvider>
          <Suspense fallback={null}>
            {children}
            <Toaster position="top-right" richColors />
          </Suspense>
        </TranslationProvider>
      </body>
    </html>
  );
}
