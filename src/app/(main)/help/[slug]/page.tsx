import fs from "fs";
import path from "path";
import { notFound } from "next/navigation";
import Help from "@/components/pages/help/Help";
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "qps5 - Help",
  };
}

export default async function HelpDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const helpDir = path.join(process.cwd(), "src/contents/help");
  const filePath = path.join(helpDir, `${decodedSlug}.md`);

  if (!fs.existsSync(filePath)) {
    notFound();
  }

  // Get all help files for the quick links
  const files = [
    "00_index",
    "01_quickstart",
    "02_privacy",
    "03_guest_limits",
    "04_security",
    "05_markdown",
  ];

  const fileContent = fs.readFileSync(filePath, "utf8");

  return (
    <Help currentSlug={decodedSlug} files={files} fileContent={fileContent} />
  );
}
