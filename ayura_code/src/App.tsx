/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect } from 'react';
import Layout from './components/Layout';
import Hero from './sections/Hero';
import SearchSection from './sections/SearchSection';
import ResultsSection from './sections/ResultsSection';
import { useSearch } from './hooks/useSearch';

export default function App() {
  const { loading, results, sourceMedicine, searched, searchGenerics } = useSearch();

  const handleSearch = (query: string) => {
    searchGenerics(query);
  };

  // Smooth scroll to results when they appear
  useEffect(() => {
    if (searched && !loading) {
      const resultsElement = document.getElementById('results');
      if (resultsElement) {
        resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  }, [searched, loading]);

  return (
    <Layout>
      <Hero />
      <SearchSection onSearch={handleSearch} loading={loading} />
      <ResultsSection 
        sourceMedicine={sourceMedicine} 
        results={results} 
        searched={searched} 
      />
    </Layout>
  );
}
