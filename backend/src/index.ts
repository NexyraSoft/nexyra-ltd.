import { app } from "./app";
import { connectDatabase } from "./config/db";
import { env } from "./config/env";

const PORT = Number(process.env.PORT) || 5000;

const startServer = async () => {
  try {
    await connectDatabase();
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

void startServer();
