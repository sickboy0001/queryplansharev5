"use client";

export default function AdminiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 min-w-0 relative">
      <style jsx global>{`
        /* サイドバーを非表示にするための暫定的対応 */
        aside {
          display: none !important;
        }
      `}</style>
      {children}
    </div>
  );
}
