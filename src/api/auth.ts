import axios from 'axios';
import type { AuthUser } from '../types';

const BASE_URL = 'https://dummyjson.com';

export const loginRequest = async (
  username: string,
  password: string
): Promise<AuthUser> => {
  const { data } = await axios.post<AuthUser>(`${BASE_URL}/auth/login`, {
    username,
    password,
    expiresInMins: 60,
  });
  return data;
};