import { promises as fs } from "fs";
import { resolve } from "path";
import { v4 as uuid } from "uuid";
import { reqUser, DbUser } from "../types.js";

const DB_FILE_PATH = resolve(process.cwd(), "users.json");
const LOCK_FILE_PATH = resolve(process.cwd(), "users.json.lock");

class SharedUsersDB {
  private async readDB(): Promise<DbUser[]> {
    try {
      const data = await fs.readFile(DB_FILE_PATH, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") {
        return [];
      }
      console.error("Error reading database:", error);
      return [];
    }
  }

  private async writeDB(users: DbUser[]): Promise<void> {
    try {
      const data = JSON.stringify(users, null, 2);
      await fs.writeFile(DB_FILE_PATH, data, "utf-8");
    } catch (error) {
      console.error("Error writing database:", error);
      throw error;
    }
  }

  // Creating file lock
  private async acquireLock(): Promise<() => Promise<void>> {
    const lockId = `${process.pid}-${Date.now()}-${Math.random()}`;
    let attempts = 0;
    const maxAttempts = 100;

    while (attempts < maxAttempts) {
      try {
        // Trying to create lock file exclusively wx
        await fs.writeFile(LOCK_FILE_PATH, lockId, { flag: "wx" });

        // If successful - return function to release lock
        return async () => {
          try {
            const currentLock = await fs.readFile(LOCK_FILE_PATH, "utf-8");
            if (currentLock === lockId) {
              await fs.unlink(LOCK_FILE_PATH);
            }
          } catch {
            // Ignore errors when releasing lock
          }
        };
      } catch {
        // File already exists, wait and try again
        attempts++;
        await new Promise((resolve) =>
          setTimeout(resolve, 10 + Math.random() * 20)
        );
      }
    }

    throw new Error("Could not acquire file lock after maximum attempts");
  }

  // Method for performing file locked operations
  private async withFileLock<T>(operation: () => Promise<T>): Promise<T> {
    const releaseLock = await this.acquireLock();
    try {
      return await operation();
    } finally {
      await releaseLock();
    }
  }

  async getAllUsers(): Promise<DbUser[]> {
    return await this.readDB();
  }

  async addUser(newUser: reqUser): Promise<DbUser> {
    return this.withFileLock(async () => {
      const users = await this.readDB();
      const id = uuid();
      const user = { id, ...newUser };
      users.push(user);
      await this.writeDB(users);
      return user;
    });
  }

  async getUserById(id: string): Promise<DbUser | undefined> {
    const users = await this.readDB();
    return users.find((item) => item.id === id) || undefined;
  }

  async updateUser(user: DbUser): Promise<DbUser | null> {
    if (!user.id) {
      return null;
    }

    return this.withFileLock(async () => {
      const users = await this.readDB();
      const index = users.findIndex((item) => item.id === user.id);
      if (index === -1) {
        return null;
      }
      users[index] = user;
      await this.writeDB(users);
      return user;
    });
  }

  async deleteUser(id: string): Promise<404 | 204> {
    return this.withFileLock(async () => {
      const users = await this.readDB();
      const index = users.findIndex((user) => user.id === id);
      if (index === -1) {
        return 404;
      }
      users.splice(index, 1);
      await this.writeDB(users);
      return 204;
    });
  }
}

export const sharedUsersDB = new SharedUsersDB();
