import { Low } from 'lowdb'
import { JSONFile } from 'lowdb/node'
import { v4 as uuid } from 'uuid'

type User = {
  id: string;
  institutionId?: string;
  institutionName?: string;
  patientName?: string;
  walletAddress: string;
  type: 'hospital' | 'patient';
  did: string;
  createdAt: string;
  salt: Buffer;
};

type Data = {
  users: User[]
}

const adapter = new JSONFile<Data>('users.json')
const db = new Low<Data>(adapter, { users: [] })

await db.read()
db.data ||= { users: [] }

const save = async () => await db.write()

export const getAllUsers = (): User[] => db.data!.users

export const getUserByWalletAddress = (walletAddress: string): User | undefined =>
  db.data!.users.find(u => u.walletAddress === walletAddress)

export const getUserById = (id: string): User | undefined =>
  db.data!.users.find(u => u.id === id)

export const addUser = async (user: {
  institutionId?: string;
  institutionName?: string;
  patientName?: string;
  walletAddress: string;
  type: 'hospital' | 'patient';
  did: string;
  createdAt: string;
}): Promise<User> => {
  const newUser: User = { id: uuid(), ...user };
  db.data!.users.push(newUser);
  await save();
  return newUser;
};

export const deleteUser = async (id: string): Promise<User | null> => {
  const index = db.data!.users.findIndex(u => u.id === id)
  if (index !== -1) {
    const [deletedUser] = db.data!.users.splice(index, 1)
    await save()
    return deletedUser
  }
  return null
}
