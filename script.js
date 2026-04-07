/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Replace this with your deployed Cloudflare Worker URL
const CLOUDFLARE_WORKER_URL =
  "https://prj-08-worker.myerswilliam04.workers.dev/";

// Set initial message
chatWindow.textContent = "👋 Hello! How can I help you today?";

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const prompt = userInput.value.trim();

  if (!prompt) {
    return;
  }

  // Show the user's message first
  chatWindow.innerHTML = `<p><strong>You:</strong> ${prompt}</p><p>Thinking...</p>`;

  try {
    // Cloudflare Worker expects a `messages` array
    const response = await fetch(CLOUDFLARE_WORKER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content:
              "You are a helpful beauty assistant for L'Oreal. Keep answers short and beginner friendly.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      }),
    });

    const data = await response.json();
    const botReply = data.choices[0].message.content;

    chatWindow.innerHTML = `<p><strong>You:</strong> ${prompt}</p><p><strong>Assistant:</strong> ${botReply}</p>`;
    userInput.value = "";
  } catch (error) {
    chatWindow.innerHTML = `<p><strong>You:</strong> ${prompt}</p><p><strong>Assistant:</strong> Sorry, I could not reach the Cloudflare API.</p>`;
    console.error("Cloudflare request error:", error);
  }
});
