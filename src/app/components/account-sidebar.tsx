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
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Mail, Calendar, LogOut } from "lucide-react"
import { UserResource } from "@clerk/types";

interface AccountSidebarProps {
  user: UserResource | null;
  banned?: boolean;
  isAdmin: boolean;
}

export function AccountSidebar({ user, isAdmin }: AccountSidebarProps) {

  const getInitials = (firstName?: string | null, lastName?: string | null) => {
    return `${firstName?.charAt(0) || ""}${lastName?.charAt(0) || ""}`.toUpperCase()
  }

const formatDate = (timestamp: Date | number | null) => {
  if (!timestamp) return "Unknown"

  // If timestamp is a Date, use it directly; if it's a number, convert to Date
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
  })
}

if (!user) {
  return (
    <h2>User not found</h2>
  )
}

  return (
    <Sidebar className="border-r bg-(--color-bg) text-(--color-primary) z-10">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user.imageUrl || "/placeholder.svg"} alt={user.firstName || "User"} />
            <AvatarFallback>{getInitials(user.firstName, user.lastName)}</AvatarFallback>
          </Avatar>
          <div className="flex flex gap-2">
            <h2 className="font-semibold text-lg">
              {user.firstName} {user.lastName}
            </h2>
            {isAdmin && <span className="px-2 py-1 bg-(--color-primary) text-(--color-bg) rounded-md txt-small flex items-center justify-center uppercase">Admin</span>}
          </div>
        </div>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-0 rounded-none mb-2 mx-2 border-(--color-primary) border-b txt-small font-semibold opacity-70">Account Details</SidebarGroupLabel>
          <SidebarGroupContent>
            <div className="space-y-3 px-2">
              <div className="flex items-center gap-2 text-sm mb-1">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Email</span>
              </div>
              <p className="text-sm font-medium">{user.primaryEmailAddress?.emailAddress}</p>

              <div className="flex items-center gap-2 text-sm mb-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Member since</span>
              </div>
              <p className="text-sm font-medium">{formatDate(user.createdAt)}</p>
            </div>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />
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
