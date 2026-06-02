"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { updateStream } from "@/actions/stream";
import { CpstreamStream } from "@/lib/stream-service";

export function StreamInfoForm({ stream }: { stream: CpstreamStream }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(stream.name || "");
  const [thumbnailUrl, setThumbnailUrl] = useState(stream.thumbnailUrl || "");
  const [platform, setPlatform] = useState(stream.platform || "");
  const [difficulty, setDifficulty] = useState(stream.difficulty || "");
  const [language, setLanguage] = useState(stream.language || "");

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    startTransition(() => {
      updateStream({
        name,
        thumbnailUrl,
        platform,
        difficulty,
        language,
      })
        .then(() => {
          toast.success("Stream info updated");
          router.refresh();
        })
        .catch(() => {
          toast.error("Failed to update stream info");
        });
    });
  };

  return (
    <form onSubmit={onSubmit} className="rounded-xl bg-muted p-6 space-y-5">
      <div>
        <h2 className="text-lg font-semibold">Stream Info</h2>
        <p className="text-sm text-muted-foreground">
          Update your stream title, thumbnail, and metadata before going live.
        </p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Stream Title</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isPending}
          className="w-full rounded-md border border-white/10 bg-background px-3 py-2 text-sm outline-none"
          placeholder="Codeforces Div2 Upsolving"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Thumbnail URL</label>
        <input
          value={thumbnailUrl}
          onChange={(e) => setThumbnailUrl(e.target.value)}
          disabled={isPending}
          className="w-full rounded-md border border-white/10 bg-background px-3 py-2 text-sm outline-none"
          placeholder="/x.png"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Platform</label>
          <input
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            disabled={isPending}
            className="w-full rounded-md border border-white/10 bg-background px-3 py-2 text-sm outline-none"
            placeholder="Codeforces"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Difficulty</label>
          <input
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            disabled={isPending}
            className="w-full rounded-md border border-white/10 bg-background px-3 py-2 text-sm outline-none"
            placeholder="1200-1600"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Language</label>
          <input
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            disabled={isPending}
            className="w-full rounded-md border border-white/10 bg-background px-3 py-2 text-sm outline-none"
            placeholder="C++"
          />
        </div>
      </div>

      <Button disabled={isPending} type="submit" variant="primary">
        Save stream info
      </Button>
    </form>
  );
}