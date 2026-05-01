import React, { useState, useRef } from 'react';
import { Search, Upload, FileText, Loader2, Camera, ShieldCheck } from 'lucide-react';
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
            className="hidden lg:block lg:col-span-12 xl:col-span-5"
          >
            <div className="bg-ayura-text text-white p-10 rounded-[40px] flex flex-col justify-between aspect-[4/5] shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-ayura-primary rounded-full blur-[100px] opacity-20 -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-700" />
              
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-12">
                  <span className="text-[10px] uppercase tracking-[0.2em] opacity-60 font-bold">AI Savings Analysis</span>
                  <span className="bg-ayura-primary text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">Live Accuracy</span>
                </div>
                <div className="space-y-8">
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-ayura-secondary text-[10px] font-bold uppercase tracking-wider mb-1">Brand Name</span>
                      <span className="text-2xl font-light">Augmentin (625)</span>
                    </div>
                    <span className="text-xl font-light opacity-50">₹224.00</span>
                  </div>
                  <div className="h-px bg-white/10"></div>
                  <div className="flex justify-between items-center">
                    <div className="flex flex-col">
                      <span className="text-ayura-secondary text-[10px] font-bold uppercase tracking-wider mb-1">Generic Option</span>
                      <span className="text-2xl font-light">Generic Amoxicillin</span>
                    </div>
                    <span className="text-4xl font-serif text-ayura-secondary">₹58.50</span>
                  </div>
                </div>
              </div>
              <div className="mt-auto relative z-10">
                <div className="bg-white/5 p-5 rounded-2xl border border-white/10 backdrop-blur-sm">
                  <p className="text-sm italic opacity-80 underline underline-offset-8 decoration-ayura-secondary/50">Saving you ₹165.50 per strip</p>
                </div>
                <button className="w-full mt-6 bg-ayura-primary text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:bg-white hover:text-ayura-text transition-all transform active:scale-95 shadow-xl shadow-ayura-primary/20">
                  Analyze Your Savings
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
