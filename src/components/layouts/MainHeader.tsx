import { SidebarTrigger } from "@/components/ui/sidebar";

export function MainHeader() {
  return (
    <header className="sticky top-0 z-20 h-14 md:h-16 w-full items-center justify-between border-b bg-background px-4 shadow-sm">
      <SidebarTrigger className="md:hidden" />
    </header>
  );
}

export default MainHeader;
