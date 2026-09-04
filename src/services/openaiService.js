/**
 * OpenAI / ChatGPT Service
 * Provides direct integration with OpenAI Chat Completions API (GPT-4o, GPT-4o-mini).
 * Reads key from localStorage or import.meta.env.VITE_OPENAI_API_KEY.
 */

class OpenAIService {
  constructor() {
    this.apiKey =
      localStorage.getItem('openai_api_key') ||
      import.meta.env?.VITE_OPENAI_API_KEY ||
      '';
    this.model =
      import.meta.env?.VITE_OPENAI_MODEL ||
      'gpt-4o-mini';
  }

  setApiKey(key) {
    this.apiKey = key;
    if (key) {
      localStorage.setItem('openai_api_key', key);
    } else {
      localStorage.removeItem('openai_api_key');
    }
  }

  getApiKey() {
    return this.apiKey;
  }

  hasApiKey() {
    return !!this.apiKey && this.apiKey.startsWith('sk-');
  }

  /**
   * Send a chat prompt to ChatGPT
   * @param {Array<{role: string, content: string}>} messages
   * @param {string} systemPrompt
   * @returns {Promise<string>}
   */
  async chatCompletion(messages = [], systemPrompt = '') {
    if (!this.hasApiKey()) {
      throw new Error('No valid OpenAI API key provided. Please configure your key in .env or Settings.');
    }

    const payloadMessages = [];
    if (systemPrompt) {
      payloadMessages.push({ role: 'system', content: systemPrompt });
    }
    payloadMessages.push(...messages);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: payloadMessages,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData?.error?.message || `OpenAI API Error: HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || 'No response received from ChatGPT.';
  }
}

export const openaiService = new OpenAIService();
