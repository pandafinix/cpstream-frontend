const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

export type ChannelResult = {
  id: string;
  username: string;
  imageUrl: string;
  bio: string | null;
};

export type SearchResult = {
  id: string;
  name: string;
  thumbnailUrl: string | null;
  isLive: boolean;
  platform: string | null;
  difficulty: string | null;
  language: string | null;
  updatedAt: string | null;
  user: {
    username: string;
    imageUrl: string;
  };
};

export type SearchData = {
  channels: ChannelResult[];
  streams: SearchResult[];
};

const mapChannel = (user: any): ChannelResult => {
  return {
    id: user.id,
    username: user.username,
    imageUrl: user.imageUrl || "",
    bio: user.bio,
  };
};

const mapStream = (stream: any): SearchResult => {
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
      imageUrl: stream.userImageUrl || "",
    },
  };
};

const isDefaultEmptyStream = (stream: SearchResult) => {
  return (
    stream.name === `${stream.user.username}'s stream` &&
    !stream.platform &&
    !stream.difficulty &&
    !stream.language &&
    !stream.thumbnailUrl &&
    !stream.isLive
  );
};

export const getSearch = async (term?: string): Promise<SearchData> => {
  const query = term ? encodeURIComponent(term) : "";

  const [channelsRes, streamsRes] = await Promise.all([
    fetch(`${BACKEND_URL}/api/users/search?term=${query}`, {
      cache: "no-store",
    }),
    fetch(`${BACKEND_URL}/api/streams/search?term=${query}`, {
      cache: "no-store",
    }),
  ]);

  let channels: ChannelResult[] = [];
  let streams: SearchResult[] = [];

  if (channelsRes.ok) {
    const data = await channelsRes.json();
    channels = data.map(mapChannel);
  }

  if (streamsRes.ok) {
    const data = await streamsRes.json();
    streams = data.map(mapStream).filter((stream: SearchResult) => {
      return !isDefaultEmptyStream(stream);
    });
  }

  return {
    channels,
    streams,
  };
};