import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { LayoutWrapper } from "@/components/layout-wrapper"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SakSin - AI Interview Platform",
  description: "AI-powered interview platform designed for seamless recruitment and candidate assessment",
  generator: 'v0.dev',
  manifest: '/manifest.json',
  keywords: ['interview', 'AI', 'recruitment', 'assessment', 'SakSin'],
  authors: [{ name: 'SakSin Team' }],
  creator: 'SakSin',
  publisher: 'SakSin',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://saksin.online'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'SakSin - AI Interview Platform',
    description: 'AI-powered interview platform designed for seamless recruitment and candidate assessment',
    url: 'https://saksin.online',
    siteName: 'SakSin',
    images: [
      {
        url: '/screenshot-desktop.png',
        width: 1280,
        height: 720,
        alt: 'SakSin Platform Screenshot',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SakSin - AI Interview Platform',
    description: 'AI-powered interview platform designed for seamless recruitment and candidate assessment',
    images: ['/screenshot-desktop.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/icon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/icon-192x192.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: [
      { url: '/icon-152x152.png', sizes: '152x152', type: 'image/png' },
      { url: '/icon-180x180.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'apple-touch-icon-precomposed',
        url: '/icon-152x152.png',
      },
    ],
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  appleWebApp: {
    title: 'SakSin',
    statusBarStyle: 'default',
    capable: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <LayoutWrapper>
          {children}
        </LayoutWrapper>
      </body>
    </html>
  )
}
