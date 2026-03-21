"use server";

import { getUserById } from "@/service/user-service";

export async function getPublicUserProfile(userId: string) {
  try {
    const user = await getUserById(userId);
    if (!user) return null;

    return {
      display_name: user.display_name as string,
      self_intro_markdown: user.self_intro_markdown as string | null,
    };
  } catch (error) {
    console.error("Error fetching public user profile:", error);
    return null;
  }
}
