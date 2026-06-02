import React from "react";

import { getStreams } from "@/lib/feed-service";
import { Skeleton } from "@/components/ui/skeleton";

import { ResultCard, ResultCardSkeleton } from "../result-card";

export async function Results() {
  const data = await getStreams();

  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Live Now</h2>

      {data.length === 0 && (
        <div className="rounded-xl border border-white/10 bg-muted/40 p-8 text-center">
          <p className="text-lg font-semibold">No live streams right now</p>
          <p className="text-sm text-muted-foreground mt-2">
            Check back later or start your own stream from the dashboard.
          </p>
        </div>
      )}

      {data.length > 0 && (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
          {data.map((result: any) => (
            <ResultCard key={result.id} data={result} />
          ))}
        </div>
      )}
    </div>
  );
}

export function ResultsSkeleton() {
  return (
    <div>
      <Skeleton className="h-8 w-[120px] mb-4" />
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
        {[...Array(4)].map((_, i) => (
          <ResultCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}