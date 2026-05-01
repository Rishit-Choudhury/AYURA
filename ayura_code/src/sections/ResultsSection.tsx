/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { motion } from 'motion/react';
import { Pill, ArrowRight, TrendingDown } from 'lucide-react';
import MedicineCard from '../components/MedicineCard';
import { Medicine, formatCurrency } from '../utils/helpers';

interface ResultsSectionProps {
  sourceMedicine: Medicine | null;
  results: Medicine[];
  searched: boolean;
}

export default function ResultsSection({ sourceMedicine, results, searched }: ResultsSectionProps) {
  if (!searched) return null;

  if (!sourceMedicine && searched) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-20"
      >
        <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Pill className="w-8 h-8 text-slate-400" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">No results found</h3>
        <p className="text-slate-500 mt-2">Try searching for a different medicine or salt composition.</p>
      </motion.div>
    );
  }

  return (
    <section id="results" className="mt-12 py-12 border-t border-slate-200">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div className="flex-1">
          <div className="flex items-center gap-2 text-brand-600 font-bold text-sm uppercase tracking-widest mb-2">
            <TrendingDown className="w-4 h-4" />
            Comparison Found
          </div>
          <h2 className="text-3xl font-display font-bold text-slate-900 mb-2">
            Alternatives for <span className="text-brand-600">{sourceMedicine?.name}</span>
          </h2>
          <p className="text-slate-500 max-w-xl">
            We found {results.length} high-quality generic alternatives with the same salt composition: <span className="font-semibold text-slate-700">{sourceMedicine?.salt}</span>.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-end min-w-[240px]">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter mb-1">Branded Price</p>
          <div className="text-3xl font-display font-bold text-slate-900">
            {formatCurrency(sourceMedicine?.price || 0)}
          </div>
          <p className="text-xs text-slate-400 mt-1">Per strip/bottle</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {results.map((medicine, index) => (
          <MedicineCard key={medicine.id} medicine={medicine} index={index} />
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-16 bg-brand-900 rounded-[2.5rem] p-10 md:p-16 text-white overflow-hidden relative"
      >
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-3xl md:text-5xl font-display font-bold leading-tight mb-6">
            Ready to switch to <br /> generics?
          </h2>
          <p className="text-brand-100 text-lg mb-8">
            Consult our in-house medical experts for free and get a verified prescription for generic alternatives.
          </p>
          <button className="bg-brand-400 text-brand-950 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-brand-300 transition-all flex items-center gap-2 group">
            Consult Expert Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        
        <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-1/4 translate-y-1/4">
          <Pill className="w-[400px] h-[400px] rotate-45" />
        </div>
      </motion.div>
    </section>
  );
}
