import type { Metadata } from 'next';
import './globals.css';
import { Albert_Sans, Young_Serif } from 'next/font/google';
import Header from '@/components/Header';
import ReduxProvider from '@/lib/redux/ReduxProvider';
import { Toaster } from '@/components/ui/toaster';
import AuthProvider from '@/provider/AuthProvider';
import Favicon from '/public/favicon.ico';
const getYoung = Young_Serif({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-young',
});
const getAlbert = Albert_Sans({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-albert',
});

export const metadata: Metadata = {
  title: 'Top Fashion',
  description: 'Top Fashion is a fashion e-commerce website',
  icons: [{ rel: 'icon', url: Favicon.src }],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body
        className={`${getAlbert.variable} ${getYoung.variable} antialiased`}
      >
        <ReduxProvider>
          <AuthProvider>
            <Header />
            {children}
            <Toaster />
          </AuthProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
