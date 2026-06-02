"use client";

import React, { useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { createIngress } from "@/actions/ingress";

export function ConnectModal({ username }: { username: string }) {
  const [isPending, startTransition] = useTransition();

  const handleGenerate = () => {
    startTransition(() => {
      createIngress(username)
        .then(() => {
          toast.success("Connection generated successfully");
          window.location.reload();
        })
        .catch(() => {
          toast.error("Failed to generate connection");
        });
    });
  };

  return (
    <Button variant="primary" disabled={isPending} onClick={handleGenerate}>
      {isPending ? "Generating..." : "Generate connection"}
    </Button>
  );
}