import type { Metadata } from "next";
import "./globals.css";
import StoreProvider from "@/lib/store/StoreProvider";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Modular dashboard with customizable widgets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}

