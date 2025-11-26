import { useEffect, useState, useRef } from 'react';
import { SEARCH_DEBOUNCE_MS } from '../../utils/constants';
import styles from './SearchBar.module.css';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  placeholder?: string;
}

/**
 * Componente de barra de busca com debounce
 *
 * Debounce = espera o usuário parar de digitar por 300ms antes de chamar onChange
 * Isso evita filtrar a cada letra digitada (melhora performance)
 */
export function SearchBar({
  value,
  onChange,
  onClear,
  placeholder = 'Buscar ferramenta...',
}: SearchBarProps) {
  const [inputValue, setInputValue] = useState(value);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Se value muda de fora, atualiza input
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Debounce: espera 300ms depois da última digitação
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Limpa timeout anterior
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Cria novo timeout
    timeoutRef.current = setTimeout(() => {
      onChange(newValue);
    }, SEARCH_DEBOUNCE_MS);
  };

  // Limpa busca
  const handleClear = () => {
    setInputValue('');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    onChange('');
    onClear?.();
  };

  return (
    <div className={styles.container}>
      <div className={styles.inputWrapper}>
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={styles.input}
          aria-label="Buscar ferramentas"
        />

        {inputValue && (
          <button
            className={styles.clearButton}
            onClick={handleClear}
            title="Limpar busca"
            aria-label="Limpar busca"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
