import { EOL } from "os";
import "dotenv/config";
import { createServer, IncomingMessage, ServerResponse } from "http";
import { RequestManager } from "./manager/requestManager";

const host = "localhost";
export const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 4000;

const requestManager = new RequestManager();

export const server = createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    const { url, method } = req;
    console.log("port = ", port, "method = ", method, "url = ", url);

    await requestManager.handleRequest(req, res);
  }
);

server.listen(port).on("listening", () => {
  console.log(
    `✅ Server HTTP is listening on http://${host}:${port}. Ctrl+C to exit${EOL}`
  );
});

process.on("SIGINT", () => {
  server.close(() => {
    console.log(`✅ Server HTTP closed on http://${host}:${port}${EOL}`);
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  server.close(() => {
    console.log(`✅ Server HTTP closed on http://${host}:${port}${EOL}`);
    process.exit(0);
  });
});
