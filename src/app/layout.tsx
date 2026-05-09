import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "TableFlash — Menu QR et commandes restaurant",
  description:
    "TableFlash aide les restaurants à créer un menu QR, recevoir des commandes sans paiement en ligne et collecter plus d’avis clients.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
