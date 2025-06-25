
import type { User } from '@/lib/db-types';

const users_mock_data: User[] = [
  {
    id: '1',
    email: 'admin@company.com',
    name: 'Admin User',
    role: 'admin',
    orgId: 'org-1',
    createdAt: new Date(),
    password: 'admin123'
  },
  {
    id: '2',
    email: 'editor@company.com',
    name: 'Editor User',
    role: 'creator', // Fixed: role must be admin, buyer, or creator
    orgId: 'org-1',
    createdAt: new Date(),
    password: 'editor123'
  }
];

export async function getUserByEmail(email: string): Promise<User | null> {
  console.warn("getUserByEmail is using mock data and should be updated to use Supabase profiles.");
  return users_mock_data.find(u => u.email === email) || null;
}

export async function createUser(userData: Omit<User, 'id' | 'createdAt' | 'password'> & { passwordInput: string }): Promise<User> {
  console.warn("createUser is using mock data and should be replaced by Supabase auth signup.");
  const existingUser = users_mock_data.find(u => u.email === userData.email);
  if (existingUser) {
    throw new Error("User already exists");
  }
  const user: User = {
    ...userData,
    id: Date.now().toString(),
    createdAt: new Date(),
    password: userData.passwordInput
  };
  users_mock_data.push(user);
  console.log('Mock Users in DB after creation:', users_mock_data);
  return user;
}

export async function setUserPassword(email: string, password: string):Promise<void> {
    console.warn("setUserPassword is using mock data.");
    const userIndex = users_mock_data.findIndex(u => u.email === email);
    if (userIndex > -1) {
        users_mock_data[userIndex].password = password;
    }
}

export async function verifyPassword(email: string, passwordAttempt: string): Promise<boolean> {
    console.warn("verifyPassword is using mock data.");
    const user = users_mock_data.find(u => u.email === email);
    return !!user && user.password === passwordAttempt;
}
