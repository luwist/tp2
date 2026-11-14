export interface RegisterRequestDTO {
  avatar: File;
  firstName: string;
  lastName: string;
  username: string;
  bio: string;
  birthDate: string;
  email: string;
  password: string;
  confirmPassword: string;
}
