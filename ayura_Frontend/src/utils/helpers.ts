/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Medicine {
  id: string;
  name: string;
  company: string;
  salt: string;
  price: number;
  isGeneric: boolean;
  brandName?: string;
  discount?: number;
}

export const MEDICINES_DB: Medicine[] = [
  {
    id: '1',
    name: 'Crocin 500mg',
    company: 'GSK Consumer Healthcare',
    salt: 'Paracetamol (500mg)',
    price: 15.5,
    isGeneric: false,
    brandName: 'Crocin',
  },
  {
    id: '2',
    name: 'Paracip 500mg',
    company: 'Cipla Ltd',
    salt: 'Paracetamol (500mg)',
    price: 5.2,
    isGeneric: true,
    discount: 66,
  },
  {
    id: '3',
    name: 'P-500',
    company: 'Apex Laboratories',
    salt: 'Paracetamol (500mg)',
    price: 4.8,
    isGeneric: true,
    discount: 69,
  },
  {
    id: '4',
    name: 'Augmentin 625 Duo',
    company: 'GSK Pharmaceuticals',
    salt: 'Amoxycillin (500mg) + Clavulanic Acid (125mg)',
    price: 204.5,
    isGeneric: false,
    brandName: 'Augmentin',
  },
  {
    id: '5',
    name: 'Moxikind-CV 625',
    company: 'Mankind Pharma',
    salt: 'Amoxycillin (500mg) + Clavulanic Acid (125mg)',
    price: 112.0,
    isGeneric: true,
    discount: 45,
  },
  {
    id: '6',
    name: 'Novamox CV 625',
    company: 'Cipla Ltd',
    salt: 'Amoxycillin (500mg) + Clavulanic Acid (125mg)',
    price: 125.5,
    isGeneric: true,
    discount: 38,
  },
  {
    id: '7',
    name: 'Pan-D',
    company: 'Alkem Laboratories',
    salt: 'Pantoprazole (40mg) + Domperidone (30mg)',
    price: 198.0,
    isGeneric: false,
    brandName: 'Pan-D',
  },
  {
    id: '8',
    name: 'Pantosec D',
    company: 'Cipla Ltd',
    salt: 'Pantoprazole (40mg) + Domperidone (30mg)',
    price: 104.5,
    isGeneric: true,
    discount: 47,
  },
];

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
};
