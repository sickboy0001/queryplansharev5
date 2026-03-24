import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider } from "@/components/layout/SidebarProvider";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { GoogleAnalytics } from "@next/third-parties/google";
import { HelpModal } from "@/components/organisms/HelpModal";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "qps5 - Query Plan Share",
  description: "Share and visualize SQL Server Query Plans",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col bg-slate-50 text-slate-800`}
      >
        <AuthProvider>
          <SidebarProvider>
            <div className="flex-1 flex flex-col">
              {children}
              <Toaster position="top-center" richColors />
              <footer className="border-t-4 border-[#333399] bg-white py-8 text-center relative z-10">
                <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-center gap-x-4 gap-y-2">
                  <p className="text-[#333399] font-black tracking-widest uppercase text-sm">
                    &copy; {new Date().getFullYear()} qps5 - SQL Server Query
                    Plan Share
                  </p>
                  <div className="flex items-center">
                    <HelpModal />
                  </div>
                </div>
              </footer>
            </div>
          </SidebarProvider>
        </AuthProvider>
        <GoogleAnalytics gaId="G-FSDX2ZWLER" />
      </body>
    </html>
  );
}
