import { EOL } from "os";
import "dotenv/config";
import { createServer, IncomingMessage, ServerResponse } from "http";
import { RequestManager } from "./manager/requestManager.js";

const host = "localhost";
export const port = parseInt(process.env.PORT!) || 3500;

const requestManager = new RequestManager();

export const server = createServer(
  async (req: IncomingMessage, res: ServerResponse) => {
    const { url } = req;
    console.log("url = ", url);

    await requestManager.handleRequest(req, res);
  }
);

server.listen(port).on("listening", () => {
  console.log(`Server HTTP is listening on http://${host}:${port}${EOL}`);
});
