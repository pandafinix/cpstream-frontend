"use server";

import { revalidatePath } from "next/cache";

import { updateUsername } from "@/lib/user-service";

export const onUpdateUsername = async (username: string) => {
  try {
    const user = await updateUsername(username);

    revalidatePath("/");
    revalidatePath("/search");
    revalidatePath(`/${user.username}`);
    revalidatePath(`/u/${user.username}/keys`);
    revalidatePath(`/u/${user.username}/community`);
    revalidatePath(`/u/${user.username}/settings`);

    return user;
  } catch {
    throw new Error("Failed to update username");
  }
};