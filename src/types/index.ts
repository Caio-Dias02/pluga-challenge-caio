/**
 * Tool - Representa uma ferramenta/app integrada na Pluga
 *
 * app_id: Identificador único (ex: "slack")
 * name: Nome da ferramenta (ex: "Slack")
 * color: Cor da marca em hexadecimal (ex: "#4A154B")
 * icon: URL do ícone SVG (ex: "https://assets.pluga.co/...")
 * link: URL para acessar a ferramenta (ex: "https://pluga.co/ferramentas/slack/integracao/")
 */
export interface Tool {
  app_id: string;
  name: string;
  color: string;
  icon: string;
  link: string;
}
