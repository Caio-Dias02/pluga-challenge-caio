# Pluga Challenge

Aplicação React com lista de ferramentas, busca, paginação, modal e histórico de visualizações.

## ✅ Funcionalidades

- Grid de 12 cards por página
- Busca em tempo real (case-insensitive)
- Paginação com controles
- Modal com detalhes e link da ferramenta
- Histórico das 3 últimas ferramentas visualizadas (localStorage)
- Estados vazios e erro tratados
- Responsivo (mobile, tablet, desktop)
- TypeScript com tipos rigorosos
- Testes automatizados (33 testes)

## 🚀 Comandos

```bash
npm install          # Instalar dependências
npm run dev          # Rodar em desenvolvimento (http://localhost:5173)
npm run build        # Build para produção
npm test             # Rodar testes
npm run test:watch   # Testes em watch mode
npm run lint         # Verificar código
```

## 📁 Estrutura

```
src/
├── components/      # Componentes React
├── hooks/          # Lógica customizada (useToolsData, useViewHistory, etc)
├── services/       # API e localStorage
├── types/          # Interfaces TypeScript
├── utils/          # Constantes e helpers
└── App.tsx         # Componente raiz
```

## 🧪 Testes

- **usePagination.test.ts** (10 testes) - Lógica de paginação
- **useViewHistory.test.ts** (7 testes) - Histórico de visualizações
- **useSearchFilter.test.ts** (9 testes) - Filtro de busca
- **useToolsData.test.ts** (7 testes) - Fetch da API

Rodar: `npm test`

## 🛠️ Stack

- React 18 + TypeScript
- Vite (dev server + build)
- CSS Modules
- Jest + React Testing Library
- localStorage (histórico persistente)

## 📋 API

Dados carregados de: `https://pluga.co/ferramentas_search.json`

## 🎨 Design

- Cards com borda superior colorida
- Fallback de imagem (primeira letra em círculo)
- Modal com React Portal
- Layout responsivo com CSS Grid
