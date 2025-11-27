// Importa matchers extras do React Testing Library
// (tipo .toBeInTheDocument(), .toBeVisible(), etc)
require('@testing-library/jest-dom');

// ============================================
// MOCK DO LOCALSTORAGE
// ============================================
// Por quê?
// - O jsdom (fake browser) não tem localStorage real
// - Mocking permite CONTROLAR e VERIFICAR o localStorage
// - jest.fn() cria uma função "espiã" que registra chamadas
//
// Exemplo:
// localStorage.setItem('key', 'value')
// expect(localStorage.setItem).toHaveBeenCalledWith('key', 'value')
// ============================================

const localStorageMock = {
  // Simula: localStorage.getItem('chave')
  getItem: jest.fn(),

  // Simula: localStorage.setItem('chave', 'valor')
  setItem: jest.fn(),

  // Simula: localStorage.removeItem('chave')
  removeItem: jest.fn(),

  // Simula: localStorage.clear()
  clear: jest.fn(),
};

global.localStorage = localStorageMock;

// Nota: beforeEach com mockClear() é feito em cada teste
// que usa localStorage para evitar conflitos com tests que
// não usam localStorage

// Opcional: Suprime console.error para testes mais limpos
// (algumas bibliotecas fazem console.error de warnings)
global.console.error = jest.fn();
