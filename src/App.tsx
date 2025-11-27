import { useState } from 'react';
import type { Tool } from './types';
import { useToolsData } from './hooks/useToolsData';
import { useViewHistory } from './hooks/useViewHistory';
import { useSearchFilter } from './hooks/useSearchFilter';
import { usePagination } from './hooks/usePagination';
import { ITEMS_PER_PAGE } from './utils/constants';
import { SearchBar } from './components/SearchBar/SearchBar';
import { ToolGrid } from './components/ToolGrid/ToolGrid';
import { Pagination } from './components/Pagination/Pagination';
import { ToolModal } from './components/ToolModal/ToolModal';
import styles from './App.module.css';

/**
 * Componente raiz da aplicação
 *
 * Responsabilidades:
 * - Buscar dados da API
 * - Gerenciar estado global (busca, página, modal)
 * - Coordenar hooks e componentes
 * - Rastrear histórico de visualizações
 */
function App() {

  const { tools, loading, error } = useToolsData();

  const { recentTools, addToHistory } = useViewHistory(tools);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTool, setSelectedTool] = useState<Tool | null>(null);

  const filteredTools = useSearchFilter(tools, searchQuery);

  const {
    currentItems,
    totalPages,
    currentPage,
    goToPage,
  } = usePagination(filteredTools, ITEMS_PER_PAGE);

  const handleToolClick = (tool: Tool) => {
    setSelectedTool(tool);
    addToHistory(tool);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    goToPage(1); // Volta pra primeira página ao buscar
  };

  const handleCloseModal = () => {
    setSelectedTool(null);
  };

  const handleRecentToolClick = (tool: Tool) => {
    setSelectedTool(tool);
    addToHistory(tool);
  };

  return (
    <div className={styles.app}>
      <main className={styles.main}>
        <div className={styles.container}>
          <SearchBar
            value={searchQuery}
            onChange={handleSearchChange}
            onClear={() => goToPage(1)}
            placeholder="Buscar ferramenta..."
          />

          <ToolGrid
            tools={currentItems}
            loading={loading}
            error={error}
            onToolClick={handleToolClick}
          />

          {filteredTools.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={goToPage}
            />
          )}
        </div>
      </main>

      <ToolModal
        isOpen={!!selectedTool}
        tool={selectedTool}
        recentTools={recentTools}
        onClose={handleCloseModal}
        onRecentToolClick={handleRecentToolClick}
      />
    </div>
  );
}

export default App;
