import { IncomingMessage, ServerResponse } from "http";
import { headers, endpoint, errMessages, reqUser } from "../types";
import { usersDB } from "./usersDB";

export class RequestManager {
  endpoint = endpoint;
  headers = headers;

  constructor() { }

  private sendResponse(res: ServerResponse, statusCode: number, data: unknown) {
    res.writeHead(statusCode, this.headers);
    res.end(JSON.stringify(data));
  }

  async handleRequest(req: IncomingMessage, res: ServerResponse) {
    try {
      const { method, url } = req;

      if (url === "/") {
        return this.sendResponse(res, 404, {
          message: errMessages.nonEndpoint,
        });
      }

      if (!url) {
        return this.sendResponse(res, 404, {
          message: errMessages.invalidEndpoint,
        });
      }

      // --- GET /api/users ---
      if (url === this.endpoint && method === "GET") {
        return await this.handleGetUsers(res);
      }

      // --- POST /api/users ---
      if (url === this.endpoint && method === "POST") {
        return await this.handlePostUser(req, res);
      }

      this.sendResponse(res, 404, { message: errMessages.invalidEndpoint });
    } catch (err) {
      console.error(err);
      this.sendResponse(res, 500, { message: "Internal Server Error" });
    }
  }

  private async handleGetUsers(res: ServerResponse) {
    const users = await usersDB.getAllUsers();
    return this.sendResponse(res, 200, users);
  }

  private async handlePostUser(req: IncomingMessage, res: ServerResponse) {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", async () => {
      try {
        const parsed: reqUser = JSON.parse(body);

        if (
          typeof parsed.username !== "string" ||
          typeof parsed.age !== "number" ||
          !Array.isArray(parsed.hobbies)
        ) {
          return this.sendResponse(res, 400, {
            message: errMessages.invalidRequest,
          });
        }

        await usersDB.addUser(parsed);
        const allUsers = await usersDB.getAllUsers();
        const newUser = allUsers[allUsers.length - 1];

        return this.sendResponse(res, 201, newUser);
      } catch {
        return this.sendResponse(res, 400, {
          message: errMessages.invalidRequest,
        });
      }
    });
  }
}
