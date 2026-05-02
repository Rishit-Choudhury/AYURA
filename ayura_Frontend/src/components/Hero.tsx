import React, { useState, useRef } from 'react';
import { Search, Upload, FileText, Loader2, Camera, ShieldCheck, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeroProps {
  onSearch: (name: string) => void;
  onUpload: (file: File) => void;
  isLoading: boolean;
}

export const Hero = ({ onSearch, onUpload, isLoading }: HeroProps) => {
  const [searchValue, setSearchValue] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      onSearch(searchValue);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onUpload(e.target.files[0]);
    }
  };

  return (
    <section className="relative pt-20 pb-24 px-4 overflow-hidden bg-ayura-bg">
      <div className="container mx-auto relative z-10 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-12 xl:col-span-7"
          >
            <h1 className="text-5xl md:text-7xl font-serif text-ayura-text leading-tight mb-8">
              Same active medicine, <br />
              <span className="italic text-ayura-primary font-light">90% less cost.</span>
            </h1>
            <p className="text-lg text-ayura-muted mb-10 max-w-lg leading-relaxed">
              AYURA AI scans your prescription to find the exact chemical equivalent from verified generic labs. Precision care, pharmaceutical transparency.
            </p>

            <div className="bg-white p-8 rounded-[32px] border border-ayura-border shadow-sm max-w-xl">
              <div className="flex flex-col gap-5">
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-4 p-5 bg-slate-50 rounded-2xl border-2 border-dashed border-ayura-border cursor-pointer hover:bg-slate-100 transition-colors"
                >
                  <div className="p-3 bg-ayura-primary text-white rounded-xl shadow-sm">
                    <Upload className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-medium text-ayura-text">Upload Prescription Image</p>
                    <p className="text-xs text-ayura-muted">PDF, JPG, or PNG (Max 10MB)</p>
                  </div>
                  <button className="ml-auto bg-ayura-primary text-white px-6 py-2 rounded-xl text-sm font-medium">Browse</button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>

                <div className="relative flex items-center">
                  <div className="flex-1 h-px bg-ayura-border"></div>
                  <span className="px-4 text-[10px] text-ayura-muted uppercase tracking-[0.2em]">or search name</span>
                  <div className="flex-1 h-px bg-ayura-border"></div>
                </div>

                <form onSubmit={handleSubmit} className="relative">
                  <input 
                    type="text" 
                    placeholder="Enter medicine name (e.g., Atorva)" 
                    className="w-full px-6 py-4 bg-slate-50 border border-ayura-border rounded-2xl text-sm outline-none focus:border-ayura-primary transition-colors"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                  <button 
                    type="submit"
                    disabled={isLoading || !searchValue.trim()}
                    className="absolute right-2 top-2 bottom-2 bg-ayura-text text-white px-5 rounded-xl text-sm font-medium hover:bg-ayura-primary transition-colors disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Find Alternative'}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="hidden lg:flex lg:col-span-12 xl:col-span-5 items-center justify-center p-4"
          >
            <div className="w-full max-w-sm">
              <AnimatePresence mode="wait">
                {isLoading ? (
                  <motion.div 
                    key="loading"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="flex flex-col items-center justify-center space-y-6 text-center bg-white/50 backdrop-blur-sm p-10 rounded-[40px] border border-ayura-border"
                  >
                    <div className="relative">
                      <div className="w-20 h-20 border-4 border-ayura-primary/10 rounded-full"></div>
                      <div className="w-20 h-20 border-4 border-t-ayura-primary rounded-full animate-spin absolute top-0 left-0"></div>
                      <Activity className="w-8 h-8 text-ayura-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <div>
                      <h3 className="text-xl font-serif text-ayura-text">Processing...</h3>
                      <p className="text-xs text-ayura-muted mt-2">Checking verified chemical databases</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="static"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-white p-8 rounded-[40px] border border-ayura-border shadow-xl relative overflow-hidden flex flex-col"
                  >
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-ayura-primary/5 rounded-full" />
                    <div className="flex items-center gap-4 mb-6">
                      <div className="p-3 bg-ayura-primary/10 rounded-xl">
                        <ShieldCheck className="w-6 h-6 text-ayura-primary" />
                      </div>
                      <span className="text-[10px] font-bold text-ayura-primary uppercase tracking-[0.2em]">Verified Hub</span>
                    </div>
                    <h3 className="text-xl font-serif text-ayura-text mb-3 leading-tight">Pharmaceutical Transparency</h3>
                    <p className="text-sm text-ayura-muted leading-relaxed mb-6">
                      We cross-reference every search with official Indian pharmaceutical standards to ensure bio-equivalence.
                    </p>
                    <div className="flex items-center gap-3 text-ayura-primary font-bold text-[10px] uppercase tracking-widest mt-auto pt-6 border-t border-slate-50">
                      <div className="w-1.5 h-1.5 rounded-full bg-ayura-secondary animate-pulse" />
                      System Status: Optimized
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
