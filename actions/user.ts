"use server";

import { revalidatePath } from "next/cache";

import { getSelf } from "@/lib/auth-service";
import { updateUsername } from "@/lib/user-service";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

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

export const updateUser = async ({ bio }: { bio: string }) => {
  const self = await getSelf();

  const res = await fetch(`${BACKEND_URL}/api/users/${self.id}/bio`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      bio,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to update user");
  }

  const user = await res.json();

  revalidatePath("/");
  revalidatePath("/search");
  revalidatePath(`/${user.username}`);

  return user;
};