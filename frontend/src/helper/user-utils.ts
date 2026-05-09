import { jwtDecode } from 'jwt-decode';
import { TUser } from '@/types/User';

export function getUserEmail(): string {
  const token = localStorage.getItem('token');
  if (token) {
    try {
      const decoded = jwtDecode<{ user: TUser }>(token);
      return decoded?.user?.email || '';
    } catch (error) {
      return error instanceof Error ? error.message : 'Invalid token';
    }
  }
  return '';
}
