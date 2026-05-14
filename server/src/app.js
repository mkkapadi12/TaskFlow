import express from "express";
import cors from "cors";
import helmet from "helmet";
import routes from "./routes.js";
import { globalErrorHandler } from "./middlewares/error.middleware.js";
import env from "./config/env.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.client.url,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  }),
);
app.use(express.json());

app.get("/api", (req, res) =>
  res.json({ status: "ok", message: "API is live!" }),
);

app.use("/api", routes);

// 404 handler — for unknown routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

app.use(globalErrorHandler);

export default app;
