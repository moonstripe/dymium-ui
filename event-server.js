import { createServer } from "http";
import { randomUUID } from "crypto";

const messages = [
  {
    status_code: "200",
    level: "INFO",
    message: "User login successful",
    source: "auth-service",
  },
  {
    status_code: "500",
    level: "ERROR",
    message: "Database connection failed",
    source: "db-service",
  },
  {
    status_code: "404",
    level: "WARN",
    message: "API endpoint not found",
    source: "api-gateway",
  },
  {
    status_code: "401",
    level: "WARN",
    message: "Unauthorized access attempt detected",
    source: "auth-service",
  },
  {
    status_code: "200",
    level: "INFO",
    message: "Cache refreshed successfully",
    source: "cache-service",
  },
  {
    status_code: "503",
    level: "ERROR",
    message: "Service unavailable",
    source: "payment-service",
  },
  {
    status_code: "302",
    level: "INFO",
    message: "User redirected to new login page",
    source: "web-service",
  },
  {
    status_code: "403",
    level: "WARN",
    message: "Forbidden resource access attempt",
    source: "auth-service",
  },
  {
    status_code: "201",
    level: "INFO",
    message: "New user account created",
    source: "user-service",
  },
  {
    status_code: "409",
    level: "ERROR",
    message: "Data conflict: User email already exists",
    source: "user-service",
  },
];

function getRandomMessage() {
  const message = { ...messages[Math.floor(Math.random() * messages.length)] };
  message.id = randomUUID();
  message.timestamp = new Date().toISOString();
  return message;
}

const server = createServer((req, res) => {
  if (req.url === "/events") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Access-Control-Allow-Origin": "*",
    });

    const interval = setInterval(
      () => {
        const message = getRandomMessage();
        res.write(`data: ${JSON.stringify(message)}\n\n`);
      },
      Math.random() * 400 + 100,
    );

    req.on("close", () => {
      clearInterval(interval);
    });
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("Not Found");
  }
});

server.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
