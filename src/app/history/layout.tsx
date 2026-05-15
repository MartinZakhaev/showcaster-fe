import SaaSLayout from '@/components/SaaSLayout';
import AuthGuard from '@/components/AuthGuard';

export default function HistoryLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
      <SaaSLayout>{children}</SaaSLayout>
    </AuthGuard>
  );
}
