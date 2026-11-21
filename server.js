const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "15mb" }));

app.get("/", (req, res) => {
  res.send("Priya Voice Backend is Running!");
});

app.get("/health", (req, res) => {
  res.json({
    status: "online",
    assistant: "Mini AI"
  });
});

app.post("/chat", async (req, res) => {
  try {
    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey) {
      return res.status(500).json({
        error: {
          message: "Groq API key missing on server"
        }
      });
    }

    const systemPrompt = `
You are Mini AI, a helpful AI assistant.

- Your name is Mini AI.
- Reply naturally and helpfully.
- If the user speaks Hindi, reply in Hindi.
- Understand Hinglish and simple English.
- Be polite, clear, and friendly.
- Explain things in simple words.
- Do not claim to know things you do not know.
- Do not invent live information.
- If live information is unavailable, say so honestly.
- Respect the date and time provided in the user's system message.
`;

    const originalMessages = Array.isArray(req.body.messages)
      ? req.body.messages
      : [];

    // Android ka existing system message preserve karo
    const oldSystemMessages = originalMessages.filter(
      msg => msg.role === "system"
    );

    const otherMessages = originalMessages.filter(
      msg => msg.role !== "system"
    );

    // Purane date/time instructions ko bhi preserve karo
    const oldSystemContent = oldSystemMessages
      .map(msg => msg.content)
      .filter(Boolean)
      .join("\n");

    const finalSystemMessage = {
      role: "system",
      content: systemPrompt + "\n" + oldSystemContent
    };

    const requestBody = {
      ...req.body,
      messages: [
        finalSystemMessage,
        ...otherMessages
      ]
    };

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + apiKey
        },
        body: JSON.stringify(requestBody)
      }
    );

    const data = await response.json();

    return res.status(response.status).json(data);

  } catch (error) {
    return res.status(500).json({
      error: {
        message: error.message
      }
    });
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Mini AI Backend running on port " + PORT);
});
