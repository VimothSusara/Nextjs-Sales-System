import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { MainSidebar } from "@/components/layouts/MainSidebar";
import { MainHeader } from "@/components/layouts/MainHeader";
import React from "react";
import { cookies } from "next/headers";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/auth/auth";

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <div className="flex h-screen w-full">
        <MainSidebar role={session?.user?.role} />
        <div className="flex flex-col flex-1 gap-2 md:gap-1 max-w-screen md:max-w-[calc(100vw-16rem)]">
          <MainHeader />
          <main className="flex-1 overflow-y-auto p-1 md:px-4 md:py-3">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
