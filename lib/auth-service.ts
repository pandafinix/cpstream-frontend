import { currentUser } from "@clerk/nextjs";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

const getCpstreamUsername = (user: any) => {
  const email =
    user?.primaryEmailAddress?.emailAddress ||
    user?.emailAddresses?.[0]?.emailAddress;

  if (email) {
    return email.split("@")[0];
  }

  return user?.username || user?.id;
};

export const getSelf = async () => {
  const self = await currentUser();

  if (!self) {
    throw new Error("Unauthorized");
  }

  const username = getCpstreamUsername(self);

  const res = await fetch(`${BACKEND_URL}/api/users/sync`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      externalUserId: self.id,
      username,
      imageUrl: self.imageUrl,
      bio: null,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to sync user");
  }

  return await res.json();
};

export const getSelfByUsername = async (username: string) => {
  const self = await getSelf();

  if (self.username !== username) {
    throw new Error("Unauthorized");
  }

  return self;
};