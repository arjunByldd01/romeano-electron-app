export interface IUser {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface IUserResponse {
  user: IUser;
}
