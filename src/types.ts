export const headers = { 'Content-Type': 'application/json' };
export const endpoint = '/api/users';
export const errMessages = {
  invalidEndpoint: 'Invalid endpoint',
  invalidUuid: 'Invalid uuid',
  userNotFound: 'User is not found',
  invalidRequest: 'Invalid request. Request Body should be consist of: {username:string, age:number, hobbies: string array}',
}
export interface DbUser {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export interface reqUser {
  username: string;
  age: number;
  hobbies: string[];
}