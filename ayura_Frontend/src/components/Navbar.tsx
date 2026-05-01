/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Pill } from 'lucide-react';
import { motion } from 'motion/react';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full glass border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="bg-brand-500 p-2 rounded-xl">
              <Pill className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-display font-bold tracking-tight text-slate-900">
              Gener<span className="text-brand-600">X</span>
            </span>
          </motion.div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-brand-600 transition-colors">How it works</a>
            <a href="#" className="hover:text-brand-600 transition-colors">Bulk Orders</a>
            <a href="#" className="hover:text-brand-600 transition-colors">Prescriptions</a>
            <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl hover:bg-slate-800 transition-all font-semibold active:scale-95">
              Login
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
