import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers } from '@/services/lowdb.service'; 

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

export async function POST(req: NextRequest) {
  const allUsers = getAllUsers();
  const { walletAddress, type } = await req.json();

  let user: User | undefined;
  if (type === 'hospital') {
    user = allUsers.find(
      (u) => u.walletAddress === walletAddress && u.type === 'hospital'
    );
  } else {
    user = allUsers.find(
      (u) => u.walletAddress === walletAddress && u.type === 'patient'
    );
  }

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  return NextResponse.json(user);
}
