"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { navItems, NavItem, Role } from "@/lib/nav-items";

export function MainSidebar({ role }: { role: Role }) {
  const pathname = usePathname();

  const hasAccess = (roles: Role[]) => {
    console.log(role);
    return roles.includes("ALL") || roles.includes(role);
  };

  const renderNavItems = (items: NavItem[]) => {
    return items.map((item) => {
      if (!hasAccess(item.roles)) {
        return null;
      }

      const isActive = item.path === pathname;

      if (item.children && item.children.length > 0) {
        return (
          <Collapsible key={item.path} defaultOpen className="group">
            <CollapsibleTrigger asChild>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href={item.path}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </CollapsibleTrigger>

            <CollapsibleContent>
              {item.children.map((child) => {
                if (!hasAccess(child.roles)) {
                  return null;
                }

                const isActive = child.path === pathname;

                return (
                  <SidebarMenuSub key={child.path}>
                    <SidebarMenuSubButton asChild isActive={isActive}>
                      <Link href={child.path}>
                        <child.icon />
                        <span>{child.label}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSub>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        );
      }

      if (item.path) {
        return (
          <SidebarMenuItem key={item.path}>
            <SidebarMenuButton asChild isActive={isActive}>
              <Link href={item.path}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      }
    });
  };

  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarHeader>
        <span>{role ? role : "User"}</span>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => signOut()}
          className="absolute right-2 top-2"
        >
          <LogOut />
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>{renderNavItems(navItems)}</SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

export default MainSidebar;
