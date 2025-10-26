/**
 * MCP Registry Integration
 * Query and detect MCP servers for current site
 */

export interface MCPServer {
  name: string;
  description: string;
  repository?: string;
  url?: string;
  keywords?: string[];
  config?: {
    command: string;
    args: string[];
    env?: Record<string, string>;
  };
}

const MCP_REGISTRY_URL = 'https://registry.modelcontextprotocol.io/v0/servers';

let cachedServers: MCPServer[] | null = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes

/**
 * Query MCP Registry
 */
export async function queryMCPRegistry(): Promise<MCPServer[]> {
  // Check cache
  const now = Date.now();
  if (cachedServers && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedServers;
  }

  try {
    const response = await fetch(MCP_REGISTRY_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch MCP registry: ${response.status}`);
    }

    const data = await response.json();
    const servers = data.servers || data; // Handle different response formats
    cachedServers = servers;
    cacheTimestamp = now;

    return servers;
  } catch (error) {
    console.error('Error fetching MCP registry:', error);
    return [];
  }
}

/**
 * Search MCP servers by query
 */
export async function searchMCPServers(query: string): Promise<MCPServer[]> {
  const servers = await queryMCPRegistry();
  const lowerQuery = query.toLowerCase();

  return servers.filter(server =>
    server.name.toLowerCase().includes(lowerQuery) ||
    server.description.toLowerCase().includes(lowerQuery) ||
    server.keywords?.some(k => k.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Extract domain from URL
 */
function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

/**
 * Find MCP servers for current site (domain matching)
 */
export async function findMCPForCurrentSite(): Promise<MCPServer[]> {
  const currentDomain = window.location.hostname;
  const servers = await queryMCPRegistry();

  return servers.filter(server => {
    // Check repository URL
    if (server.repository) {
      const serverDomain = extractDomain(server.repository);
      if (serverDomain === currentDomain) return true;
    }

    // Check main URL
    if (server.url) {
      const serverDomain = extractDomain(server.url);
      if (serverDomain === currentDomain) return true;
    }

    // Check keywords
    if (server.keywords?.some(k => k.toLowerCase().includes(currentDomain))) {
      return true;
    }

    return false;
  });
}

/**
 * Detect MCP servers mentioned in page content
 */
export async function detectMCPServersInPage(): Promise<MCPServer[]> {
  const bodyText = document.body.textContent?.toLowerCase() || '';

  // Check if page mentions MCP
  const hasMCPMention =
    bodyText.includes('model context protocol') ||
    bodyText.includes('mcp server');

  if (!hasMCPMention) {
    return [];
  }

  // Extract repository URLs from page
  const repoLinks = Array.from(document.querySelectorAll('a[href*="github.com"]'))
    .map(a => (a as HTMLAnchorElement).href);

  // Check registry for matching repos
  const servers = await queryMCPRegistry();

  return servers.filter(server =>
    repoLinks.some(link => server.repository?.includes(link))
  );
}
