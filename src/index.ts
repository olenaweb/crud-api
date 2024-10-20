import { EOL } from "os";
import "dotenv/config";
import { createServer, IncomingMessage, ServerResponse } from "http";

const host = "localhost";
export const port = parseInt(process.env.PORT!) || 3500;

export const Server = createServer(
  (req: IncomingMessage, res: ServerResponse) => {
    console.log('"req="', req);
    console.log('"res="', res);
  },
);

Server.listen(port, () => {
  process.stdout.write(`Server is running on http://${host}:${port}${EOL}`);
});
