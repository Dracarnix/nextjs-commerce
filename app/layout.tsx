import type { Metadata } from 'next'
import { Oswald, Inter, Pinyon_Script } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const oswald = Oswald({ 
  subsets: ["latin"],
  variable: '--font-oswald'
});
const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter'
});
const pinyonScript = Pinyon_Script({
  weight: "400",
  subsets: ["latin"],
  variable: '--font-script'
});

export const metadata: Metadata = {
  title: 'Homepage | Music Artist',
  description: 'THE VYZN - New Music on All Streaming Platforms',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${oswald.variable} ${inter.variable} ${pinyonScript.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
