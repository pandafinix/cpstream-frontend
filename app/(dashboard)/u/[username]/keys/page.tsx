import React from "react";

import { getSelf } from "@/lib/auth-service";
import { getBackendAuthHeaders } from "@/lib/backend-auth";
import {
  getStreamByUsername,
  getStreamKeysByUsername,
} from "@/lib/stream-service";

import { URLCard } from "./_components/url-card";
import { KeyCard } from "./_components/key-card";
import { ConnectModal } from "./_components/connect-modal";
import { StreamInfoForm } from "./_components/stream-info-form";

export const dynamic = "force-dynamic";

export default async function KeysPage({
  params,
}: {
  params: {
    username: string;
  };
}) {
  const self = await getSelf();

  if (self.username !== params.username) {
    throw new Error("Unauthorized");
  }

  const authHeaders =
    await getBackendAuthHeaders();

  const [stream, keys] = await Promise.all([
    getStreamByUsername(params.username),
    getStreamKeysByUsername(
      params.username,
      authHeaders
    ),
  ]);

  if (!stream) {
    throw new Error("No stream found");
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">
            Keys & URLs
          </h1>

          <p className="text-sm text-muted-foreground">
            Use these values in OBS Studio.
          </p>
        </div>

        <ConnectModal
          username={params.username}
        />
      </div>

      <div className="space-y-4">
        <StreamInfoForm stream={stream} />

        <div className="rounded-xl bg-muted p-6">
          <div className="flex items-center gap-x-10">
            <p className="font-semibold shrink-0">
              Live Status
            </p>

            <p className="font-medium">
              {stream.isLive
                ? "Live"
                : "Offline"}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-muted p-6">
          <div className="flex items-center gap-x-10">
            <p className="font-semibold shrink-0">
              Ingress ID
            </p>

            <p className="font-mono text-sm break-all">
              {keys.ingressId ||
                "Not created"}
            </p>
          </div>
        </div>

        <URLCard
          value={keys.serverUrl || ""}
        />

        <KeyCard
          value={keys.streamKey || ""}
        />
      </div>
    </div>
  );
}