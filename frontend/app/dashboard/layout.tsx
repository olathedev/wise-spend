import Sidebar from "@/components/layout/Sidebar";
import FloatingActionButton from "@/components/layout/FloatingActionButton";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden bg-background-light dark:bg-background-dark p-4 md:p-8 pb-20">
        {children}
      </main>
      <FloatingActionButton />
    </div>
  );
}
