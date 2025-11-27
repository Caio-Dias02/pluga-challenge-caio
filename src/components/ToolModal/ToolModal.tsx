import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { Tool } from '../../types';
import { RecentToolsList } from '../RecentToolsList/RecentToolsList';
import styles from './ToolModal.module.css';

interface ToolModalProps {
  isOpen: boolean;
  tool: Tool | null;
  recentTools: Tool[];
  onClose: () => void;
  onRecentToolClick: (tool: Tool) => void;
}

/**
 * Modal de detalhes da ferramenta
 *
 * Usa React Portal para renderizar fora da DOM principal
 * Focus trap: mantém foco dentro do modal
 * ESC: fecha o modal
 * Backdrop click: fecha o modal
 */
export function ToolModal({
  isOpen,
  tool,
  recentTools,
  onClose,
  onRecentToolClick,
}: ToolModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Prevent body scroll quando modal aberto
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // ESC para fechar
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus trap: volta pro modal se sair com Tab
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = modalRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen || !tool) {
    return null;
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const content = (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div
        className={styles.modal}
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <button
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Fechar modal"
        >
          ✕
        </button>
        <div className={styles.content}>
          <div className={styles.toolInfo}>
            <img src={tool.icon} alt={tool.name} className={styles.icon} />
            <div className={styles.details}>
              <div className={styles.titleBox}>
                <h2 id="modal-title" className={styles.title}>
                  {tool.name}
                </h2>
              </div>
              <a
                href={tool.link}
                className={styles.button}
                target="_blank"
                rel="noopener noreferrer"
              >
                Acessar
              </a>
            </div>
          </div>

          <RecentToolsList
            tools={recentTools}
            currentToolId={tool.app_id}
            onToolClick={onRecentToolClick}
          />
        </div>
      </div>
    </div>
  );

  return createPortal(content, document.body);
}
