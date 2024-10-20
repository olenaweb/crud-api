import { EOL } from "os";
import "dotenv/config";
import { createServer, IncomingMessage, ServerResponse } from "http";

const host = "localhost";
export const port = parseInt(process.env.PORT!) || 3500;

export const server = createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    console.log('"req="', req);
    console.log('"res="', res);
  },
);

server.listen(port).on("listening", () => {
  console.log(`Server HTTP is listening on http://${host}:${port}${EOL}`);
});
