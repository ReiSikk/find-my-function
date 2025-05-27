import { useSidebar } from "@/components/ui/sidebar"
import { LucideSidebarClose, LucideSidebarOpen } from "lucide-react"
 
export function AccountSideBarTrigger() {
  const { toggleSidebar, state } = useSidebar()
  const sidebarOpen = state === "expanded"
  const buttonText = sidebarOpen ? "Close sidebar" : "Open sidebar"
 
  return (
    <div onClick={toggleSidebar} className="cursor-pointer flex gap-2 text-sm font-medium transition-all bg-transparent text-(--color-secondary) px-4 py-2 ml-4">
    {sidebarOpen ? <LucideSidebarClose className="h-6 w-6" /> : <LucideSidebarOpen className="h-6 w-6" />}
    </div>
)  
}