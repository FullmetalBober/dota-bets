import { auth } from '@/lib/auth/utils';
import prisma from '@/lib/db';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Generated by create next app',
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { workspaceId: string };
}>) {
  let isUserMember = false;
  const session = await auth();
  const userId = session?.user?.id;

  if (userId) {
    const workspaceUsers = await prisma.workspaceMembers.findFirst({
      where: {
        workspaceId: params.workspaceId,
        userId: userId,
      },
      select: {
        id: true,
      },
    });

    if (workspaceUsers) isUserMember = true;
  }

  //TODO: Add a better UI for this
  if (!isUserMember) return;
  <main>You are not a member of this workspace</main>;

  return children;
}
