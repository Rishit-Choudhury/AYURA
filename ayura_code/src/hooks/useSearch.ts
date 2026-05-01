/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { MEDICINES_DB, Medicine } from '../utils/helpers';

export const useSearch = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Medicine[]>([]);
  const [sourceMedicine, setSourceMedicine] = useState<Medicine | null>(null);
  const [searched, setSearched] = useState(false);

  const searchGenerics = async (query: string) => {
    if (!query) return;

    setLoading(true);
    setSearched(false);
    
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const lowercaseQuery = query.toLowerCase();
    
    // Find matching source medicine or generic
    const match = MEDICINES_DB.find(
      (m) => m.name.toLowerCase().includes(lowercaseQuery) || m.salt.toLowerCase().includes(lowercaseQuery)
    );

    if (match) {
      // Find all medicines with the same salt composition
      const related = MEDICINES_DB.filter((m) => m.salt === match.salt);
      const brand = related.find(m => !m.isGeneric) || match;
      const genericAlternatives = related.filter(m => m.isGeneric);

      setSourceMedicine(brand);
      setResults(genericAlternatives);
    } else {
      setSourceMedicine(null);
      setResults([]);
    }

    setLoading(false);
    setSearched(true);
  };

  return {
    loading,
    results,
    sourceMedicine,
    searched,
    searchGenerics,
  };
};
