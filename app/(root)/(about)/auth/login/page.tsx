import SignInForm from '@/components/auth/SignInForm';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Login',
};

export default function LoginPage() {
  return (
    <div className='container h-[700px] lg:max-w-none lg:px-0 mx-auto flex w-full flex-col space-y-6 sm:w-[350px] lg:p-8'>
      <div className='flex flex-col space-y-2 text-center'>
        <h1 className='text-2xl font-semibold tracking-tight'>
          Create an account
        </h1>
        <p className='text-sm text-muted-foreground'>
          Enter your email below to create your account
        </p>
      </div>
      <SignInForm />
      <p className='px-8 text-center text-sm text-muted-foreground'>
        By clicking continue, you agree to our{' '}
        {/*//! <Link
          href='/terms'
          className='underline underline-offset-4 hover:text-primary'
        >
          Terms of Service
        </Link>{' '}
        and{' '} */}
        <Link
          href='/privacy'
          className='underline underline-offset-4 hover:text-primary'
        >
          Privacy Policy
        </Link>
        .
      </p>
    </div>
  );
}
