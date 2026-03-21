"use client";

import React from "react";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Info } from "lucide-react";
import { UnlistedGuideContent } from "./UnlistedGuideContent";

export function UnlistedGuideDrawer() {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 border-[#000080]/20 text-[#000080] hover:bg-[#000080]/5"
        >
          <Info size={14} />
          限定公開機能について
        </Button>
      </DrawerTrigger>
      <DrawerContent className="max-h-[90vh]">
        <UnlistedGuideContent />
      </DrawerContent>
    </Drawer>
  );
}
