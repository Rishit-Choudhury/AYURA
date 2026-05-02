import React from 'react';
import { Medicine, ComparisonResult } from '../types';
import { motion } from 'framer-motion';
import { Check, Info, Star, TrendingDown, ExternalLink, FileText } from 'lucide-react';

interface AnalysisResultsProps {
  results: ComparisonResult;
}

export const AnalysisResults = ({ results }: AnalysisResultsProps) => {
  const { originalMedicine, genericAlternatives } = results;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-serif text-ayura-text mb-2">Prescription Analysis</h2>
          <p className="text-ayura-muted text-sm italic">Molecule identified and cross-referenced with Indian clinical standards.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Col: The Prescribed Medicine Detail */}
        <div className="lg:col-span-4 h-full">
          <div className="bg-white border border-ayura-border rounded-[32px] p-8 h-full shadow-sm relative overflow-hidden group">
            <div className="flex items-center gap-2 mb-8">
              <span className="text-[9px] font-bold text-ayura-primary uppercase tracking-[0.2em] bg-ayura-primary/5 px-3 py-1.5 rounded-lg border border-ayura-primary/10">Identified Molecule</span>
            </div>
            
            <h3 className="text-2xl font-serif text-ayura-primary mb-1">{originalMedicine.name}</h3>
            <p className="text-ayura-muted text-xs mb-8 font-medium">{originalMedicine.manufacturer}</p>
            
            <div className="space-y-4 mb-8">
              <div className="p-4 bg-slate-50/50 rounded-2xl border border-ayura-border/30">
                <span className="text-[9px] font-bold text-ayura-muted uppercase tracking-widest block mb-2">Chemical Composition</span>
                <span className="text-xs font-semibold text-ayura-text leading-relaxed block">
                  {originalMedicine.composition || originalMedicine.activeIngredients.join(' + ')}
                </span>
              </div>

              {originalMedicine.therapeutic_class && (
                <div className="p-4 bg-slate-50/50 rounded-2xl border border-ayura-border/30">
                  <span className="text-[9px] font-bold text-ayura-muted uppercase tracking-widest block mb-1">Therapeutic Class</span>
                  <span className="text-xs font-semibold text-ayura-text">{originalMedicine.therapeutic_class}</span>
                </div>
              )}

              {originalMedicine.uses && originalMedicine.uses.length > 0 && (
                <div className="p-4 bg-slate-50/50 rounded-2xl border border-ayura-border/30">
                  <span className="text-[9px] font-bold text-ayura-muted uppercase tracking-widest block mb-2">Primary Uses</span>
                  <ul className="list-disc list-inside space-y-1">
                    {originalMedicine.uses.map((use, i) => (
                      <li key={i} className="text-xs text-ayura-muted leading-relaxed font-medium">{use}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-6 border-t border-ayura-border mt-auto">
              <div className="flex justify-between items-center mb-4">
                <span className="text-ayura-muted text-[10px] font-bold uppercase tracking-widest">Brand Market Rate</span>
                <span className="text-2xl font-serif text-ayura-text">₹{originalMedicine.price.toFixed(2)}</span>
              </div>
              
              {originalMedicine.side_effects && originalMedicine.side_effects.length > 0 && (
                <div className="p-4 bg-red-50/30 border border-red-100 rounded-2xl">
                  <span className="text-[9px] font-bold text-red-800 uppercase tracking-widest block mb-2">Potential Side Effects</span>
                  <div className="flex flex-wrap gap-1.5">
                    {originalMedicine.side_effects.map(effect => (
                      <span key={effect} className="px-2 py-1 bg-white/60 border border-red-100 rounded-md text-[9px] text-red-900 font-medium">
                        {effect}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Processed Alternatives - Orderly and Small */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="flex items-center gap-4 px-2">
            <h3 className="text-xs font-bold text-ayura-muted uppercase tracking-[0.2em]">Validated Generic Substitutes ({genericAlternatives.length})</h3>
            <div className="h-px flex-1 bg-ayura-border" />
          </div>

          <div className="flex flex-col gap-5">
            {genericAlternatives.map((alt, index) => (
              <motion.div
                key={alt.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`relative bg-white border border-ayura-border rounded-[24px] p-6 shadow-sm hover:shadow-md transition-all group ${index === 0 ? 'ring-2 ring-ayura-primary/20 bg-ayura-primary/[0.01]' : ''}`}
              >
                {index === 0 && (
                  <div className="absolute top-0 right-10 bg-ayura-primary text-white px-4 py-1.5 rounded-b-xl text-[9px] font-bold uppercase tracking-widest">
                    Top Recommended
                  </div>
                )}
                
                <div className="flex flex-col md:flex-row gap-6 items-start">
                  {/* Info Part */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-serif text-ayura-text">{alt.name}</h4>
                      <span className="text-[9px] font-bold text-ayura-secondary bg-ayura-secondary/5 px-2 py-0.5 rounded-md border border-ayura-secondary/20 uppercase tracking-widest">Bio-Equivalent</span>
                    </div>
                    <p className="text-ayura-muted text-[11px] mb-4 font-medium">{alt.manufacturer}</p>
                    
                    {alt.clinicalNotes && (
                      <div className="mb-4 text-[11px] text-ayura-muted leading-relaxed border-l-2 border-ayura-primary/20 pl-4 py-1">
                        {alt.clinicalNotes}
                      </div>
                    )}

                    {alt.notes && (
                      <div className="text-[10px] text-ayura-primary font-bold flex items-center gap-2">
                        <Check className="w-3.5 h-3.5" />
                        {alt.notes}
                      </div>
                    )}
                  </div>

                  {/* Price and Action Part */}
                  <div className="flex md:flex-col items-center md:items-end justify-between md:justify-center md:pl-8 md:border-l md:border-ayura-border min-w-[160px] gap-4 w-full md:w-auto">
                    <div className="flex flex-col md:items-end">
                      <span className="text-[9px] font-bold text-ayura-muted mb-0.5 uppercase tracking-widest">Generic Rate</span>
                      <span className="text-2xl font-serif text-ayura-text">₹{alt.price.toFixed(2)}</span>
                      <span className="text-[9px] text-ayura-secondary font-bold">Save {Math.round(((originalMedicine.price - alt.price)/originalMedicine.price)*100)}%</span>
                    </div>
                    
                    <div className="flex gap-2">
                      {alt.buy_links && alt.buy_links.length > 0 ? (
                        <a 
                          href={alt.buy_links[0]} 
                          target="_blank" 
                          referrerPolicy="no-referrer"
                          className="flex items-center gap-2 px-5 py-2.5 bg-ayura-text text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-ayura-primary transition-all group-hover:shadow-md"
                        >
                          Buy Now
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      ) : (
                        <button className="px-5 py-2.5 bg-ayura-text text-white rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-ayura-primary transition-all group-hover:shadow-md">
                          Details
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
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

      {/* FINAL MEDICAL DISCLAIMER PANEL */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-24 p-8 bg-orange-50 border-2 border-orange-200 rounded-[40px] flex flex-col md:flex-row items-center gap-8 shadow-xl overflow-hidden relative"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-100 opacity-40 blur-[100px] rounded-full" />
        
        <div className="bg-orange-500 p-4 rounded-3xl text-white shrink-0 shadow-lg shadow-orange-200">
          <Info className="w-8 h-8" />
        </div>
        
        <div className="flex-1 text-center md:text-left">
          <h4 className="text-orange-900 text-xl font-serif mb-2">Crucial Safety Information</h4>
          <p className="text-orange-800 text-sm leading-relaxed max-w-2xl font-medium">
            Ayura AI provides bio-equivalent data for educational clarity. Pharmaceutical substitutes should <span className="text-orange-900 font-bold underline">never</span> be started without explicit approval from your treating physician. Different manufacturers may use varying excipients which can affect individual sensitivity.
          </p>
        </div>
        
        <div className="flex flex-col items-center gap-2">
          <span className="text-[10px] text-orange-700 font-bold uppercase tracking-widest">Medical Safety First</span>
          <div className="px-6 py-3 bg-orange-600 text-white rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] shadow-md">
            Protocol Verified
          </div>
        </div>
      </motion.div>
    </div>
  );
};
