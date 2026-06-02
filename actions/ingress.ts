"use server";

import { revalidatePath } from "next/cache";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export const createIngress = async (username: string) => {
  const res = await fetch(`${BACKEND_URL}/api/livekit/ingress`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
    }),
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to create ingress");
  }

  const data = await res.json();

  revalidatePath(`/u/${username}/keys`);

  return data;
};