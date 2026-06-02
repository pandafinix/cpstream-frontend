import React from "react";
import Link from "next/link";

import { getSearch, ChannelResult } from "@/lib/search-service";
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "@/components/user-avatar";
import { VerifiedMark } from "@/components/verified-mark";

import { ResultCard, ResultCardSkeleton } from "./result-card";

function ChannelCard({ data }: { data: ChannelResult }) {
  return (
    <Link href={`/${data.username}`}>
      <div className="flex items-center gap-x-4 rounded-lg p-3 hover:bg-muted">
        <UserAvatar
          username={data.username}
          imageUrl={data.imageUrl || ""}
          size="lg"
        />

        <div className="space-y-1">
          <div className="flex items-center gap-x-2">
            <p className="font-bold text-lg hover:text-blue-500">
              {data.username}
            </p>
            <VerifiedMark />
          </div>

          <p className="text-sm text-muted-foreground">
            {data.bio || "CPStream channel"}
          </p>
        </div>
      </div>
    </Link>
  );
}

function ChannelCardSkeleton() {
  return (
    <div className="flex items-center gap-x-4 rounded-lg p-3">
      <Skeleton className="h-14 w-14 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-3 w-48" />
      </div>
    </div>
  );
}

export async function Results({ term }: { term?: string }) {
  const data = await getSearch(term);

  const hasChannels = data.channels.length > 0;
  const hasStreams = data.streams.length > 0;
  const hasNoResults = !hasChannels && !hasStreams;

  return (
    <div className="space-y-8">
      <h2 className="text-lg font-semibold">
        Results for term &quot;{term}&quot;
      </h2>

      {hasNoResults && (
        <p className="text-muted-foreground text-sm">
          No results found. Try searching for something else.
        </p>
      )}

      {hasChannels && (
        <div>
          <h3 className="text-base font-semibold mb-3">Channels</h3>
          <div className="flex flex-col gap-y-2">
            {data.channels.map((channel) => (
              <ChannelCard key={channel.id} data={channel} />
            ))}
          </div>
        </div>
      )}

      {hasStreams && (
        <div>
          <h3 className="text-base font-semibold mb-3">Streams</h3>
          <div className="flex flex-col gap-y-4">
            {data.streams.map((stream) => (
              <ResultCard key={stream.id} data={stream} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function ResultsSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-8 w-[290px]" />

      <div>
        <Skeleton className="h-5 w-24 mb-3" />
        <div className="flex flex-col gap-y-2">
          {[...Array(2)].map((_, i) => (
            <ChannelCardSkeleton key={i} />
          ))}
        </div>
      </div>

      <div>
        <Skeleton className="h-5 w-24 mb-3" />
        <div className="flex flex-col gap-y-4">
          {[...Array(3)].map((_, i) => (
            <ResultCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}