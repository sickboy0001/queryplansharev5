"use client";

import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useSidebar } from "./SidebarProvider";

export default function MobileMenuButton() {
  const { isOpen, toggle } = useSidebar();
  const pathname = usePathname();

  // トップページ（LP）ではメニューボタンを表示しない
  if (pathname === "/") {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className="lg:hidden text-[#4d4db2] hover:bg-blue-50 mr-2"
      onClick={toggle}
      aria-label="Toggle Menu"
    >
      {isOpen ? <X size={24} /> : <Menu size={24} />}
    </Button>
  );
}
