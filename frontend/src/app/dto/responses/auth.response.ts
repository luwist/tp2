export interface AuthResponse {
  token: string;
  user: User;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  avatarUrl: string;
  email: string;
  role: string;
  bio: string;
}
