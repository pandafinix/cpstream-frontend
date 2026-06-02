import React from "react";

import { getStreamByUsername } from "@/lib/stream-service";

import { URLCard } from "./_components/url-card";
import { KeyCard } from "./_components/key-card";
import { ConnectModal } from "./_components/connect-modal";
import { StreamInfoForm } from "./_components/stream-info-form";

export default async function KeysPage({
  params,
}: {
  params: { username: string };
}) {
  const stream = await getStreamByUsername(params.username);

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
              {stream.ingressId || "Not created"}
            </p>
          </div>
        </div>

        <URLCard value={stream.serverUrl || ""} />
        <KeyCard value={stream.streamKey || ""} />
      </div>
    </div>
  );
}