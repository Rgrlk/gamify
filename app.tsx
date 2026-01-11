import React, { useState, useRef } from 'react';
import { Camera, ShoppingBag, User, Shirt, Download, Share2, RefreshCw, ChevronRight } from 'lucide-react';
import { AppState, Product, GenerationResult } from './types';
import { INVENTORY, WHATSAPP_NUMBER, LabIALogo, BRAND_ASSETS, MOTIVATIONAL_PHRASES } from './constants';
import { GoogleGenAI } from "@google/genai";

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(AppState.UNBOXING);
  const [userFace, setUserFace] = useState<string | null>(null);
  const [userOutfit, setUserOutfit] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [result, setResult] = useState<GenerationResult | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('Iniciando...');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const nextStep = () => {
    if (state === AppState.UNBOXING) setState(AppState.ONBOARDING);
    else if (state === AppState.ONBOARDING) setState(AppState.CAPTURE_FACE);
    else if (state === AppState.CAPTURE_FACE) setState(AppState.SELECT_OUTFIT);
    else if (state === AppState.SELECT_OUTFIT) setState(AppState.SELECT_PRODUCT);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'face' | 'outfit') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (type === 'face') { setUserFace(reader.result as string); setState(AppState.SELECT_OUTFIT); }
        else { setUserOutfit(reader.result as string); setState(AppState.SELECT_PRODUCT); }
      };
      reader.readAsDataURL(file);
    }
  };

  const generateAI = async (product: Product) => {
    setSelectedProduct(product);
    setState(AppState.GENERATING);
    setLoadingMessage("Creando tu look...");

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [
          { text: `Moda de lujo. Mujer usando ${product.name}. Rostro basado en la imagen adjunta.` },
          { inlineData: { mimeType: "image/jpeg", data: userFace!.split(',')[1] } }
        ]},
      });

      let imgUrl = product.image;
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) imgUrl = `data:image/png;base64,${part.inlineData.data}`;
      }

      setResult({
        decisionImage: imgUrl,
        contextImage: product.image,
        motivationalLine: MOTIVATIONAL_PHRASES[Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)]
      });
      setState(AppState.RESULT);
    } catch (e) {
      setState(AppState.SELECT_PRODUCT);
    }
  };

  return (
    <div className="max-w-md mx-auto h-screen bg-[#111111] text-white overflow-hidden flex flex-col relative">
      {state === AppState.UNBOXING && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-in fade-in">
          <img src={BRAND_ASSETS.LOGO_PLATA} className="h-16 mb-12" />
          <div className="glass-card p-6 rounded-2xl mb-8 silver-border">
            <img src={BRAND_ASSETS.TUMARCA2} className="w-full rounded-lg" />
            <p className="mt-4 font-serif italic text-xl silver-text-glossy">Enjoy it</p>
          </div>
          <button onClick={nextStep} className="silver-glossy text-black px-12 py-4 rounded-full font-bold uppercase tracking-widest text-xs">Continuar</button>
        </div>
      )}

      {state === AppState.ONBOARDING && (
        <div className="flex-1 p-6 flex flex-col items-center animate-in slide-in-from-right">
          <img src={BRAND_ASSETS.LOGO_PLATA} className="h-10 self-start mb-8" />
          <img src={BRAND_ASSETS.TUMARCA1} className="w-48 h-48 object-cover rounded-2xl mb-8 silver-border" />
          <p className="text-xs text-center text-white/70 leading-relaxed mb-10">
            Con Glamify puedes verte con nuestros productos antes de decidir. Una experiencia creada para tu seguridad y estilo.
          </p>
          <button onClick={nextStep} className="w-full silver-glossy text-black py-4 rounded-full font-bold uppercase text-xs">Empezar</button>
        </div>
      )}

      {state === AppState.CAPTURE_FACE && (
        <div className="flex-1 p-8 flex flex-col items-center justify-center animate-in fade-in">
          <div className="w-32 h-32 rounded-full silver-border flex items-center justify-center mb-8 glass-card">
            <Camera size={40} />
          </div>
          <p className="mb-8 text-center">Sube una foto de tu rostro para comenzar</p>
          <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={(e) => handleFileUpload(e, 'face')} />
          <button onClick={() => fileInputRef.current?.click()} className="w-full silver-glossy text-black py-4 rounded-full font-bold uppercase text-xs">Subir Foto</button>
        </div>
      )}

      {state === AppState.SELECT_PRODUCT && (
        <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
          <img src={BRAND_ASSETS.LOGO_PLATA} className="h-8 mb-8" />
          <div className="grid gap-6">
            {INVENTORY.map(p => (
              <div key={p.id} onClick={() => generateAI(p)} className="glass-card rounded-2xl overflow-hidden silver-border">
                <img src={p.image} className="w-full h-48 object-cover" />
                <div className="p-4 flex justify-between items-center">
                  <div>
                    <h3 className="font-serif italic text-lg">{p.name}</h3>
                    <p className="text-sm font-bold">{p.price}</p>
                  </div>
                  <ChevronRight />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {state === AppState.GENERATING && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 animate-pulse">
          <RefreshCw className="animate-spin mb-4" size={48} />
          <h2 className="text-xl font-serif italic silver-text-glossy">{loadingMessage}</h2>
        </div>
      )}

      {state === AppState.RESULT && (
        <div className="flex-1 p-6 overflow-y-auto">
          <img src={BRAND_ASSETS.LOGO_PLATA} className="h-10 mb-6" />
          <div className="text-center mb-8">
            <p className="font-serif italic silver-text-glossy text-lg">¡Te ves increíble!</p>
            <p className="text-xs text-white/60 mt-2">{result?.motivationalLine}</p>
          </div>
          <div className="silver-border rounded-3xl overflow-hidden mb-8">
            <img src={result?.decisionImage} className="w-full" />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button onClick={() => window.open(`https://wa.me/${WHATSAPP_NUMBER}`)} className="silver-glossy text-black py-4 rounded-full font-bold text-[10px] uppercase">Comprar</button>
            <button onClick={() => setState(AppState.SELECT_PRODUCT)} className="glass-card py-4 rounded-full font-bold text-[10px] uppercase">Probar otro</button>
          </div>
        </div>
      )}

      <div className="p-4 flex justify-end">
        <LabIALogo />
      </div>
    </div>
  );
};

export default App;
