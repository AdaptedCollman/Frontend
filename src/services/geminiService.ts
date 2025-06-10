// טיפוס חדש
interface GeminiMessage {
  role: 'user' | 'assistant';
  content: string;
}

export async function sendToGemini(messages: GeminiMessage[]): Promise<string> {
  try {
    const response = await fetch('http://localhost:3000/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get response from Gemini backend');
    }

    const data = await response.json();
    return data.text || "Sorry, I couldn't understand that.";
  } catch (error: unknown) {
    let errorMsg = 'Unable to connect to Gemini backend.';
    if (error instanceof Error) {
      errorMsg = error.message;
    }
    return `Error: ${errorMsg}`;
  }
}
