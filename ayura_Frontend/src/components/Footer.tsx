import React from 'react';
import { Pill, Github, Twitter, Linkedin, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-ayura-text text-white py-20 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-6xl mx-auto border-b border-white/10 pb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-8">
              <div className="bg-ayura-primary p-2 rounded-xl flex items-center justify-center text-white">
                <Pill className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tighter">AYURA<span className="text-ayura-primary font-light"> AI</span></span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-xs">
              Empowering patients with AI-driven pharmaceutical transparency. Quality care shouldn't come with a premium price tag.
            </p>
            <div className="flex gap-4">
              <Twitter className="w-5 h-5 text-white/30 hover:text-white cursor-pointer transition-colors" />
              <Github className="w-5 h-5 text-white/30 hover:text-white cursor-pointer transition-colors" />
              <Linkedin className="w-5 h-5 text-white/30 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-8 text-white">Platform</h4>
            <ul className="space-y-4 text-sm text-white/40">
              <li className="hover:text-white cursor-pointer transition-colors">How it Works</li>
              <li className="hover:text-white cursor-pointer transition-colors">Medicine Database</li>
              <li className="hover:text-white cursor-pointer transition-colors">Savings Calculator</li>
              <li className="hover:text-white cursor-pointer transition-colors">Clinical Ethics</li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-8 text-white">Support</h4>
            <ul className="space-y-4 text-sm text-white/40">
              <li className="hover:text-white cursor-pointer transition-colors">Patient Stories</li>
              <li className="hover:text-white cursor-pointer transition-colors">Help Center</li>
              <li className="hover:text-white cursor-pointer transition-colors">Contact Us</li>
              <li className="hover:text-white cursor-pointer transition-colors">Privacy Charter</li>
            </ul>
          </div>

          <div>
            <h4 className="font-serif text-lg mb-8 text-white">Trust Indicators</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[10px] text-white/40 uppercase tracking-[0.2em]">
                <div className="w-1.5 h-1.5 bg-ayura-primary rounded-full"></div> FDA Approved Sources
              </div>
              <div className="flex items-center gap-3 text-[10px] text-white/40 uppercase tracking-[0.2em]">
                <div className="w-1.5 h-1.5 bg-ayura-primary rounded-full"></div> HIPAA Secured Data
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center mt-12 gap-6 text-[10px] text-white/30 uppercase tracking-[0.2em]">
          <div>© 2026 AYURA AI. Built for global pharmaceutical accessibility.</div>
          <div className="flex items-center gap-2">
            Built with <Heart className="w-3 h-3 text-ayura-primary fill-ayura-primary" /> for health equity
          </div>
        </div>
      </div>
    </footer>
  );
};
