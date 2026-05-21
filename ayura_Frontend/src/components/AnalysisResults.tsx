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
                        <Activity className="w-4 h-4 text-ayura-primary" />
                        Prescribed Brand Details
                      </h4>
                      <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                        Web Verified
                      </span>
                    </div>

                    {/* Image Container */}
                    <div className="relative w-full rounded-[24px] overflow-hidden border border-slate-100 bg-slate-50 flex items-center justify-center p-4 min-h-[220px] max-h-[260px] shadow-inner group">
                      {hasImage ? (
                        <img
                          src={alt.image_url}
                          alt={alt.brandName}
                          className="w-auto h-full max-h-[220px] object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-300"
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
                        <div className="w-16 h-16 rounded-full bg-ayura-primary/10 flex items-center justify-center mb-3">
                          <Pill className="w-8 h-8 text-ayura-primary transform rotate-45" />
                        </div>
                        <p className="text-xs font-semibold text-slate-400">Packaging image not in database</p>
                        <p className="text-[10px] text-slate-300 mt-1">Showing composition details instead</p>
                      </div>
                    </div>

                    {/* Specifications Card */}
                    <div className="bg-slate-50/50 border border-slate-100 rounded-3xl p-6 space-y-4 shadow-sm">
                      <div className="flex justify-between items-center text-sm border-b border-slate-100/80 pb-3">
                        <span className="text-ayura-muted flex items-center gap-1.5">
                          <Pill className="w-4 h-4 text-ayura-primary" /> Prescribed Brand
                        </span>
                        <span className="font-extrabold text-slate-800 text-base max-w-[200px] truncate text-right">
                          {alt.brandName || alt.name}
                        </span>
                      </div>

                      <div className="flex justify-between items-start text-sm border-b border-slate-100/80 pb-3">
                        <span className="text-ayura-muted flex items-center gap-1.5">
                          <Building2 className="w-4 h-4 text-slate-400" /> Manufacturer
                        </span>
                        <span className="font-bold text-ayura-text text-right max-w-[200px] truncate">
                          {alt.brandManufacturer || "Unknown Manufacturer"}
                        </span>
                      </div>

                      <div className="flex justify-between items-center text-sm border-b border-slate-100/80 pb-3">
                        <span className="text-ayura-muted">Average Brand Price</span>
                        <span className="font-semibold text-red-500 bg-red-50 border border-red-100 px-3 py-1 rounded-full text-sm">
                          ₹{alt.brandPrice || "—"}
                        </span>
                      </div>

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
                    {alt.buyLinks?.length > 0 && (
                      <div className="space-y-2.5 pt-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
                          Compare Online Retailers
                        </span>
                        <div className="grid grid-cols-2 gap-3">
                          {alt.buyLinks.map((linkObj: any, i: number) => {
                            const storeName = linkObj.store || (i === 0 ? "Tata 1mg" : "PharmEasy");
                            const is1mg = storeName.toLowerCase().includes("1mg");
                            const btnColor = is1mg ? "hover:bg-[#e05648] bg-[#ff6f61]" : "hover:bg-[#0e746e] bg-[#10847e]";
                            const logoText = is1mg ? "1mg" : "PE";
                            
                            return (
                              <button
                                key={i}
                                onClick={() => window.open(linkObj.url, "_blank")}
                                className={`flex items-center justify-center gap-2 text-xs font-bold py-3.5 px-4 text-white rounded-2xl shadow-sm transition-all duration-300 ${btnColor}`}
                              >
                                <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black ${is1mg ? 'bg-white text-[#ff6f61]' : 'bg-white text-[#10847e]'}`}>
                                  {logoText}
                                </span>
                                <span>Buy on {storeName}</span>
                                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Jan Aushadhi & Substitutes (Aside / Side-by-Side) */}
                  <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                      <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                        <Pill className="w-4 h-4 text-emerald-500" />
                        Generic / Jan Aushadhi Alternatives
                      </h4>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100 shadow-sm">
                        Govt Kendra DB
                      </span>
                    </div>

                    {/* Jan Aushadhi matches loop */}
                    {alt.janAushadhiAlternatives && alt.janAushadhiAlternatives.length > 0 ? (
                      <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                        {alt.janAushadhiAlternatives.map((jaRow: any, jaIdx: number) => {
                          const jaMRP = jaRow.mrp || jaRow.MRP || jaRow["MRP"] || 0;
                          const brandPrice = alt.brandPrice || 0;
                          const savingsPct = (brandPrice > 0 && jaMRP > 0) ? Math.round(((brandPrice - jaMRP) / brandPrice) * 100) : 0;

                          return (
                            <motion.div
                              key={jaIdx}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: jaIdx * 0.1 }}
                              className="bg-gradient-to-br from-emerald-50/30 to-teal-50/20 border border-emerald-100 rounded-3xl p-5 shadow-sm hover:border-emerald-300 hover:shadow-md transition-all duration-300 flex flex-col md:flex-row justify-between gap-4 items-start md:items-center relative overflow-hidden"
                            >
                              <div className="space-y-1.5 flex-1 z-10">
                                <span className="text-[9px] font-extrabold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full tracking-wider uppercase">
                                  Alternative #{jaIdx + 1}
                                </span>
                                <h5 className="text-md font-bold text-slate-800 leading-tight">
                                  {jaRow.generic_name || jaRow["Generic Name"]}
                                </h5>
                                <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-slate-500">
                                  <span>Unit Size: <strong className="text-slate-700">{jaRow.unit_size || jaRow["Unit Size"]}</strong></span>
                                  <span>•</span>
                                  <span>Class: <strong className="text-slate-700">{jaRow.group || jaRow["Group Name"]}</strong></span>
                                </div>
                              </div>

                              <div className="flex md:flex-col items-baseline md:items-end justify-between w-full md:w-auto border-t md:border-t-0 border-slate-100 pt-3 md:pt-0 z-10 shrink-0">
                                <div className="text-right">
                                  <span className="text-[10px] text-slate-400 block uppercase tracking-wider font-semibold">Govt Kendra MRP</span>
                                  <span className="text-xl font-extrabold text-emerald-600">₹{jaMRP}</span>
                                </div>
                                {savingsPct > 0 && (
                                  <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full mt-1.5 shadow-sm block animate-bounce">
                                    Save {savingsPct}%
                                  </span>
                                )}
                              </div>
                              
                              {/* Decorative soft glowing green background blob */}
                              <div className="absolute right-0 bottom-0 w-24 h-24 bg-emerald-200/10 rounded-full blur-xl pointer-events-none" />
                            </motion.div>
                          );
                        })}
                      </div>
                    ) : (
                      /* Fallback to commercial substitutes if no Jan Aushadhi generic row is in DB */
                      <div className="space-y-4">
                        <div className="flex gap-3 text-xs text-slate-500 bg-slate-50 border border-slate-100 p-4 rounded-2xl leading-relaxed">
                          <Info className="w-5 h-5 shrink-0 text-slate-400" />
                          <span>
                            No direct government Jan Aushadhi Kendra alternatives were found matching this chemical composition. However, here are verified high-quality commercial brand substitutes:
                          </span>
                        </div>

                        {alt.substitutes?.length > 0 ? (
                          <div className="grid grid-cols-1 gap-2.5">
                            {alt.substitutes.slice(0, 4).map((sub: string, subIdx: number) => (
                              <div 
                                key={subIdx} 
                                className="bg-white border border-slate-100 px-4 py-3 rounded-2xl flex items-center justify-between text-sm font-semibold text-slate-700 shadow-sm hover:border-slate-300 transition-all duration-200"
                              >
                                <span className="flex items-center gap-2">
                                  <span className="w-2.5 h-2.5 bg-slate-300 rounded-full" />
                                  {sub}
                                </span>
                                <span className="text-xs font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg">
                                  Commercial Alternative
                                </span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-6 border border-dashed border-slate-200 rounded-3xl text-center">
                            <AlertCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                            <p className="text-xs font-semibold text-slate-400">No substitutes found in local catalog</p>
                            <p className="text-[10px] text-slate-300 mt-1">Please ask your chemist for comparable brands.</p>
                          </div>
                        )}
                      </div>
                    )}

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