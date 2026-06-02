import { getSelf } from "@/lib/auth-service";

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

export type CpstreamUser = {
  id: string;
  externalUserId: string;
  username: string;
 imageUrl: string;
  bio: string | null;
  stream: CpstreamStream | null;
  _count: {
    followedBy: number;
  };
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

export const getUserByUsername = async (
  username: string
): Promise<CpstreamUser | null> => {
  try {
    const userRes = await fetch(`${BACKEND_URL}/api/users/${username}`, {
      cache: "no-store",
    });

    if (!userRes.ok) {
      return null;
    }

    const user = await userRes.json();

    const [streamRes, followerCountRes] = await Promise.all([
      fetch(`${BACKEND_URL}/api/streams/user/${username}`, {
        cache: "no-store",
      }),
      fetch(`${BACKEND_URL}/api/follows/${user.id}/count`, {
        cache: "no-store",
      }),
    ]);

    let stream = null;
    let followerCount = 0;

    if (streamRes.ok) {
      stream = await streamRes.json();
    }

    if (followerCountRes.ok) {
      followerCount = await followerCountRes.json();
    }

    return {
      id: user.id,
      externalUserId: user.externalUserId,
      username: user.username,
     imageUrl: user.imageUrl || "",
      bio: user.bio,
      stream: mapStream(stream),
      _count: {
        followedBy: followerCount,
      },
    };
  } catch {
    return null;
  }
};

export const updateUsername = async (
  username: string
): Promise<CpstreamUser> => {
  const self = await getSelf();

  const res = await fetch(`${BACKEND_URL}/api/users/${self.id}/username`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    cache: "no-store",
    body: JSON.stringify({
      username,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to update username");
  }

  const updatedUser = await res.json();

  return {
    id: updatedUser.id,
    externalUserId: updatedUser.externalUserId,
    username: updatedUser.username,
   imageUrl: updatedUser.imageUrl || "",
    bio: updatedUser.bio,
    stream: null,
    _count: {
      followedBy: 0,
    },
  };
};