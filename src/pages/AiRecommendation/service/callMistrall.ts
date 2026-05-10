export const callMistral = async (
  message: string
): Promise<{ text: string; wantsRec: boolean }> => {

  // Abort if Ollama is not reachable within 3s so the UI never hangs.
  const controller = new AbortController();
  const timeoutId  = setTimeout(() => controller.abort(), 3000);

  const res = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
    signal: controller.signal,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "mistral",
      messages: [
        {
          role: "system",
          content: `
You are an assistant for a 3D printing store.

Return ONLY JSON:
{
  "text": "...",
  "intent": "REC" | "CHAT"
}

Rules:
- REC only if user explicitly asks for recommendations
- otherwise CHAT
- no extra text
          `,
        },
        { role: "user", content: message },
      ],
      stream: false,
    }),
  });

  clearTimeout(timeoutId);
  const data = await res.json();

  let parsed;

  try {
    parsed = JSON.parse(data?.message?.content ?? "{}");
  } catch {
    parsed = { text: data?.message?.content ?? "", intent: "CHAT" };
  }

  return {
    text: parsed.text ?? "",
    wantsRec: parsed.intent === "REC",
  };
};