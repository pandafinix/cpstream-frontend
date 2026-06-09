const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export type CpstreamStream = {
  id: string;
  name: string;
  thumbnailUrl: string | null;
  isLive: boolean;
  isChatEnabled: boolean;
  isChatDelayed: boolean;
  isChatFollowersOnly: boolean;
  platform: string | null;
  difficulty: string | null;
  language: string | null;
  updatedAt: string | null;
};

export type StreamKeys = {
  id: string;
  ingressId: string | null;
  serverUrl: string | null;
  streamKey: string | null;
  username: string;
};

export type StreamUpdateValues = {
  name?: string;
  thumbnailUrl?: string;
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

export const getStreamByUsername = async (
  username: string
): Promise<CpstreamStream | null> => {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/streams/user/${username}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return null;
    }

    const stream = await res.json();

    return mapStream(stream);
  } catch {
    return null;
  }
};

export const getStreamByUserId = async (
  userId: string
): Promise<CpstreamStream | null> => {
  try {
    const res = await fetch(
      `${BACKEND_URL}/api/streams/user/${userId}`,
      {
        cache: "no-store",
      }
    );

    if (!res.ok) {
      return null;
    }

    const stream = await res.json();

    return mapStream(stream);
  } catch {
    return null;
  }
};

export const getStreamKeysByUsername = async (
  username: string,
  authHeaders: Record<string, string>
): Promise<StreamKeys> => {
  const res = await fetch(
    `${BACKEND_URL}/api/streams/user/${username}/keys`,
    {
      headers: {
        ...authHeaders,
      },
      cache: "no-store",
    }
  );

  const text = await res.text();

  if (!res.ok) {
    throw new Error(
      text || "Failed to fetch stream keys"
    );
  }

  return JSON.parse(text);
};

export const updateStreamById = async (
  streamId: string,
  values: StreamUpdateValues,
  authHeaders: Record<string, string>
): Promise<CpstreamStream | null> => {
  const res = await fetch(
    `${BACKEND_URL}/api/streams/${streamId}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...authHeaders,
      },
      cache: "no-store",
      body: JSON.stringify(values),
    }
  );

  const text = await res.text();

  if (!res.ok) {
    throw new Error(
      text || "Failed to update stream"
    );
  }

  const stream = text ? JSON.parse(text) : null;

  return mapStream(stream);
};