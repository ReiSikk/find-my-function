"use client"

import { SignOutButton } from "@clerk/nextjs"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Mail, Calendar, LogOut, Plus } from "lucide-react"
import { UserData } from "@/lib/types"
import { useSidebar } from "@/components/ui/sidebar"
import { AccountSideBarTrigger } from "./account-sidebar-trigger"

interface AccountSidebarProps {
  user: UserData,
  onSelectStack: (stack: string) => void,
}

export function AccountSidebar({ user, onSelectStack }: AccountSidebarProps) {
  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase()
  }

  const formatDate = (date: Date | null) => {
  if (!date) return "Unknown"
  
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  })
}

  return (
    <Sidebar className="border-r bg-(--color-bg) text-(--color-primary) z-10">
      <SidebarHeader className="p-4">
        <SidebarRail className=" bg-(--color-bg) text-(--color-primary) z-10 max-h-fit mt-[82px]">
          <AccountSideBarTrigger />
      </SidebarRail>
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.imageUrl || "/placeholder.svg"} alt={user.firstName || "User"} />
            <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <h2 className="font-semibold text-lg">
              {user.firstName} {user.lastName}
            </h2>
            {user.username && (
              <p className="text-sm text-muted-foreground">@{user.username || "user"}</p>
            )}
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-0 rounded-none mb-2 mx-2 border-(--color-primary) border-b text-(length:--fs-small) font-semibold opacity-70">Account Details</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-3 px-2">
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Email:</span>
              </div>
              <p className="text-sm font-medium px-6">{user.emailAddress}</p>

              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Member since:</span>
              </div>
              <p className="text-sm font-medium px-6">{formatDate(user.createdAt)}</p>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        <SidebarGroupLabel className="border-b border-(--color-primary) rounded-none px-0 mx-2 mb-2 text-(length:--fs-small) font-semibold opacity-70">Search AI for products</SidebarGroupLabel>
        <SidebarGroupContent>
          <div className="flex flex-col gap-2 px-2">
            <Button variant="outline" className="cursor-pointer hover:bg-(--color-primary) hover:text-(--color-bg)" onClick={() => onSelectStack("hydration")}>
              Hydration Products
            </Button>
            <Button variant="outline" className="cursor-pointer hover:bg-(--color-primary) hover:text-(--color-bg)" onClick={() => onSelectStack("protein")}>
              Protein Products
            </Button>
            <Button variant="outline" className="cursor-pointer hover:bg-(--color-primary) hover:text-(--color-bg)" onClick={() => onSelectStack("supplements")}>
              Supplements
            </Button>
          </div>
        </SidebarGroupContent>
      </SidebarContent>

      <SidebarFooter className="p-4">
      <SignOutButton>
        <Button
          variant="outline"
          size="lg"
          className="group/signout w-full flex justify-between cursor-pointer hover:bg-(--color-primary) hover:text-(--color-bg) rounded-full px-4 py-2 text-sm font-medium transition-all"
        >
          <span className="group-hover/signout:text-(--color-bg)">Sign Out</span>
          <LogOut className="h-4 w-4 text-(--color-primary) group-hover/signout:text-(--color-bg)" />
        </Button>
      </SignOutButton>
      </SidebarFooter>
    </Sidebar>
  )
}
