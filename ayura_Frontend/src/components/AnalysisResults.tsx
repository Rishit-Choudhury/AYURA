import React, { useState } from 'react';
import { ComparisonResult } from '../types';
import { motion } from 'framer-motion';
import { 
  TrendingDown, 
  ExternalLink, 
  AlertCircle, 
  CheckCircle, 
  Info, 
  Pill, 
  Building2, 
  Activity, 
  ShoppingCart, 
  Sparkles,
  ShieldAlert
} from 'lucide-react';

interface AnalysisResultsProps {
  results: ComparisonResult;
}

export const AnalysisResults = ({ results }: AnalysisResultsProps) => {
  const { genericAlternatives, totalSavingsPercent } = results;

  const formatPrice = (price: any) => {
    if (price === undefined || price === null || price === 0 || price === "—") return "—";
    const num = typeof price === 'number' ? price : parseFloat(String(price).replace(/[^0-9.]/g, ''));
    return isNaN(num) ? "—" : `₹${num.toFixed(2)}`;
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-6xl" id="results-section">
      {/* Header Section */}
      <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-ayura-border pb-8">
        <div>
          <span className="text-xs font-bold text-ayura-primary uppercase tracking-widest bg-ayura-primary/10 px-3 py-1.5 rounded-full mb-3 inline-block">
            Prescription Analysis
          </span>
          <h2 className="text-4xl font-serif text-ayura-text mb-2">Comparison Results</h2>
          <p className="text-ayura-muted">
            Found {genericAlternatives.filter((a: any) => !a.notFound).length} medicine(s) with generic or commercial alternatives.
          </p>
        </div>
        {totalSavingsPercent > 0 && (
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/20 px-8 py-5 rounded-[24px] flex items-center gap-5 shadow-sm">
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-3.5 rounded-full text-white shadow-md shadow-green-500/20">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
              <div className="text-[10px] font-bold text-green-600 uppercase tracking-widest mb-1">Max Savings Potential</div>
              <div className="text-3xl font-serif text-green-700 font-bold">Up to {totalSavingsPercent}%</div>
            </div>
          </div>
        )}
      </div>

      {/* Cards List */}
      <div className="space-y-12">
        {genericAlternatives.map((alt: any, index: number) => {
          const hasImage = alt.image_url && alt.image_url.trim().length > 0;

          return (
            <motion.div
              key={alt.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.15, duration: 0.5 }}
              className="bg-white border border-ayura-border rounded-[36px] overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
            >
              {/* Header Bar */}
              <div className="px-8 py-5 bg-slate-50 border-b border-ayura-border flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  {alt.notFound ? (
                    <AlertCircle className="w-6 h-6 text-red-500" />
                  ) : (
                    <CheckCircle className="w-6 h-6 text-emerald-500" />
                  )}
                  <h3 className="text-2xl font-serif font-semibold text-ayura-text">
                    {alt.brandName || alt.name}
                  </h3>
                </div>
                <div>
                  {alt.notFound ? (
                    <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-100 px-4 py-1.5 rounded-full shadow-sm">
                      Not Found in DB
                    </span>
                  ) : (
                    alt.savingsPercent > 0 && (
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 px-4 py-1.5 rounded-full shadow-sm flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-500 animate-pulse" />
                        Generic Available · Save {alt.savingsPercent}%
                      </span>
                    )
                  )}
                </div>
              </div>

              {alt.notFound ? (
                <div className="p-8 text-center max-w-xl mx-auto">
                  <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                  <h4 className="text-lg font-serif text-ayura-text mb-2">No Matching Generic Alternative</h4>
                  <p className="text-ayura-muted text-sm leading-relaxed mb-4">
                    We searched public drug databases and couldn't match a verified generic equivalent for "{alt.name}". Please consult a doctor or local pharmacist for options.
                  </p>
                </div>
              ) : (
                <div className="p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                  
                  {/* Left Column: Original Brand (Web-Searched) */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Activity className="w-4 h-4 text-rose-500" />
                        Prescribed Medicine Details
                      </h4>
                      <span className="text-xs font-semibold text-rose-500 bg-rose-50 border border-rose-100/50 px-2.5 py-1 rounded-md">
                        Web Verified
                      </span>
                    </div>

                    {/* Brand Name & Price Highlight Card (User alignment) */}
                    <div className="bg-gradient-to-br from-rose-50/40 to-amber-50/20 border border-rose-100/70 rounded-3xl p-6 relative overflow-hidden shadow-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="bg-rose-500/10 p-1.5 rounded-lg">
                          <Pill className="w-4 h-4 text-rose-500 transform rotate-45" />
                        </div>
                        <span className="text-[10px] font-bold text-rose-500 uppercase tracking-widest">
                          Official Medicine
                        </span>
                      </div>
                      
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                          <h4 className="text-2xl font-serif font-extrabold text-slate-800 tracking-tight leading-tight">
                            {alt.brandName || alt.name}
                          </h4>
                          {alt.brandManufacturer && (
                            <p className="text-xs text-slate-400 font-semibold mt-1">
                              by {alt.brandManufacturer}
                            </p>
                          )}
                        </div>
                        
                        <div className="bg-white/80 border border-rose-100 shadow-sm px-5 py-2.5 rounded-2xl flex flex-col items-center shrink-0">
                          <span className="text-[9px] font-black text-rose-400 uppercase tracking-widest mb-0.5">Average Brand MRP</span>
                          <span className="text-xl font-serif font-black text-rose-600">
                            {formatPrice(alt.brandPrice)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Decorative soft glowing brand blob */}
                      <div className="absolute -right-4 -bottom-4 w-20 h-20 bg-rose-200/10 rounded-full blur-lg pointer-events-none" />
                    </div>

                    {/* Image Container */}
                    <div className="relative w-full rounded-[24px] overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center p-4 min-h-[180px] max-h-[220px] shadow-inner group">
                      {hasImage ? (
                        <img
                          src={alt.image_url}
                          alt={alt.brandName}
                          className="w-auto h-full max-h-[180px] object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            // Hide the broken image and show the illustration
                            (e.currentTarget as HTMLElement).style.display = 'none';
                            const sibling = (e.currentTarget as HTMLElement).nextElementSibling;
                            if (sibling) (sibling as HTMLElement).style.display = 'flex';
                          }}
                        />
                      ) : null}

                      {/* Fallback illustration if image is missing or fails to load */}
                      <div 
                        className="flex flex-col items-center justify-center text-center p-6" 
                        style={{ display: hasImage ? 'none' : 'flex' }}
                      >
                        <div className="w-14 h-14 rounded-full bg-ayura-primary/10 flex items-center justify-center mb-2">
                          <Pill className="w-6 h-6 text-ayura-primary transform rotate-45" />
                        </div>
                        <p className="text-xs font-semibold text-slate-400">Packaging image not in database</p>
                        <p className="text-[10px] text-slate-300 mt-1">Showing composition details instead</p>
                      </div>
                    </div>

                    {/* Specifications Card */}
                    <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 space-y-4 shadow-sm">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5 block">
                          Chemical Composition
                        </span>
                        <p className="text-sm font-semibold text-ayura-text leading-relaxed bg-white border border-slate-100 p-3 rounded-2xl shadow-inner">
                          {alt.activeIngredients[0] || "Active Ingredients"}
                        </p>
                      </div>

                      {/* Uses and Side Effects tags */}
                      <div className="grid grid-cols-2 gap-4 pt-1">
                        {alt.uses?.length > 0 && (
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Uses</span>
                            <div className="flex flex-wrap gap-1">
                              {alt.uses.slice(0, 2).map((use: string, i: number) => (
                                <span key={i} className="text-[10px] font-medium text-slate-600 bg-slate-100 border border-slate-200/50 px-2.5 py-1 rounded-lg">
                                  {use}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        {alt.sideEffects?.length > 0 && (
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Side Effects</span>
                            <div className="flex flex-wrap gap-1">
                              {alt.sideEffects.slice(0, 2).map((se: string, i: number) => (
                                <span key={i} className="text-[10px] font-medium text-red-600 bg-red-50/50 border border-red-100/30 px-2.5 py-1 rounded-lg">
                                  {se}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Dynamic styled buy buttons with brand colors and logos */}
                    <div className="space-y-3.5 pt-4 border-t border-slate-100">
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">
                        Search or Buy Original
                      </span>
                      <div className="flex flex-wrap gap-3">
                        <a
                          href={`https://www.1mg.com/search/all?name={encodeURIComponent(alt.brandName || alt.name)}`}
                          onClick={(e) => {
                            e.preventDefault();
                            window.open(`https://www.1mg.com/search/all?name=${encodeURIComponent(alt.brandName || alt.name)}`, "_blank");
                          }}
                          className="flex items-center gap-1.5 bg-white hover:bg-orange-50/50 border border-slate-200 hover:border-[#ff6f61] px-4.5 py-2.5 rounded-2xl shadow-sm hover:shadow transition-all duration-300 group cursor-pointer"
                        >
                          <span className="text-slate-800 font-extrabold text-xs tracking-tight group-hover:text-slate-900 transition-colors">tata</span>
                          <span className="bg-[#ff6f61] text-white text-[9px] font-black px-2 py-0.5 rounded-[4px] uppercase tracking-wide">1mg</span>
                          <span className="text-[10px] text-slate-400 ml-1 font-semibold group-hover:text-[#ff6f61] transition-colors">Store</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#ff6f61] transition-all ml-0.5" />
                        </a>

                        <a
                          href={`https://pharmeasy.in/search/all?name={encodeURIComponent(alt.brandName || alt.name)}`}
                          onClick={(e) => {
                            e.preventDefault();
                            window.open(`https://pharmeasy.in/search/all?name=${encodeURIComponent(alt.brandName || alt.name)}`, "_blank");
                          }}
                          className="flex items-center gap-1.5 bg-white hover:bg-teal-50/50 border border-slate-200 hover:border-[#10847e] px-4.5 py-2.5 rounded-2xl shadow-sm hover:shadow transition-all duration-300 group cursor-pointer"
                        >
                          <span className="text-[#10847e] font-black text-xs tracking-tight">Pharm</span>
                          <span className="text-[#f9b115] font-black text-xs tracking-tight">Easy</span>
                          <span className="text-[10px] text-slate-400 ml-1 font-semibold group-hover:text-[#10847e] transition-colors">Store</span>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-[#10847e] transition-all ml-0.5" />
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Jan Aushadhi & Substitutes (Aside / Side-by-Side) */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Pill className="w-4 h-4 text-emerald-500" />
                        Alternative Options
                      </h4>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 shadow-sm">
                        Ayura Curated
                      </span>
                    </div>

                    {/* Section 1: Jan Aushadhi generic alternative if available */}
                    <div className="space-y-3.5">
                      <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100/50 shadow-sm inline-block uppercase tracking-wider">
                        1. Jan Aushadhi Generic Option
                      </span>
                      {alt.janAushadhiAlternatives && alt.janAushadhiAlternatives.length > 0 ? (
                        <div className="space-y-3">
                          {alt.janAushadhiAlternatives.slice(0, 2).map((jaRow: any, jaIdx: number) => {
                            const jaMRP = jaRow.mrp ?? jaRow.MRP ?? jaRow["MRP"] ?? jaRow.price ?? 0;
                            const brandPrice = alt.brandPrice || 0;
                            const savingsPct = (brandPrice > 0 && jaMRP > 0) ? Math.round(((brandPrice - jaMRP) / brandPrice) * 100) : 0;

                            return (
                              <motion.div
                                key={jaIdx}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: jaIdx * 0.1 }}
                                className="bg-gradient-to-br from-emerald-50/40 to-teal-50/20 border border-emerald-100 rounded-3xl p-5 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all duration-300 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center relative overflow-hidden"
                              >
                                <div className="space-y-1.5 flex-1 z-10">
                                  <span className="text-[9px] font-extrabold text-emerald-800 bg-emerald-100/80 border border-emerald-200/50 px-2.5 py-0.5 rounded-full tracking-wider uppercase">
                                    PMBJP Generic Alternative
                                  </span>
                                  <h5 className="text-sm font-bold text-slate-800 leading-tight">
                                    {jaRow.generic_name || jaRow["Generic Name"]}
                                  </h5>
                                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-slate-500">
                                    <span>Unit Size: <strong className="text-slate-700">{jaRow.unit_size || jaRow["Unit Size"]}</strong></span>
                                    <span>•</span>
                                    <span>Class: <strong className="text-slate-700">{jaRow.group || jaRow["Group Name"]}</strong></span>
                                  </div>
                                </div>

                                <div className="flex md:flex-col items-baseline md:items-end justify-between w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-3 md:pt-0 z-10 shrink-0">
                                  <div className="text-right">
                                    <span className="text-[9px] text-slate-400 block uppercase tracking-wider font-bold">Govt Kendra MRP</span>
                                    <span className="text-lg font-black text-emerald-600">{formatPrice(jaMRP)}</span>
                                  </div>
                                  {savingsPct > 0 && (
                                    <span className="text-[9px] font-black text-white bg-emerald-500 border border-emerald-600 px-2 py-0.5 rounded-full mt-1 shadow-sm block animate-pulse">
                                      Save {savingsPct}%
                                    </span>
                                  )}
                                </div>
                                
                                <div className="absolute right-0 bottom-0 w-24 h-24 bg-emerald-200/10 rounded-full blur-xl pointer-events-none" />
                              </motion.div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="bg-slate-50 border border-slate-150 p-4 rounded-3xl flex gap-3 items-start">
                          <Info className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                          <div className="space-y-0.5">
                            <span className="text-xs font-bold text-slate-600 block">Not Found in Government Kendra DB</span>
                            <p className="text-[11px] text-slate-400 leading-relaxed">
                              No direct Jan Aushadhi generic equivalent is matched for this composition. You can still purchase the cheaper commercial alternatives below.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Section 2: Cheaper Brand Alternatives */}
                    <div className="space-y-3.5 pt-2">
                      <span className="text-[10px] font-extrabold text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-100/50 shadow-sm inline-block uppercase tracking-wider">
                        2. Cheaper Brand Substitutes
                      </span>
                      {(() => {
                        const rawAlts = [
                          ...(alt.commercialAlternatives || []).map((c: any) => ({ name: c.name || c.brand_name || c.brandName, price: c.price_inr ?? c.price ?? null })),
                          ...(alt.substitutes || []).map((subName: string) => ({ name: subName, price: null }))
                        ];
                        
                        const uniqueAlts: Array<{ name: string; price: number | null }> = [];
                        const seenNames = new Set();
                        for (const item of rawAlts) {
                          if (!item.name) continue;
                          const norm = item.name.trim().toLowerCase();
                          const brandNorm = (alt.brandName || alt.name || "").trim().toLowerCase();
                          if (norm === brandNorm) continue;
                          if (!seenNames.has(norm)) {
                            seenNames.add(norm);
                            uniqueAlts.push(item);
                          }
                        }

                        if (uniqueAlts.length > 0) {
                          return (
                            <div className="space-y-3">
                              {uniqueAlts.slice(0, 3).map((sub: any, subIdx: number) => {
                                const brandPrice = alt.brandPrice || 0;
                                const subPriceSavingsPct = (brandPrice > 0 && sub.price > 0 && sub.price < brandPrice) 
                                  ? Math.round(((brandPrice - sub.price) / brandPrice) * 100) 
                                  : 0;

                                return (
                                  <motion.div
                                    key={subIdx}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: subIdx * 0.08 }}
                                    className="bg-white border border-slate-150 hover:border-slate-250 rounded-3xl p-4.5 shadow-sm hover:shadow transition-all duration-300 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative overflow-hidden"
                                  >
                                    <div className="flex-1 space-y-1.5 z-10">
                                      <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-[9px] font-extrabold text-blue-700 bg-blue-50 border border-blue-100/50 px-2 py-0.5 rounded-full uppercase tracking-wider">
                                          Alternative #{subIdx + 1}
                                        </span>
                                        {subPriceSavingsPct > 0 && (
                                          <span className="text-[9px] font-extrabold text-emerald-750 bg-emerald-50 border border-emerald-100/50 px-2 py-0.5 rounded-full uppercase">
                                            Save {subPriceSavingsPct}%
                                          </span>
                                        )}
                                      </div>
                                      <h5 className="text-sm font-bold text-slate-800 leading-tight">
                                        {sub.name}
                                      </h5>
                                    </div>

                                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto shrink-0 gap-3 border-t md:border-t-0 border-slate-50 pt-2.5 md:pt-0 z-10">
                                      {sub.price !== null && sub.price > 0 && (
                                        <div className="text-left md:text-right">
                                          <span className="text-[8px] text-slate-400 block uppercase tracking-wider font-bold">Est. Brand MRP</span>
                                          <span className="text-sm font-black text-slate-700">{formatPrice(sub.price)}</span>
                                        </div>
                                      )}
                                      
                                      {/* Tiny logo links */}
                                      <div className="flex items-center gap-1.5">
                                        <a
                                          href={`https://www.1mg.com/search/all?name=${encodeURIComponent(sub.name)}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-0.5 bg-white hover:bg-orange-50 border border-slate-200 hover:border-[#ff6f61] px-2.5 py-1.5 rounded-full shadow-sm hover:shadow transition-all duration-300 group shrink-0 cursor-pointer"
                                          title={`Search ${sub.name} on Tata 1mg`}
                                        >
                                          <span className="text-slate-800 font-extrabold text-[9px] tracking-tight">tata</span>
                                          <span className="bg-[#ff6f61] text-white text-[7px] font-black px-1 py-0.5 rounded-[3px] uppercase tracking-wide">1mg</span>
                                        </a>

                                        <a
                                          href={`https://pharmeasy.in/search/all?name=${encodeURIComponent(sub.name)}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-0.5 bg-white hover:bg-teal-50 border border-slate-200 hover:border-[#10847e] px-2.5 py-1.5 rounded-full shadow-sm hover:shadow transition-all duration-300 group shrink-0 cursor-pointer"
                                          title={`Search ${sub.name} on PharmEasy`}
                                        >
                                          <span className="text-[#10847e] font-black text-[9px] tracking-tight">Pharm</span>
                                          <span className="text-[#f9b115] font-black text-[9px] tracking-tight">Easy</span>
                                        </a>
                                      </div>
                                    </div>
                                  </motion.div>
                                );
                              })}
                            </div>
                          );
                        } else {
                          return (
                            <div className="p-6 border border-dashed border-slate-200 rounded-3xl text-center">
                              <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                              <p className="text-xs font-semibold text-slate-400">No substitutes found in catalog</p>
                              <p className="text-[10px] text-slate-300 mt-1">Please ask your chemist for comparable brands.</p>
                            </div>
                          );
                        }
                      })()}
                    </div>

                    {/* Jan Aushadhi Kendra Information Card */}
                    <div className="bg-slate-50 border border-slate-100 rounded-3xl p-5 flex gap-4 items-start shadow-sm mt-4">
                      <div className="bg-emerald-500/10 p-2.5 rounded-2xl shrink-0">
                        <Info className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div className="space-y-1">
                        <h6 className="text-xs font-bold text-slate-700 uppercase tracking-wider">How to purchase these alternatives?</h6>
                        <p className="text-xs text-slate-500 leading-relaxed">
                          Jan Aushadhi generic medicines are available at specialized PMBJP government pharmacies (Pradhan Mantri Bhartiya Janaushadhi Kendras) across India. These medicines offer the exact same safety, quality, and efficacy as the commercial brands at a fraction of the cost.
                        </p>
                      </div>
                    </div>

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