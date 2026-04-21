import SaaSLayout from '@/components/SaaSLayout';

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SaaSLayout>{children}</SaaSLayout>;
}
