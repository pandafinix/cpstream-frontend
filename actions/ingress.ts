"use server";

import { revalidatePath } from "next/cache";

import { getBackendAuthHeaders } from "@/lib/backend-auth";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export const createIngress = async (username: string) => {
  const authHeaders = await getBackendAuthHeaders();

  const res = await fetch(`${BACKEND_URL}/api/livekit/ingress`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
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