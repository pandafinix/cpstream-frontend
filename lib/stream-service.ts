const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export type CpstreamStream = {
  id: string;
  name: string;
  thumbnailUrl: string | null;
  ingressId: string | null;
  serverUrl: string | null;
  streamKey: string | null;
  isLive: boolean;
  isChatEnabled: boolean;
  isChatDelayed: boolean;
  isChatFollowersOnly: boolean;
  platform: string | null;
  difficulty: string | null;
  language: string | null;
  updatedAt: string | null;
};

export type StreamUpdateValues = {
  name?: string;
  thumbnailUrl?: string;
  isLive?: boolean;
  isChatEnabled?: boolean;
  isChatDelayed?: boolean;
  isChatFollowersOnly?: boolean;
  platform?: string;
  difficulty?: string;
  language?: string;
};

const mapStream = (stream: any): CpstreamStream | null => {
  if (!stream) return null;

  return {
    id: stream.id,
    name: stream.name,
    thumbnailUrl: stream.thumbnailUrl,
    ingressId: stream.ingressId,
    serverUrl: stream.serverUrl,
    streamKey: stream.streamKey,
    isLive: stream.live,
    isChatEnabled: stream.chatEnabled,
    isChatDelayed: stream.chatDelayed,
    isChatFollowersOnly: stream.chatFollowersOnly,
    platform: stream.platform,
    difficulty: stream.difficulty,
    language: stream.language,
    updatedAt: stream.updatedAt,
  };
};

export const getStreamByUsername = async (username: string) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/streams/user/${username}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const stream = await res.json();
    return mapStream(stream);
  } catch {
    return null;
  }
};

export const getStreamByUserId = async (userId: string) => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/streams/user/${userId}`, {
      cache: "no-store",
    });

    if (!res.ok) return null;

    const stream = await res.json();
    return mapStream(stream);
  } catch {
    return null;
  }
};

export const updateStreamById = async (
  streamId: string,
  values: StreamUpdateValues
) => {
  const res = await fetch(`${BACKEND_URL}/api/streams/${streamId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify(values),
  });

  if (!res.ok) {
    throw new Error("Failed to update stream");
  }

  const stream = await res.json();
  return mapStream(stream);
};