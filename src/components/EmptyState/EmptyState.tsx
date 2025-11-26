import styles from './EmptyState.module.css';

interface EmptyStateProps {
  title: string;
  message?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

/**
 * Componente para mostrar quando não há resultados
 *
 * @param title - Título da mensagem (ex: "Nenhuma ferramenta encontrada")
 * @param message - Mensagem adicional (opcional)
 * @param action - Botão com ação (opcional)
 */
export function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <div className={styles.container}>
      <div className={styles.icon}>📭</div>
      <h2 className={styles.title}>{title}</h2>

      {message && <p className={styles.message}>{message}</p>}

      {action && (
        <button className={styles.button} onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}
