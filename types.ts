export enum AppState {
  UNBOXING = 'UNBOXING',
  ONBOARDING = 'ONBOARDING',
  CAPTURE_FACE = 'CAPTURE_FACE',
  SELECT_OUTFIT = 'SELECT_OUTFIT',
  SELECT_PRODUCT = 'SELECT_PRODUCT',
  GENERATING = 'GENERATING',
  RESULT = 'RESULT'
}

export interface Product {
  id: string;
  name: string;
  price: string;
  category: 'Cartera' | 'Calzado' | 'Accesorio';
  image: string;
  description: string;
}

export interface GenerationResult {
  decisionImage: string;
  contextImage: string;
  motivationalLine: string;
}
