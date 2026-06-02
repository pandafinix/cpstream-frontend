import React from "react";
import Link from "next/link";

import { UserAvatar } from "@/components/user-avatar";
import { VerifiedMark } from "@/components/verified-mark";
import { Skeleton } from "@/components/ui/skeleton";

import { ChannelResult } from "@/lib/search-service";

export function ChannelCard({ data }: { data: ChannelResult }) {
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

export function ChannelCardSkeleton() {
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