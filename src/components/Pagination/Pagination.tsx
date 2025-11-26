import styles from './Pagination.module.css';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

/**
 * Componente de paginação
 *
 * Mostra botões: [Anterior] [1] ... [5] [6] [7] ... [Último] [Próximo]
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) {
    return null; // Não mostra se há só 1 página
  }

  // Calcula quais números de página mostrar
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const delta = 1; // Páginas ao lado da atual

    // Sempre mostra primeira página
    pages.push(1);

    // Se há gap entre 1 e (currentPage - delta), mostra ...
    if (currentPage - delta > 2) {
      pages.push('...');
    }

    // Mostra páginas ao redor da atual
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }

    // Se há gap entre (currentPage + delta) e última página, mostra ...
    if (currentPage + delta < totalPages - 1) {
      pages.push('...');
    }

    // Sempre mostra última página (se > 1)
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className={styles.container} aria-label="Navegação de páginas">
      <button
        className={styles.button}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Página anterior"
      >
        ← Anterior
      </button>

      <div className={styles.pages}>
        {pageNumbers.map((page, idx) => (
          <button
            key={idx}
            className={`${styles.pageButton} ${page === currentPage ? styles.active : ''}`}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...' || page === currentPage}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
      </div>

      <button
        className={styles.button}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Próxima página"
      >
        Próximo →
      </button>

      <span className={styles.info} aria-live="polite">
        Página {currentPage} de {totalPages}
      </span>
    </nav>
  );
}
