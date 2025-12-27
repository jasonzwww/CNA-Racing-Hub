
// Fix: Re-implement RootLayout to support the shared ClientLayout's router dependencies
import React from 'react';
import { Metadata } from "next";
import "./globals.css";
import { LanguageProvider } from "../context/LanguageContext";
import { AuthProvider } from "../context/AuthContext";
import ClientLayout from "../components/ClientLayout";
import ClientRouter from "../components/ClientRouter";

export const metadata: Metadata = {
  title: "CNA Racing Hub",
  description: "The official portal for CNA Racing league in iRacing. Featuring race schedules, real-time countdowns, driver statistics, a global driver map, and endurance team matchmaking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body>
        <LanguageProvider>
          <AuthProvider>
            <ClientRouter>
              <ClientLayout>
                {children}
              </ClientLayout>
            </ClientRouter>
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
