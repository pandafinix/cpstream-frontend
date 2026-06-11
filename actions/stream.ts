"use server";

import { revalidatePath } from "next/cache";

import { getSelf } from "@/lib/auth-service";
import {
  getStreamByUsername,
  updateStreamById,
  StreamUpdateValues,
} from "@/lib/stream-service";

export const updateStream = async (
  values: StreamUpdateValues
) => {
  try {
    const self = await getSelf();

    const selfStream =
      await getStreamByUsername(self.username);

    if (!selfStream) {
      throw new Error("No stream found");
    }

    const stream = await updateStreamById(
      selfStream.id,
      values
    );

    revalidatePath("/");
    revalidatePath("/search");
    revalidatePath(`/u/${self.username}/keys`);
    revalidatePath(`/u/${self.username}/chat`);
    revalidatePath(`/u/${self.username}`);
    revalidatePath(`/${self.username}`);

    return stream;
  } catch (error) {
    console.error("updateStream", error);
    throw new Error("Internal server error");
  }
};