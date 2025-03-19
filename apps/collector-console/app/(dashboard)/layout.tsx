import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@cmt/ui/components/sidebar";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true} className="px-4">
      <AppSidebar />
      <main className="w-full py-8">{children}</main>
    </SidebarProvider>
  );
}
