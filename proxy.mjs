import express from "express";
import cors from "cors";
import { createProxyMiddleware } from "http-proxy-middleware";

const app = express();

// ✅ Abilita CORS per il tuo dominio Surge
app.use(cors({
  origin: "https://traveler-web-app.surge.sh",
}));

app.use(express.json());
app.options("*", cors());

// ✅ Proxy corretto verso Ollama
app.use(
  "/api/generate",
  createProxyMiddleware({
    target: "http://127.0.0.1:11434", // Ollama locale
    changeOrigin: true,
    pathRewrite: { "^/api": "" }, // riscrive /api/generate -> /generate
    onProxyReq: (proxyReq, req, res) => {
      if (req.body) {
        const bodyData = JSON.stringify(req.body);
        proxyReq.setHeader("Content-Type", "application/json");
        proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
        proxyReq.write(bodyData);
      }
    },
    onError: (err, req, res) => {
      console.error("Proxy error:", err);
      res.status(500).json({ error: "Proxy error: " + err.message });
    },
  })
);

// Test route
app.get("/", (req, res) => res.send("Proxy online ✅"));

app.listen(3001, () =>
  console.log("✅ Proxy running on https://trout-polished-insect.ngrok-free.app")
);
