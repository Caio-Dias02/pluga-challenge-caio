import type { Tool } from '../../types';
import styles from './RecentToolsList.module.css';

interface RecentToolsListProps {
  tools: Tool[];
  currentToolId?: string;
  onToolClick: (tool: Tool) => void;
}

export function RecentToolsList({
  tools,
  currentToolId,
  onToolClick,
}: RecentToolsListProps) {
  // Filtra a ferramenta atual e limita a 3 itens máximo
  const filteredTools = tools
    .filter((tool) => tool.app_id !== currentToolId)
    .slice(0, 3);

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Últimas ferramentas visualizadas</h3>

      {filteredTools.length === 0 ? (
        <p className={styles.empty}>Nenhuma ferramenta visualizada ainda</p>
      ) : (
        <div className={styles.list}>
          {filteredTools.map((tool) => (
            <button
              key={tool.app_id}
              className={styles.item}
              onClick={() => onToolClick(tool)}
              title={tool.name}
            >
              <img
                src={tool.icon}
                alt={`${tool.name} icon`}
                className={styles.icon}
              />
              <span className={styles.name}>{tool.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
