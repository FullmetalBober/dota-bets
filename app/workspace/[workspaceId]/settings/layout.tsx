import SettingSideBar from '@/components/settings/SettingSideBar';
import { Button } from '@/components/ui/button';
import { ArrowLeftIcon } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

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
  return (
    <div>
      <header className='w-full flex py-2 px-8'>
        <Button asChild variant='outline' className='items-start'>
          <Link
            className='flex'
            href={`/workspace/${params.workspaceId}/issues`}
          >
            <ArrowLeftIcon className='h-5 w-5' />
            <span>Settings</span>
          </Link>
        </Button>
      </header>
      <div className='mb-auto p-8 pt-2 grid lg:grid-cols-5'>
        <SettingSideBar workspaceId={params.workspaceId} />
        <main className='lg:col-span-4'>{children}</main>
      </div>
    </div>
  );
}