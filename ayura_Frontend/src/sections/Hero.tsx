/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Sparkles } from 'lucide-react';

export default function Hero() {
  return (
    <section className="pt-10 pb-16 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="inline-flex items-center gap-2 bg-brand-50 text-brand-700 px-4 py-1.5 rounded-full text-sm font-semibold mb-8 ring-1 ring-brand-100"
      >
        <Sparkles className="w-4 h-4" />
        <span>AI-powered • India-first</span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-5xl md:text-7xl font-display font-bold leading-[1.1] text-slate-950 max-w-4xl mx-auto"
      >
        Find cheaper <span className="text-brand-600 italic">generic</span> medicines in seconds
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto"
      >
        Save up to 80% on your medical bills by discovering high-quality generic alternatives verified by specialists.
      </motion.p>
    </section>
  );
}
