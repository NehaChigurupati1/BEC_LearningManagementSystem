
import React, { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import { Toaster } from './ui/toaster';
import { Toaster as SonnerToaster } from 'sonner';

interface LayoutProps {
  children: ReactNode;
  hideHeader?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, hideHeader = false }) => {
  return (
    <div className="min-h-screen flex flex-col">
      {!hideHeader && <Header />}
      <main className="flex-grow">{children}</main>
      <Footer />
      <Toaster />
      <SonnerToaster position="bottom-center" />
    </div>
  );
};

export default Layout;
