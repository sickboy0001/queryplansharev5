"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LookerDashboard from "./looker_dashboard";
import OgPreview from "./og_preview";

export default function AdminiPageContent() {
  return (
    <Tabs defaultValue="looker" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="looker">Looker Studio</TabsTrigger>
        <TabsTrigger value="og-preview">Vercel OG Preview</TabsTrigger>
      </TabsList>
      <TabsContent value="looker">
        <LookerDashboard />
      </TabsContent>
      <TabsContent value="og-preview">
        <OgPreview />
      </TabsContent>
    </Tabs>
  );
}
