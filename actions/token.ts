"use server";

import { v4 } from "uuid";

import { getSelf } from "@/lib/auth-service";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export const createViewerToken = async (hostIdentity: string) => {
  let self;

  try {
    self = await getSelf();
  } catch {
    const id = v4();
    const username = `guest#${Math.floor(Math.random() * 1000)}`;

    self = {
      id,
      username,
    };
  }

  const res = await fetch(`${BACKEND_URL}/api/livekit/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      roomName: hostIdentity,
      identity: self.id,
      name: self.username,
      canPublish: false,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to create viewer token");
  }

  const data = await res.json();

  return data.token;
};