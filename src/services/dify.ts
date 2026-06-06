/**
 * Service to communicate with the Dify API.
 * Requests are routed through the Vite dev-server proxy (/dify-api → https://api.dify.ai)
 * to avoid browser CORS restrictions.
 */

export interface DifyMessageResponse {
  answer: string;
  conversation_id: string;
  message_id: string;
  created_at: number;
}

const DIFY_API_KEY = import.meta.env.VITE_DIFY_API_KEY;

// Always use the local proxy path so the browser never calls api.dify.ai directly.
// In production, point VITE_DIFY_PROXY_BASE to your own backend proxy.
const PROXY_BASE = import.meta.env.VITE_DIFY_PROXY_BASE ?? '/dify-api/v1';

/**
 * Sends a message to the Dify API via the Vite proxy.
 * @param query           The user's message
 * @param conversationId  Optional – keeps session context across turns
 */
export async function sendChatMessage(
  query: string,
  conversationId?: string
): Promise<DifyMessageResponse> {
  if (!DIFY_API_KEY) {
    console.error('[dify] VITE_DIFY_API_KEY is not set.');
    throw new Error('API key configuration error. Check your .env file.');
  }

  const endpoint = `${PROXY_BASE.replace(/\/$/, '')}/chat-messages`;

  const body: Record<string, unknown> = {
    inputs: {},
    query,
    response_mode: 'blocking',
    user: 'guest',
  };
  if (conversationId) {
    body.conversation_id = conversationId;
  }

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${DIFY_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[dify] ${response.status} ${response.statusText}`, errorText);
    // Try to extract a meaningful message from Dify's JSON error body
    let detail = response.statusText;
    try {
      const parsed = JSON.parse(errorText);
      if (parsed.message) detail = parsed.message;
    } catch { /* not JSON, use statusText */ }
    if (
  detail.includes('RESOURCE_EXHAUSTED') ||
  detail.includes('429') ||
  detail.includes('quota')
) {
  throw new Error(
    'Our AI assistant is currently experiencing high demand. Please try again in a minute.'
  );
}

throw new Error(`Dify API error: ${detail}`);
  }

  return response.json() as Promise<DifyMessageResponse>;
}
