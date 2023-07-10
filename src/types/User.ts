export enum Role {
  User = 1,
  Admin = 2,
}

export type User = {
  id: number;
  name: string;
  email: string;
  role: Role;
  createdAt: string;
  updatedAt: string;
};
