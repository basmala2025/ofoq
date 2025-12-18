export interface User {
  id?: string;
  fullName:string;
  email: string;
  password: string;
  userType: 'student' | 'professor';
}
