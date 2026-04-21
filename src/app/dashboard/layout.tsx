import SaaSLayout from '@/components/SaaSLayout';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SaaSLayout>{children}</SaaSLayout>;
}
