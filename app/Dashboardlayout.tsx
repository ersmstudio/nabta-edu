export default function DashboardLayout(
  { children }: Readonly<{ children: React.ReactNode }>,
) {
  return (
    <div className="flex min-h-screen">
      <aside aria-label="Dashboard sidebar" className="w-[14%] bg-red-500 md:w-[8%]" />
      <main className="w-[86%] bg-blue-500 md:w-[92%]">{children}</main>
    </div>
  );
}
