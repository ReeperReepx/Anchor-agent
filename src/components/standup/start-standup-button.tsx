"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function StartStandupButton() {
  const router = useRouter();

  return (
    <Button size="lg" onClick={() => router.push("/standup")}>
      Start Standup
    </Button>
  );
}
