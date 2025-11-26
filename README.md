# Pluga Challenge - Desafio Técnico Jr

Aplicação React que exibe uma lista de ferramentas integradas da Pluga com busca, paginação, modal com detalhes e histórico de visualizações.

## 📋 Requisitos Atendidos

- ✅ Grid de cards mostrando ferramentas (12 por página)
- ✅ Barra de busca com filtro em tempo real
- ✅ Paginação com controles
- ✅ Modal ao clicar no card com:
  - Ícone e nome da ferramenta
  - Link "ACESSAR" (mesma aba)
  - Seção "Últimas ferramentas visualizadas" (últimas 3)
- ✅ Histórico persistente em localStorage
- ✅ Estados vazios (sem resultados, sem histórico, erro)
- ✅ Responsivo (mobile, tablet, desktop)
- ✅ TypeScript com tipos rígidos
- ✅ CSS Modules com separação de responsabilidades
- ✅ Código legível e nomes expressivos

## 🚀 Como Rodar

### 1. Instalar dependências
```bash
npm install
```

### 2. Rodar em desenvolvimento
```bash
npm run dev
```
Abre em http://localhost:5173/

### 3. Build para produção
```bash
npm run build
```

### 4. Visualizar build
```bash
npm run preview
```

## 📁 Estrutura de Pastas

```
src/
├── components/        # Componentes React
│   ├── ToolCard/     # Card individual (ícone + nome + borda colorida)
│   ├── ToolGrid/     # Grid de cards responsivo
│   ├── SearchBar/    # Busca com debounce
│   ├── Pagination/   # Controles de página
│   ├── ToolModal/    # Modal com portal
│   ├── RecentToolsList/  # Últimas 3 ferramentas
│   ├── EmptyState/   # Estado vazio reutilizável
│   └── LoadingSpinner/   # Carregamento
├── hooks/            # Lógica customizada
│   ├── useToolsData.ts      # Busca da API
│   ├── useViewHistory.ts    # Histórico em localStorage
│   ├── useSearchFilter.ts   # Filtro por nome
│   └── usePagination.ts     # Paginação client-side
├── services/         # Funções de API e armazenamento
│   ├── api.ts        # Fetch das ferramentas
│   └── storage.ts    # localStorage helpers
├── types/            # Interfaces TypeScript
├── utils/            # Constantes e funções utilitárias
├── App.tsx           # Componente raiz
├── App.module.css    # Estilos globais
├── main.tsx          # Entry point
├── index.css         # Reset e base global
└── vite-env.d.ts     # Tipos Vite
```

## 🎨 Design

- **Cores**: Branco/cinza neutro + cores das ferramentas
- **Cards**: Borda superior 4px colorida (cor da ferramenta)
- **Fallback de imagem**: Primeira letra do nome em círculo colorido
- **Modal**: Renderizado via React Portal
- **Layout**: CSS Grid responsivo (4 cols desktop, 3 tablet, 2 mobile)

## ⌨️ Funcionalidades

### Busca
- Debounce 300ms (não filtra a cada letra)
- Case-insensitive
- Botão limpar (X)
- Reset para página 1

### Paginação
- 12 itens por página
- Mostra números: [Prev] [1] ... [atual±1] ... [Last] [Next]
- Desativa botões nas extremidades

### Modal
- Abre ao clicar card
- Focus trap (Tab fica dentro)
- ESC para fechar
- Backdrop click fecha
- Link "ACESSAR" em mesma aba

### Histórico
- Armazena últimas 3 visualizações
- localStorage: `pluga_view_history`
- Resolve app_id → Tool object
- Persiste entre sessões

## 🛠️ Stack Técnico

- **React 18** + TypeScript (strict)
- **Vite** (dev server + build)
- **CSS Modules** (scoped styles)
- **Hooks** (useState, useEffect, useRef, useMemo, useCallback)
- **React Portal** (modal)
- **localStorage** (histórico)

## 📝 Boas Práticas

- **Separação de responsabilidades**: Componentes, hooks, services
- **Nomes expressivos**: `useViewHistory`, `addToViewHistory`, etc
- **Código legível**: Comentários explicativos, estrutura clara
- **Tipos TypeScript**: Interfaces para todas as props
- **Acessibilidade**: aria-labels, roles, focus management
- **Performance**: useMemo, debounce, CSS Grid
- **Responsividade**: Mobile-first approach

## 🧪 Testes Manuais

- [ ] Buscar por ferramenta
- [ ] Paginar resultados
- [ ] Clicar card → modal abre
- [ ] Link "ACESSAR" funciona
- [ ] Últimas ferramentas aparecem
- [ ] Histórico persiste ao refresh
- [ ] Sem resultados → EmptyState
- [ ] Erro na API → retry button
- [ ] Responsivo em mobile
