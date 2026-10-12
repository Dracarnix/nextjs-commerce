export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Middleware handles authentication checks
  // This layout just renders the children
  return <>{children}</>;
}
