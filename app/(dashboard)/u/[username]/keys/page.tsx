import React from "react";

import { getStreamByUsername } from "@/lib/stream-service";

import { URLCard } from "./_components/url-card";
import { KeyCard } from "./_components/key-card";
import { ConnectModal } from "./_components/connect-modal";
import { StreamInfoForm } from "./_components/stream-info-form";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8080";

type StreamKeys = {
  id: string;
  ingressId: string | null;
  serverUrl: string | null;
  streamKey: string | null;
  username: string;
};

const getStreamKeysByUsername = async (
  username: string
): Promise<StreamKeys | null> => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/streams/user/${username}/keys`, {
      cache: "no-store",
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch {
    return null;
  }
};

export default async function KeysPage({
  params,
}: {
  params: { username: string };
}) {
  const stream = await getStreamByUsername(params.username);
  const streamKeys = await getStreamKeysByUsername(params.username);

  if (!stream) {
    throw new Error("No stream found");
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Keys & URLs</h1>
          <p className="text-sm text-muted-foreground">
            Use these values in OBS Studio.
          </p>
        </div>

        <ConnectModal username={params.username} />
      </div>

      <div className="space-y-4">
        <StreamInfoForm stream={stream} />

        <div className="rounded-xl bg-muted p-6">
          <div className="flex items-center gap-x-10">
            <p className="font-semibold shrink-0">Live Status</p>
            <p className="font-medium">
              {stream.isLive ? "Live" : "Offline"}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-muted p-6">
          <div className="flex items-center gap-x-10">
            <p className="font-semibold shrink-0">Ingress ID</p>
            <p className="font-mono text-sm break-all">
              {streamKeys?.ingressId || "Not created"}
            </p>
          </div>
        </div>

        <URLCard value={streamKeys?.serverUrl || ""} />
        <KeyCard value={streamKeys?.streamKey || ""} />
      </div>
    </div>
  );
}