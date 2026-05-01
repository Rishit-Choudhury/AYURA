/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Upload, Loader2, Sparkle } from 'lucide-react';

interface SearchSectionProps {
  onSearch: (query: string) => void;
  loading: boolean;
}

export default function SearchSection({ onSearch, loading }: SearchSectionProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  return (
    <section className="max-w-3xl mx-auto -mt-4 mb-16 relative z-10">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-2 rounded-[2.5rem] premium-shadow border border-slate-100 flex flex-col md:flex-row items-center gap-2"
      >
        <form onSubmit={handleSubmit} className="flex-1 w-full flex items-center gap-3 px-6 py-2">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="e.g. Crocin 500mg, Augmentin 625, Pan-D"
            className="flex-1 bg-transparent border-none outline-none text-lg text-slate-800 placeholder:text-slate-300 font-medium py-3"
          />
        </form>

        <div className="flex gap-2 w-full md:w-auto p-1 md:p-0">
          <button 
            type="button"
            className="flex items-center justify-center gap-2 px-6 py-4 rounded-[2rem] text-slate-500 font-semibold hover:bg-slate-50 transition-colors active:scale-95 whitespace-nowrap"
          >
            <Upload className="w-5 h-5" />
            <span className="hidden sm:inline">Upload Rx</span>
          </button>
          
          <button
            onClick={handleSubmit}
            disabled={loading || !query.trim()}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-brand-600 text-white px-8 py-4 rounded-[2rem] font-bold text-lg hover:bg-brand-700 transition-all active:scale-95 shadow-lg shadow-brand-200 disabled:opacity-50 disabled:cursor-not-allowed min-w-[160px]"
          >
            {loading ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <Sparkle className="w-5 h-5" />
                Find Generics
              </>
            )}
          </button>
        </div>
      </motion.div>

      <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm font-medium text-slate-500">
        <span className="text-slate-400">Popular searches:</span>
        <button onClick={() => { setQuery('Pan-D'); onSearch('Pan-D'); }} className="hover:text-brand-600 transition-colors">Pan-D</button>
        <button onClick={() => { setQuery('Augmentin'); onSearch('Augmentin'); }} className="hover:text-brand-600 transition-colors">Augmentin 625</button>
        <button onClick={() => { setQuery('Crocin'); onSearch('Crocin'); }} className="hover:text-brand-600 transition-colors">Crocin 500</button>
      </div>
    </section>
  );
}
