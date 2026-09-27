import type { Metadata } from "next";
import AccountPageClient from "./page-client";

export const metadata: Metadata = {
  title: "계정 관리 | Free Traveler",
  description:
    "계정 정보, 내 활동, 관리 기능을 한 곳에서 관리하세요. Free Traveler의 계정 페이지.",
  openGraph: {
    title: "계정 관리",
    description:
      "계정 정보, 내 활동, 관리 기능을 한 곳에서 관리하세요.",
  },
};

export default function AccountPage() {
  return <AccountPageClient />;
}
