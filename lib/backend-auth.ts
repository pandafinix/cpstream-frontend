import "server-only";

import { auth } from "@clerk/nextjs";

export const getBackendAuthHeaders = async (): Promise<
  Record<string, string>
> => {
  const { userId, getToken } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const token = await getToken();

  if (!token) {
    throw new Error("Unable to get Clerk session token");
  }

  return {
    Authorization: `Bearer ${token}`,
  };
};