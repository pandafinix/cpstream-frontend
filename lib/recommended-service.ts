import { getSelf } from "@/lib/auth-service";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export const getRecommended = async () => {
  let viewerId = "";

  try {
    const self = await getSelf();
    viewerId = self.id;
  } catch {
    viewerId = "";
  }

  const usersUrl = viewerId
    ? `${BACKEND_URL}/api/users/recommended?viewerId=${viewerId}`
    : `${BACKEND_URL}/api/users/recommended`;

  const [usersRes, streamsRes] = await Promise.all([
    fetch(usersUrl, { cache: "no-store" }),
    fetch(`${BACKEND_URL}/api/streams`, { cache: "no-store" }),
  ]);

  if (!usersRes.ok) {
    return [];
  }

  const users = await usersRes.json();

  let streams: any[] = [];

  if (streamsRes.ok) {
    streams = await streamsRes.json();
  }

  const streamByUsername = new Map(
    streams.map((stream: any) => [stream.username, stream])
  );

  return users.map((user: any) => {
    const stream = streamByUsername.get(user.username);

    return {
      id: user.id,
      username: user.username,
      imageUrl: user.imageUrl || "",
      stream: {
        isLive: stream?.live || false,
      },
    };
  });
};