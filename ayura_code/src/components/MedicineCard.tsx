/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Building2, ChevronRight, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { Medicine, formatCurrency } from '../utils/helpers';

interface MedicineCardProps {
  medicine: Medicine;
  index: number;
  key?: string | number;
}

export default function MedicineCard({ medicine, index }: MedicineCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white p-5 rounded-2xl border border-slate-100 premium-shadow group hover:border-brand-300 transition-all cursor-pointer"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-800 group-hover:text-brand-700 transition-colors">
            {medicine.name}
          </h3>
          <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-1">
            <Building2 className="w-3.5 h-3.5" />
            <span>{medicine.company}</span>
          </div>
        </div>
        {medicine.discount && (
          <div className="bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-xs font-bold ring-1 ring-emerald-100">
            Save {medicine.discount}%
          </div>
        )}
      </div>

      <div className="bg-slate-50 rounded-xl p-3 mb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
          <Info className="w-3 h-3" />
          Composition
        </div>
        <p className="text-sm text-slate-700 line-clamp-2">
          {medicine.salt}
        </p>
      </div>

      <div className="flex justify-between items-end">
        <div>
          <p className="text-xs text-slate-400 font-medium">Generic Price</p>
          <p className="text-xl font-display font-bold text-slate-900">
            {formatCurrency(medicine.price)}
          </p>
        </div>
        <button className="flex items-center gap-1 text-brand-600 font-semibold text-sm hover:translate-x-1 transition-transform">
          Compare <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
