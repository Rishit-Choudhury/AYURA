import React from 'react';
import { Pill, Search, ShieldCheck, Star } from 'lucide-react';
import { motion } from 'framer-motion';

export const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 w-full bg-ayura-bg/80 backdrop-blur-md border-b border-ayura-border">
      <div className="container mx-auto px-4 h-20 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <div className="bg-ayura-primary p-2 rounded-xl flex items-center justify-center">
            <Pill className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-ayura-text">AYURA<span className="text-ayura-primary font-light underline decoration-ayura-secondary/30 decoration-4 underline-offset-4">.</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-ayura-muted">
          <a href="#how-it-works" className="hover:text-ayura-primary transition-colors">How it Works</a>
          <a href="#comparison" className="hover:text-ayura-primary transition-colors">Comparison Tool</a>
          <a href="#reviews" className="hover:text-ayura-primary transition-colors">User Reviews</a>
        </div>

        <button className="px-6 py-2.5 bg-ayura-primary text-white rounded-full text-sm font-semibold hover:bg-ayura-text transition-all shadow-lg shadow-ayura-primary/20">
          Get Started
        </button>
      </div>
    </nav>
  );
};
