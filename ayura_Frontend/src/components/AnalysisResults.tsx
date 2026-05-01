import React from 'react';
import { Medicine, ComparisonResult } from '../types';
import { motion } from 'framer-motion';
import { Check, Info, Star, TrendingDown, ExternalLink } from 'lucide-react';

interface AnalysisResultsProps {
  results: ComparisonResult;
}

export const AnalysisResults = ({ results }: AnalysisResultsProps) => {
  const { originalMedicine, genericAlternatives, totalSavingsPercent } = results;

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl">
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-serif text-ayura-text mb-2">Analysis Results</h2>
          <p className="text-ayura-muted">We've identified your medicine and found {genericAlternatives.length} bio-equivalent generic matches.</p>
        </div>
        <div className="bg-ayura-primary/10 border border-ayura-primary/20 px-8 py-5 rounded-[24px] flex items-center gap-5">
          <div className="bg-ayura-primary p-3 rounded-full text-white">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-bold text-ayura-primary uppercase tracking-widest mb-1">Expected Savings</div>
            <div className="text-3xl font-serif text-ayura-text leading-none">Up to {totalSavingsPercent}%</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Original Medicine */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-ayura-border rounded-[32px] p-8 sticky top-24 shadow-sm">
            <div className="flex items-center gap-2 mb-8">
              <span className="text-[10px] font-bold text-ayura-primary uppercase tracking-[0.2em]">Reference Product</span>
            </div>
            <h3 className="text-3xl font-serif text-ayura-primary mb-1">{originalMedicine.name}</h3>
            <p className="text-ayura-muted text-sm mb-8 font-medium">{originalMedicine.manufacturer}</p>
            
            <div className="space-y-5 mb-10">
              <div className="flex justify-between text-sm">
                <span className="text-ayura-muted">Core Ingredient</span>
                <span className="font-semibold text-ayura-text">{originalMedicine.activeIngredients[0]}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-ayura-muted">Dosage</span>
                <span className="font-semibold text-ayura-text">{originalMedicine.dosage}</span>
              </div>
              <div className="flex justify-between items-center pt-5 border-t border-ayura-border">
                <span className="text-ayura-muted">Market Price</span>
                <span className="text-2xl font-serif text-ayura-text">₹{originalMedicine.price.toFixed(2)}</span>
              </div>
            </div>

            <div className="p-5 bg-slate-50 border border-ayura-border rounded-2xl flex gap-3 italic text-xs text-ayura-muted leading-relaxed">
              <Info className="w-4 h-4 text-ayura-primary shrink-0" />
              Standard proprietary pricing for the listed reference brand product.
            </div>
          </div>
        </div>

        {/* Generic Alternatives */}
        <div className="lg:col-span-2 space-y-8">
          {genericAlternatives.map((alt, index) => (
            <motion.div
              key={alt.id}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className={`group relative overflow-hidden rounded-[40px] p-1 ${index === 0 ? 'bg-gradient-to-br from-ayura-primary to-ayura-secondary shadow-xl shadow-ayura-primary/10' : ''}`}
            >
              <div className="bg-white rounded-[38px] p-10 h-full relative">
                {index === 0 && (
                  <div className="absolute top-0 right-14 bg-ayura-primary text-white px-8 py-2 rounded-b-2xl text-[10px] font-bold uppercase tracking-[0.2em]">
                    Best Clinical Match
                  </div>
                )}
                
                <div className="flex flex-col md:flex-row justify-between gap-8 h-full">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <h4 className="text-3xl font-serif text-ayura-text">{alt.name}</h4>
                      <div className="w-8 h-px bg-ayura-border"></div>
                      <span className="text-[10px] font-bold text-ayura-primary uppercase tracking-widest">Generic</span>
                    </div>
                    <p className="text-ayura-muted text-sm mb-6 leading-relaxed">{alt.manufacturer}</p>
                    
                    <div className="flex flex-wrap gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="font-bold text-ayura-text">{alt.rating.toFixed(1)}</span>
                        <span className="text-ayura-muted">({alt.reviewsCount})</span>
                      </div>
                      <div className="flex items-center gap-2 text-ayura-secondary font-semibold">
                        <Check className="w-4 h-4" />
                        WHO Certified
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end justify-center md:border-l md:border-ayura-border md:pl-10">
                    <div className="text-[10px] font-bold text-ayura-muted uppercase tracking-widest mb-1">Generic Price</div>
                    <div className="text-4xl font-serif text-ayura-text mb-6">₹{alt.price.toFixed(2)}</div>
                    <button className="flex items-center justify-center gap-3 px-8 py-4 bg-ayura-text text-white rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-ayura-primary transition-all w-full md:w-auto transform active:scale-95 group-hover:shadow-lg">
                      Order Prescription
                      <ExternalLink className="w-4 h-4 opacity-70" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Comparison Table Section */}
      <section id="comparison" className="mt-32 pt-24 border-t border-ayura-border">
        <div className="max-w-3xl mb-16">
          <h2 className="text-4xl font-serif text-ayura-text mb-4">Science of Equivalence</h2>
          <p className="text-ayura-muted leading-relaxed text-lg">Every generic option we recommend is clinically tested for bio-equivalence to ensure your recovery remains the top priority.</p>
        </div>
        
        <div className="overflow-x-auto rounded-[40px] border border-ayura-border bg-white shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50">
                <th className="p-8 text-[10px] font-bold text-ayura-muted uppercase tracking-[0.2em] border-b border-ayura-border">Bio-Markers</th>
                <th className="p-8 text-[10px] font-bold text-ayura-text uppercase tracking-[0.2em] border-b border-ayura-border">{originalMedicine.name} (Brand)</th>
                <th className="p-8 text-[10px] font-bold text-ayura-primary uppercase tracking-[0.2em] border-b border-ayura-border">{genericAlternatives[0].name} (Generic)</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <tr>
                <td className="p-8 border-b border-ayura-border font-semibold text-ayura-text bg-slate-50/50">Core Molecule</td>
                <td className="p-8 border-b border-ayura-border text-ayura-muted">{originalMedicine.activeIngredients.join(', ')}</td>
                <td className="p-8 border-b border-ayura-border text-ayura-muted">{genericAlternatives[0].activeIngredients.join(', ')}</td>
              </tr>
              <tr>
                <td className="p-8 border-b border-ayura-border font-semibold text-ayura-text bg-slate-50/50">Efficacy Rating</td>
                <td className="p-8 border-b border-ayura-border text-ayura-muted italic">100% Reference</td>
                <td className="p-8 border-b border-ayura-border text-ayura-muted italic">99.8% - 100.2% Accuracy</td>
              </tr>
              <tr>
                <td className="p-8 border-b border-ayura-border font-semibold text-ayura-text bg-slate-50/50">Disintegration Time</td>
                <td className="p-8 border-b border-ayura-border text-ayura-muted">Pharmacopeia Standard</td>
                <td className="p-8 border-b border-ayura-border text-ayura-muted">Pharmacopeia Standard</td>
              </tr>
              <tr>
                <td className="p-8 border-b border-ayura-border font-semibold text-ayura-text bg-slate-50/50">Inert Binders</td>
                <td className="p-8 border-b border-ayura-border text-ayura-muted text-xs">Proprietary system</td>
                <td className="p-8 border-b border-ayura-border text-ayura-muted text-xs">Pharma-grade CMC/Starch</td>
              </tr>
              <tr className="bg-ayura-primary/5">
                <td className="p-8 font-bold text-ayura-text text-lg">Monthly Patient Cost</td>
                <td className="p-8 font-bold text-ayura-text opacity-50 line-through text-lg">₹{originalMedicine.price.toFixed(2)}</td>
                <td className="p-8 font-serif font-bold text-ayura-primary text-2xl">₹{genericAlternatives[0].price.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
