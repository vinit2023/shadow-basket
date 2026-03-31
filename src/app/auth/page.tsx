"use client";

import { Suspense } from "react";
import { AuthPage } from "@/components/auth/auth-page";

export default function Auth() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <AuthPage />
    </Suspense>
  );
}
