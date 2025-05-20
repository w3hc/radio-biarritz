import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Admin | Radio Biarritz',
  description: "Du Fun, de l'Authenticité, des Vagues",

  openGraph: {
    title: 'Admin | Radio Biarritz',
    description: "Du Fun, de l'Authenticité, des Vagues",
    url: 'https://radio-biarritz.netlify.app/admin',
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
    title: 'Admin | Radio Biarritz',
    description: "Du Fun, de l'Authenticité, des Vagues",
    images: ['/huangshan.png'],
  },
}

export default function NewLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
