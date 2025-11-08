export const headers = { "Content-Type": "application/json" };
export const endpoint = "/api/users";
export const errMessages = {
  nonEndpoint: `Non-endpoint, check the URL ${endpoint}/...`,
  invalidEndpoint: "Invalid endpoint",
  invalidUuid: "Invalid uuid",
  userNotFound: "User is not found",
  invalidRequest:
    "Invalid request. Request Body should consist of: {username:string, age:number, hobbies: string array}",
};

export interface reqUser {
  username: string;
  age: number;
  hobbies: string[];
}

export interface DbUser extends reqUser {
  id: string;
}
