import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@cmt/ui/components/sidebar";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <AppSidebar />
      <main className="w-full h-svh">{children}</main>
    </SidebarProvider>
  );
}
