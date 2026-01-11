import React from 'react';
import { Product } from './types';

export const WHATSAPP_NUMBER = '595983448866';

export const BRAND_ASSETS = {
  // Estos son los links que extraje de tu HTML
  LOGO_PLATA: 'https://i.ibb.co/4nTsgkb3/Gemini-Generated-Image-wyuic7wyuic7wyui.png',
  TUMARCA1: 'https://i.ibb.co/3YvvWCnb/Gemini-Generated-Image-mso91lmso91lmso9.png',
  TUMARCA2: 'https://i.ibb.co/MDBJGJ3W/Tu-Marca2-png.jpg',
};

export const MOTIVATIONAL_PHRASES = [
  "Te queda perfecto.",
  "Justo para ti.",
  "Elegante en el detalle, impecable en ti.",
  "Se ve natural, como si fuera hecho para ti.",
  "El resultado es armonioso y muy favorecedor."
];

export const INVENTORY: Product[] = [
  {
    id: "shoe-01",
    name: "Sandalia con tachas, taco 7",
    price: "Gs. 370.000",
    category: 'Calzado',
    description: 'Elegancia y altura para tus noches especiales.',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: "bag-01",
    name: "Cartera de cuero 100%",
    price: "450.000 Gs.",
    category: 'Cartera',
    description: 'El complemento perfecto para tu outfit.',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop'
  }
];

export const LabIALogo: React.FC = () => (
  <div className="flex flex-col items-end opacity-90">
    <div className="flex items-center space-x-1">
      <span className="text-[8px] text-white/50 font-light uppercase">Desarrollado por:</span>
      <span className="text-xs font-bold text-white">Lab<span className="text-cyan-400">.IA</span>®</span>
    </div>
  </div>
);
