import { v4 as uuid } from 'uuid';
import { reqUser, DbUser } from '../types';

class UsersDB {
  users: Array<DbUser> = [];

  async getAllUsers() {
    return this.users;
  }

  async addUser(newUser: reqUser) {
    const id = uuid();
    const user = { id, ...newUser };
    this.users.push(user);
  }

  async getUserById(id: string) {
    const foundUser = this.users.find((item) => item.id === id);
    return foundUser || undefined;
  }

  async updateUser(user: DbUser) {
    if (user.id) {
      const index = this.users.findIndex((item) => item.id === user.id);
      this.users[index] = user;
      return user;
    } else {
      return null;
    }
  }

  async deleteUser(id: string) {
    const index = this.users.findIndex((user) => user.id === id);
    if (index === -1) {
      return (404);
    } else {
      this.users = [...this.users.slice(0, index), ...this.users.slice(index + 1)];
      return (204);
    }
  }
}


export const usersDB = new UsersDB();