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

  const text = await res.text();

  if (!res.ok) {
    throw new Error(text || "Failed to create ingress");
  }

  const data = text ? JSON.parse(text) : null;

  revalidatePath(`/u/${username}/keys`);

  return data;
};