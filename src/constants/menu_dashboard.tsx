import {
  LucideIcon,
  LayoutGrid,
  PlusCircle,
  HelpCircle,
  Settings,
} from "lucide-react";

export type DashboardMenuItem = {
  title: string;
  description: string;
  href?: string;
  iconName: string; // We'll map this to actual icons in the component
  color: string;
  isModal?: boolean;
};

export const DASHBOARD_MENU_ITEMS: DashboardMenuItem[] = [
  {
    title: "プランギャラリー",
    description: "公開されている実行プランを閲覧・検索します。",
    href: "/qpposts",
    iconName: "LayoutGrid",
    color: "bg-blue-500",
  },
  {
    title: "新規プラン投稿",
    description: "SQL Serverの実行プラン(XML)をアップロードします。",
    href: "/qpposts/new",
    iconName: "PlusCircle",
    color: "bg-green-500",
  },
  {
    title: "ヘルプセンター",
    description: "使いかたやMarkdownの書き方などを確認します。",
    iconName: "HelpCircle",
    color: "bg-purple-500",
    isModal: true,
  },
  {
    title: "アカウント設定",
    description: "プロフィールの編集やアカウントの設定を行います。",
    href: "/setting",
    iconName: "Settings",
    color: "bg-slate-500",
  },
];
