import { getSelf } from "@/lib/auth-service";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export const isBlockedByUser = async (id: string) => {
  try {
    const self = await getSelf();

    if (id === self.id) return false;

    const res = await fetch(
      `${BACKEND_URL}/api/blocks/${id}/status?viewerId=${self.id}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) return false;

    return await res.json();
  } catch {
    return false;
  }
};

export const blockUser = async (id: string) => {
  const self = await getSelf();

  if (id === self.id) {
    throw new Error("Cannot block yourself");
  }

  const res = await fetch(
    `${BACKEND_URL}/api/blocks/${id}?viewerId=${self.id}`,
    {
      method: "POST",
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to block user");
  }

  return { success: true };
};

export const unblockUser = async (id: string) => {
  const self = await getSelf();

  if (id === self.id) {
    throw new Error("Cannot unblock yourself");
  }

  const res = await fetch(
    `${BACKEND_URL}/api/blocks/${id}?viewerId=${self.id}`,
    {
      method: "DELETE",
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to unblock user");
  }

  return { success: true };
};

export const getBlockedUsers = async () => {
  try {
    const self = await getSelf();

    const res = await fetch(`${BACKEND_URL}/api/blocks?viewerId=${self.id}`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return [];
    }

    return await res.json();
  } catch {
    return [];
  }
};