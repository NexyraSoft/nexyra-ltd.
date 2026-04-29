import { app } from "./app";
import { connectDatabase } from "./config/db";
import { env } from "./config/env";

const PORT = parseInt(process.env.PORT ?? "5000", 10);

const startServer = async () => {
  try {
    await connectDatabase();
    console.log("Database connected successfully");
    
    const server = app.listen(PORT, "0.0.0.0", () => {
      console.log(`✓ Server running on port ${PORT}`);
      console.log(`✓ Environment: ${env.nodeEnv}`);
      console.log(`✓ Allowed origins: ${env.clientUrl}`);
    });

    server.on("error", (err: NodeJS.ErrnoException) => {
      if (err.code === "EADDRINUSE") {
        console.error(`✗ Port ${PORT} is already in use`);
        process.exit(1);
      }
      throw err;
    });

    // Graceful shutdown
    process.on("SIGTERM", () => {
      console.log("SIGTERM received, shutting down gracefully");
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
