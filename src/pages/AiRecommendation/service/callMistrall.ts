export const callMistral = async (
  message: string
): Promise<{ text: string; wantsRec: boolean }> => {

  const res = await fetch("http://localhost:11434/api/chat", {
    method: "POST",
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