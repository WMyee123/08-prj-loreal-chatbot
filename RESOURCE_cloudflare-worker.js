// Copy this code into your Cloudflare Worker script

export default {
  async fetch(request, env) {
    const corsHeaders = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Content-Type": "application/json",
    };

    // Handle CORS preflight requests
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    const apiKey = env.OPENAI_API_KEY;
    const apiUrl = "https://api.openai.com/v1/chat/completions";
    const userInput = await request.json();

    const prompt =
      userInput.messages?.find((message) => message.role === "user")?.content ||
      "";
    const normalizedPrompt = prompt.toLowerCase();

    const isAllowedPrompt = allowedKeywords.some((keyword) =>
      normalizedPrompt.includes(keyword),
    );

    if (!isAllowedPrompt) {
      return new Response(
        JSON.stringify({
          error:
            "Please ask about skincare, haircare, or L'Oréal products only.",
        }),
        { status: 400, headers: corsHeaders },
      );
    }

    const requestBody = {
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful beauty assistant for L'Oréal. Only answer skincare, haircare, or L'Oréal product questions. Keep answers short and beginner friendly.",
        },
        ...userInput.messages.filter((message) => message.role !== "system"),
      ],
      max_completion_tokens: 300,
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();

    return new Response(JSON.stringify(data), { headers: corsHeaders });
  },
};
