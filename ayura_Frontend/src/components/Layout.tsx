/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { ReactNode } from 'react';
import Navbar from './Navbar';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen gradient-bg">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="mt-20 py-12 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>© 2026 GenerX. Empowering India with affordable healthcare.</p>
          <p className="mt-2 italic">Disclaimer: Always consult a registered medical practitioner before switching medicines.</p>
        </div>
      </footer>
    </div>
  );
}
