"use server";

import { revalidatePath } from "next/cache";

import { blockUser, unblockUser } from "@/lib/block-service";

export const onBlock = async (id: string, username?: string) => {
  try {
    const blockedUser = await blockUser(id);

    revalidatePath("/");
    revalidatePath("/search");

    if (username) {
      revalidatePath(`/${username}`);
    }

    return blockedUser;
  } catch {
    throw new Error("Internal server error");
  }
};

export const onUnblock = async (id: string, username?: string) => {
  try {
    const unblockedUser = await unblockUser(id);

    revalidatePath("/");
    revalidatePath("/search");

    if (username) {
      revalidatePath(`/${username}`);
    }

    return unblockedUser;
  } catch {
    throw new Error("Internal server error");
  }
};