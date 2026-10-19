import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#FFFFFF",
};

export const metadata: Metadata = {
  title: "LEVANTAQUI | Disponibilidade de Balcões e ATMs",
  description:
    "Consulte a disponibilidade em tempo real de balcões, caixas automáticos (ATMs), serviços de depósito e atendimento bancário.",
  keywords: [
    "LEVANTAQUI",
    "ATMs Moçambique",
    "Balcões bancários",
    "Levantamento",
    "Depósitos",
    "Pemba",
  ],
  authors: [{ name: "LEVANTAQUI" }],
  icons: {
    icon: "/imgs/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt" className="h-full antialiased scroll-smooth">
      <body className="min-h-full flex flex-col bg-[#F9F9F9] text-gray-900 antialiased selection:bg-[#D1005D]/10 selection:text-[#D1005D]">
        {children}
      </body>
    </html>
  );
}
