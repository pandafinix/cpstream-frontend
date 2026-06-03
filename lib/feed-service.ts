import { getSelf } from "@/lib/auth-service";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

const mapStream = (stream: any) => {
  return {
    id: stream.id,
    name: stream.name,
    thumbnailUrl: stream.thumbnailUrl,
    isLive: stream.live,
    platform: stream.platform,
    difficulty: stream.difficulty,
    language: stream.language,
    updatedAt: stream.updatedAt,
    user: {
      username: stream.username,
      imageUrl: stream.userImageUrl,
    },
  };
};

export const getStreams = async () => {
  let viewerId = "";

  try {
    const self = await getSelf();
    viewerId = self.id;
  } catch {
    viewerId = "";
  }

  const url = viewerId
    ? `${BACKEND_URL}/api/streams/live?viewerId=${viewerId}`
    : `${BACKEND_URL}/api/streams/live`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  const data = await res.json();

  return data.map(mapStream);
};