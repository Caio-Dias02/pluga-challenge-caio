import styles from './LoadingSpinner.module.css';

/**
 * Componente de carregamento - mostra animação enquanto busca dados
 */
export function LoadingSpinner() {
  return (
    <div className={styles.container} role="status" aria-live="polite">
      <div className={styles.spinner}></div>
      <p className={styles.text}>Carregando ferramentas...</p>
    </div>
  );
}
