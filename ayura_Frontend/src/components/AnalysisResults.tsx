import React from 'react';
import { ComparisonResult } from '../types';
import { motion } from 'framer-motion';
import { TrendingDown, ExternalLink, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface AnalysisResultsProps {
  results: ComparisonResult;
}

export const AnalysisResults = ({ results }: AnalysisResultsProps) => {
  const { originalMedicine, genericAlternatives, totalSavingsPercent } = results;

  return (
    <div className="container mx-auto px-4 py-16 max-w-5xl">

      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-4xl font-serif text-ayura-text mb-2">Analysis Results</h2>
          <p className="text-ayura-muted">
            Found {genericAlternatives.filter((a: any) => !a.notFound).length} medicine(s) with generic alternatives.
          </p>
        </div>
        {totalSavingsPercent > 0 && (
          <div className="bg-ayura-primary/10 border border-ayura-primary/20 px-8 py-5 rounded-[24px] flex items-center gap-5">
            <div className="bg-ayura-primary p-3 rounded-full text-white">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-ayura-primary uppercase tracking-widest mb-1">Max Savings</div>
              <div className="text-3xl font-serif text-ayura-text">Up to {totalSavingsPercent}%</div>
            </div>
          </div>
        )}
      </div>

      <div className="space-y-8">
        {genericAlternatives.map((alt: any, index: number) => {
          return (
            <motion.div
              key={alt.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15 }}
              className="bg-white border border-ayura-border rounded-[32px] p-8 shadow-sm"
            >
              <div className="flex items-center gap-3 mb-6">
                {alt.notFound ? (
                  <AlertCircle className="w-5 h-5 text-red-400" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-ayura-primary" />
                )}
                <h3 className="text-2xl font-serif text-ayura-text">{alt.name}</h3>
                {alt.notFound && (
                  <span className="ml-auto text-xs font-bold text-red-400 bg-red-50 px-3 py-1 rounded-full">
                    Not Found in Database
                  </span>
                )}
              </div>

              {alt.notFound ? (
                <p className="text-ayura-muted text-sm italic">
                  No generic alternative data found for this medicine. Please consult your doctor or pharmacist.
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                  <div className="space-y-4">
                    <div className="flex justify-between text-sm border-b border-ayura-border pb-3">
                      <span className="text-ayura-muted">Brand Price</span>
                      <span className="font-bold text-ayura-text line-through opacity-60">
                        ₹{originalMedicine.price || "—"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm border-b border-ayura-border pb-3">
                      <span className="text-ayura-muted">Generic Price</span>
                      <span className="font-bold text-ayura-primary text-lg">₹{alt.price || "—"}</span>
                    </div>
                    {alt.savings && (
                      <div className="bg-green-50 border border-green-100 rounded-2xl p-4 text-sm">
                        <p className="font-bold text-green-700">{alt.savings.verdict}</p>
                        <p className="text-green-600 mt-1">
                          Save ₹{alt.savings.per_unit_inr} per unit · ₹{alt.savings.per_month_inr}/month
                        </p>
                      </div>
                    )}
                    {alt.janAushadhi && (
                      <div className="flex gap-2 text-xs text-ayura-muted bg-slate-50 p-3 rounded-xl">
                        <Info className="w-4 h-4 shrink-0 text-ayura-primary" />
                        <span>{alt.janAushadhi}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4 text-sm">
                    {alt.uses?.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold text-ayura-muted uppercase tracking-widest mb-1">Uses</p>
                        <p className="text-ayura-text">{alt.uses.join(", ")}</p>
                      </div>
                    )}
                    {alt.sideEffects?.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold text-ayura-muted uppercase tracking-widest mb-1">Side Effects</p>
                        <p className="text-ayura-text">{alt.sideEffects.join(", ")}</p>
                      </div>
                    )}
                    {alt.substitutes?.length > 0 && (
                      <div>
                        <p className="text-[10px] font-bold text-ayura-muted uppercase tracking-widest mb-1">Substitutes</p>
                        <p className="text-ayura-text">{alt.substitutes.join(", ")}</p>
                      </div>
                    )}
                    {alt.buyLinks?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {alt.buyLinks.map((link: string, i: number) => {
                          const openLink = () => window.open(link, "_blank");
                          return (
                            <button
                              key={i}
                              onClick={openLink}
                              className="flex items-center gap-1 text-xs px-3 py-2 bg-ayura-text text-white rounded-xl hover:bg-ayura-primary transition-all"
                            >
                              Buy Online <ExternalLink className="w-3 h-3" />
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};