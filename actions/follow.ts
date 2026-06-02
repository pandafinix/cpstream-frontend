"use server";

import { revalidatePath } from "next/cache";

import { followUser, unfollowUser } from "@/lib/follow-service";

export const onFollow = async (id: string, username?: string) => {
  try {
    const followedUser = await followUser(id);

    revalidatePath("/");
    revalidatePath("/search");

    if (username) {
      revalidatePath(`/${username}`);
    }

    return followedUser;
  } catch {
    throw new Error("Internal server error");
  }
};

export const onUnfollow = async (id: string, username?: string) => {
  try {
    const unfollowedUser = await unfollowUser(id);

    revalidatePath("/");
    revalidatePath("/search");

    if (username) {
      revalidatePath(`/${username}`);
    }

    return unfollowedUser;
  } catch {
    throw new Error("Internal server error");
  }
};