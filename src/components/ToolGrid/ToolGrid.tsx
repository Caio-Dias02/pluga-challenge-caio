import type { Tool } from '../../types';
import { ToolCard } from '../ToolCard/ToolCard';
import { LoadingSpinner } from '../LoadingSpinner/LoadingSpinner';
import { EmptyState } from '../EmptyState/EmptyState';
import styles from './ToolGrid.module.css';

interface ToolGridProps {
  tools: Tool[];
  loading: boolean;
  error?: Error | null;
  onToolClick: (tool: Tool) => void;
  onRetry?: () => void;
}

/**
 * Componente que exibe uma grade de ferramentas
 *
 * - 4 colunas em desktop, responsivo em mobile
 * - Mostra LoadingSpinner enquanto carrega
 * - Mostra EmptyState quando não há resultados
 */
export function ToolGrid({
  tools,
  loading,
  error,
  onToolClick,
  onRetry,
}: ToolGridProps) {
  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <EmptyState
        title="Erro ao carregar ferramentas"
        message={error.message || 'Tente novamente mais tarde'}
        action={
          onRetry ? { label: 'Tentar novamente', onClick: onRetry } : undefined
        }
      />
    );
  }

  if (tools.length === 0) {
    return (
      <EmptyState
        title="Nenhuma ferramenta encontrada"
        message="Tente usar outras palavras na busca"
      />
    );
  }

  return (
    <div className={styles.grid}>
      {tools.map((tool) => (
        <ToolCard key={tool.app_id} tool={tool} onClick={onToolClick} />
      ))}
    </div>
  );
}
