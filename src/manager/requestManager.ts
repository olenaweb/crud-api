import { IncomingMessage, ServerResponse } from "http";
import { headers, endpoint, errMessages, reqUser } from "../types";
import { usersDB } from "./usersDB";
import { validate as isValidUUID } from "uuid";

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

      // --- GET /api/users/{userId} ---
      if (url.startsWith(this.endpoint + "/") && method === "GET") {
        const userId = url.split("/").pop();
        return await this.handleGetUserById(res, userId);
      }

      // --- POST /api/users ---
      if (url === this.endpoint && method === "POST") {
        return await this.handlePostUser(req, res);
      }

      // --- PUT /api/users/{userId} ---
      if (url.startsWith(this.endpoint + "/") && method === "PUT") {
        const userId = url.split("/").pop();
        return await this.handlePutUser(req, res, userId);
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

  private async handleGetUserById(res: ServerResponse, userId: string | undefined) {
    if (!userId) {
      return this.sendResponse(res, 400, {
        message: "User ID is required"
      });
    }

    if (!isValidUUID(userId)) {
      return this.sendResponse(res, 400, {
        message: "Invalid user ID format"
      });
    }

    const user = await usersDB.getUserById(userId);

    if (!user) {
      return this.sendResponse(res, 404, {
        message: "User not found"
      });
    }

    return this.sendResponse(res, 200, user);
  }

  private async handlePutUser(req: IncomingMessage, res: ServerResponse, userId: string | undefined) {
    if (!userId) {
      return this.sendResponse(res, 400, {
        message: "User ID is required"
      });
    }

    if (!isValidUUID(userId)) {
      return this.sendResponse(res, 400, {
        message: "Invalid user ID format"
      });
    }

    const existingUser = await usersDB.getUserById(userId);
    if (!existingUser) {
      return this.sendResponse(res, 404, {
        message: "User not found"
      });
    }

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

        const userToUpdate = { id: userId, ...parsed };
        const updatedUser = await usersDB.updateUser(userToUpdate);
        return this.sendResponse(res, 200, updatedUser);
      } catch {
        return this.sendResponse(res, 400, {
          message: errMessages.invalidRequest,
        });
      }
    });
  }
}
