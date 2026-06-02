"use client";

import React, { useState } from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { CopyButton } from "./copy-button";

export function KeyCard({ value }: { value: string | null }) {
  const [show, setShow] = useState(false);

  const displayValue = show ? value || "" : value ? "••••••••••••••••" : "";

  return (
    <div className="rounded-xl bg-muted p-6">
      <div className="flex items-start gap-x-10">
        <p className="font-semibold shrink-0">Stream Key</p>

        <div className="space-y-2 w-full">
          <div className="w-full flex items-center gap-x-2">
            <Input
              value={displayValue}
              readOnly
              autoComplete="off"
              name="cpstream-stream-key"
              placeholder="Stream Key"
              type="text"
            />

            <CopyButton value={value || ""} />
          </div>

          <Button size="sm" variant="link" onClick={() => setShow(!show)}>
            {show ? "Hide" : "Show"}
          </Button>
        </div>
      </div>
    </div>
  );
}