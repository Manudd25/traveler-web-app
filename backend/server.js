import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import fetch from "node-fetch"; // Import fetch for API calls
import dotenv from "dotenv";

dotenv.config(); // Loads environment variables from a .env file into process.env

const app = express();
const PORT = process.env.PORT || 5000; // Use PORT from environment variables or default to 5000

// OpenAI API endpoint
const OPEN_ASSISTANT_API = "https://api.openai.com/v1/chat/completions";

// Middleware
app.use(cors()); // Enable Cross-Origin Resource Sharing
app.use(bodyParser.json()); // Parse JSON bodies

// Endpoint to interact with OpenAI API
app.post("/api/chat", async (req, res) => {
  const { prompt } = req.body;

  if (!prompt || typeof prompt !== "string") {
    return res.status(400).json({ error: "Invalid or missing 'prompt' in request body." });
  }

  console.log("Received prompt:", prompt); // Log the incoming prompt for debugging

  try {
    // Forward the user's prompt to the OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CHATBOT_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo", // Specify the model
        messages: [{ role: "user", content: prompt }],
      }),
    });

    // Check if the response is successful
    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API Error:", errorText);
      throw new Error("Failed to fetch a valid response from OpenAI API.");
    }

    const data = await response.json();
    console.log("OpenAI API Response:", data); // Log the response for debugging

    // Send the assistant's response back to the frontend
    res.json({ content: data.choices[0].message.content });
  } catch (error) {
    console.error("Error processing the request:", error.message);
    res.status(500).json({ error: "Internal Server Error. Please try again later." });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
