import React from 'react';
import { MOCK_REVIEWS } from '../constants';
import { motion } from 'framer-motion';
import { Star, Quote, ShieldCheck } from 'lucide-react';

export const ReviewSection = () => {
  return (
    <section id="reviews" className="py-24 bg-ayura-bg">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="text-4xl font-serif text-ayura-text mb-4">Patient Stories</h2>
          <p className="text-ayura-muted leading-relaxed">Join thousands who have discovered that identical chemical formulas shouldn't carry a marketing premium.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {MOCK_REVIEWS.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="group bg-white p-8 rounded-[40px] relative border border-ayura-border shadow-sm hover:shadow-xl hover:shadow-ayura-primary/5 transition-all"
            >
              <Quote className="absolute top-6 right-8 w-12 h-12 text-ayura-primary/5 -scale-x-100" />
              
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3.5 h-3.5 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} 
                  />
                ))}
              </div>

              <p className="text-ayura-text text-sm italic mb-8 leading-relaxed">
                "{review.comment}"
              </p>

              <div className="flex items-center justify-between border-t border-ayura-border pt-6">
                <div>
                  <div className="font-bold text-ayura-text text-xs uppercase tracking-wider">{review.userName}</div>
                  <div className="text-[10px] text-ayura-muted mt-0.5">{review.date}</div>
                </div>
                {review.isVerified && (
                  <div className="flex items-center gap-1 text-[9px] font-bold text-ayura-primary uppercase tracking-widest bg-ayura-primary/5 px-3 py-1 rounded-full border border-ayura-primary/10">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
