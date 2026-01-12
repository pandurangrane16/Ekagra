const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

// WebSocket server
const wss = new WebSocket.Server({ server });

/**
 * Broadcast alert to all connected clients
 */
function broadcastAlert(alert) {
  const payload = JSON.stringify({
    event: "alert",
    data: alert,
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(payload);
    }
  });
}

// WebSocket connection
wss.on("connection", (ws) => {
  console.log("Client connected");

  ws.on("message", (message) => {
    try {
      const alert = JSON.parse(message);

      // Basic validation
      if (!alert.message || !alert.type) {
        ws.send(
          JSON.stringify({
            event: "error",
            message: "Invalid Alert format",
          })
        );
        return;
      }

      alert.id = alert.id ?? Date.now();

      console.log("Alert received:", alert);

      // Broadcast alert
      broadcastAlert(alert);
    } catch (err) {
      ws.send(
        JSON.stringify({
          event: "error",
          message: "Invalid JSON",
        })
      );
    }
  });

  ws.on("close", () => {
    console.log("Client disconnected");
  });
});

// Optional REST API to send alerts
app.post("/send-alert", (req, res) => {
  const alert = req.body;

  if (!alert.message || !alert.type) {
    return res.status(400).json({ error: "Invalid Alert format" });
  }

  alert.id = alert.id ?? Date.now();
  broadcastAlert(alert);

  res.json({ status: "Alert sent", alert });
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`🚀 WebSocket server running on http://localhost:${PORT}`);
});
