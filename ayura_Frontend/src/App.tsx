/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { AnalysisResults } from './components/AnalysisResults';
import { ReviewSection } from './components/ReviewSection';
import { Footer } from './components/Footer';
import { ComparisonResult } from './types';
import { analyzeMedicine } from './services/gemini';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [results, setResults] = useState<ComparisonResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (name: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await analyzeMedicine(name);
      if (data) {
        setResults(data);
        // Scroll to results
        setTimeout(() => {
          document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        setError("Could not find information for this medicine. Please try another name or upload a clear prescription image.");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    try {
      const base64 = await fileToBase64(file);
      const data = await analyzeMedicine({
        data: base64.split(',')[1],
        mimeType: file.type
      });
      
      if (data) {
        setResults(data);
        setTimeout(() => {
          document.getElementById('results-section')?.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      } else {
        setError("AI could not read the prescription clearly. Please upload a high-resolution photo.");
      }
    } catch (err) {
      setError("Failed to process image. Make sure it's a valid image file.");
    } finally {
      setIsLoading(false);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <div className="min-h-screen bg-ayura-bg font-sans selection:bg-ayura-primary/20 selection:text-ayura-text">
      <Navbar />
      
      <main>
        <Hero 
          onSearch={handleSearch} 
          onUpload={handleUpload} 
          isLoading={isLoading} 
        />

        <AnimatePresence>
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="container mx-auto px-4 mt-8"
            >
              <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center gap-3 text-red-700 max-w-2xl mx-auto shadow-sm">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <section id="results-section">
          <AnimatePresence>
            {results && (
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
              >
                <AnalysisResults results={results} />
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        <ReviewSection />
      </main>

      <Footer />
    </div>
  );
}

