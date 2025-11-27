export default {
  // Usa TypeScript + esM
  preset: 'ts-jest',

  // Simula navegador (precisa pra testar React)
  testEnvironment: 'jsdom',

  // Procura por arquivos *.test.ts(x) ou *.spec.ts(x)
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)'
  ],

  // Arquivo que roda ANTES dos testes (setup global)
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],

  // Como transformar TypeScript em JavaScript
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
      }
    }]
  },

  // Diz ao Jest como tratar imports que não são JavaScript
  moduleNameMapper: {
    // CSS modules → vazio (não precisa de CSS em teste)
    '\\.module\\.(css|sass|scss)$': 'identity-obj-proxy',
    // CSS simples → mock vazio
    '\\.(css|sass|scss)$': '<rootDir>/__mocks__/styleMock.js',
    // Imagens → string dummy
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
  },

  // Coleta cobertura de testes (quanto do código foi testado)
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/main.tsx',
    '!src/**/*.d.ts',
  ],
};
