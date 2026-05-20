import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if user is authenticated
  const session = await getSession();

  // If not authenticated and not on login page, redirect to login
  if (!session) {
    redirect('/admin/login');
  }

  return <>{children}</>;
}
