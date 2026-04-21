import SaaSLayout from '@/components/SaaSLayout';

export default function BillingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SaaSLayout>{children}</SaaSLayout>;
}
