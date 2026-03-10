const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());

app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;
  if (!userMessage) return res.status(400).json({ error: "No message provided" });

  try {
    const response = await axios.post(
      "https://api.anthropic.com/v1/messages",
      {
        model: "claude-sonnet-4-20250514",
        max_tokens: 300,
        messages: [{ role: "user", content: userMessage }]
      },
      {
        headers: {
          "x-api-key": process.env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
          "content-type": "application/json"
        }
      }
    );
    const reply = response.data.content[0].text;
    res.json({ reply });
  } catch (err) {
    console.error("FULL ERROR:", JSON.stringify(err.response?.data || err.message));
    res.status(500).json({ error: err.response?.data || err.message });
  }
});

app.listen(3000, () => console.log("Proxy running on port 3000"));
