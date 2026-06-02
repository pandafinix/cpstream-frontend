import React from "react";
import { notFound } from "next/navigation";

import { getSelfByUsername } from "@/lib/auth-service";

export default async function CreatorLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { username: string };
}) {
  try {
    await getSelfByUsername(params.username);
  } catch {
    notFound();
  }

  return <>{children}</>;
}