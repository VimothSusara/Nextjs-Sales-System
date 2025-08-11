"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { ReactNode, useEffect } from "react";

export default function Protected({
  children,
  requiredRole,
}: {
  children: ReactNode;
  requiredRole?: string;
}) {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/login");
    }

    if (
      status === "authenticated" &&
      requiredRole &&
      session?.user?.role !== requiredRole
    ) {
      redirect("/dashboard/unauthorized");
    }
  }, [status, session, requiredRole]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  return <>{children}</>;
}
