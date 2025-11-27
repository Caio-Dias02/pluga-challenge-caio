import { useState } from 'react';
import type { Tool } from '../../types';
import styles from './ToolCard.module.css';

interface ToolCardProps {
  tool: Tool;
  onClick: (tool: Tool) => void;
}

export function ToolCard({ tool, onClick }: ToolCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Extrai primeira letra para fallback
  const initials = tool.name.charAt(0).toUpperCase();

  return (
    <button
      className={styles.card}
      onClick={() => onClick(tool)}
      style={{ borderTopColor: tool.color }}
      title={tool.name}
    >
      <div className={styles.iconContainer}>
        {!imageError && (
          <img
            src={tool.icon}
            alt={`${tool.name} icon`}
            className={styles.icon}
            style={{ display: imageLoaded ? 'block' : 'none' }}
            onLoad={() => setImageLoaded(true)}
            onError={() => {
              setImageLoaded(true);
              setImageError(true);
            }}
          />
        )}

        {imageError && (
          <div
            className={styles.fallbackIcon}
            style={{ backgroundColor: tool.color }}
          >
            {initials}
          </div>
        )}
      </div>

      <p className={styles.name}>{tool.name}</p>
    </button>
  );
}
