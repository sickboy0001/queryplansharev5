import Header from "@/components/layout/Header";
import Sidebar from "@/components/layout/Sidebar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <div className="flex relative min-h-[calc(100vh-64px)]">
        <Sidebar />
        <main className="flex-1 min-w-0 relative">{children}</main>
      </div>
    </>
  );
}
