import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Radio Biarritz',
  description: "Du Fun, de l'Authenticité, des Vagues",

  keywords: ['Web3', 'Next.js', 'Ethereum', 'DApp', 'Blockchain', 'Wallet'],
  authors: [{ name: 'Julien', url: 'https://github.com/julienbrg' }],

  openGraph: {
    title: 'Radio Biarritz',
    description: "Du Fun, de l'Authenticité, des Vagues",
    url: 'https://radio-biarritz.netlify.app',
    siteName: 'Radio Biarritz',
    images: [
      {
        url: '/huangshan.png',
        width: 1200,
        height: 630,
        alt: 'Radio Biarritz',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Radio Biarritz',
    description: "Du Fun, de l'Authenticité, des Vagues",
    images: ['/huangshan.png'],
    creator: '@julienbrg',
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

  verification: {
    google: 'your-google-site-verification',
  },
}
