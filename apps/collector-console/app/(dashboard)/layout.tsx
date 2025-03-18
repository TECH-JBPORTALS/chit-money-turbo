import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@cmt/ui/components/sidebar";
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider open={true} defaultOpen={true} className="px-8">
      <AppSidebar />
      <main className="w-full py-8">
        {/* <SidebarTrigger /> */}
        {children}
      </main>
    </SidebarProvider>
  );
}
