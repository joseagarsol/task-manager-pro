"use client";

import * as React from "react";
import {
  Kanban,
  LayoutDashboard,
  LogOut,
  User,
  ChevronsUpDown,
  ChevronRight,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "../ui/sidebar";
import { Avatar, AvatarImage } from "../ui/avatar";

import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Separator } from "../ui/separator";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function MainSidebar() {
  const { isMobile } = useSidebar();
  const [openBoards, setOpenBoards] = React.useState(true);
  const { data: session } = useSession();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Kanban className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">
                    Task Manager Pro
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Tableros"
                onClick={() => setOpenBoards(!openBoards)}
                isActive={openBoards}
              >
                <LayoutDashboard />
                <span>Tableros</span>
                <ChevronRight
                  className={`ml-auto transition-transform duration-200 ${
                    openBoards ? "rotate-90" : ""
                  }`}
                />
              </SidebarMenuButton>
              {openBoards && (
                <SidebarMenuSub>
                  <SidebarMenuSubItem>
                    <SidebarMenuSubButton asChild>
                      <Link href="#">
                        <span>Tablero</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                </SidebarMenuSub>
              )}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <Popover>
              <PopoverTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="bg-muted flex rounded-full aspect-square size-8 items-center justify-center rounded-lg">
                    {session?.user && session?.user?.image ? (
                      <Avatar>
                        <AvatarImage
                          src={session?.user?.image}
                          alt={session?.user?.name || ""}
                          width={128}
                          height={128}
                          className="object-cover"
                        />
                      </Avatar>
                    ) : (
                      <User className="size-4" />
                    )}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {session?.user?.name}
                    </span>
                    <span className="truncate text-xs">
                      {session?.user?.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </PopoverTrigger>
              <PopoverContent
                className="w-(--radix-popover-trigger-width) min-w-56 rounded-lg p-0"
                side={isMobile ? "bottom" : "right"}
                align="end"
                sideOffset={4}
              >
                <div className="flex items-center gap-2 p-2 text-left text-sm">
                  <div className="bg-muted flex rounded-full aspect-square size-8 items-center justify-center rounded-lg">
                    {session?.user && session?.user?.image ? (
                      <Avatar>
                        <AvatarImage
                          src={session?.user?.image}
                          alt={session?.user?.name || ""}
                          width={128}
                          height={128}
                          className="object-cover"
                        />
                      </Avatar>
                    ) : (
                      <User className="size-4" />
                    )}
                  </div>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">
                      {session?.user?.name}
                    </span>
                    <span className="truncate text-xs">
                      {session?.user?.email}
                    </span>
                  </div>
                </div>
                <Separator />
                <div className="p-1">
                  <Link href="/profile">
                    <button className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50">
                      <User className="mr-2 size-4" />
                      Mi Perfil
                    </button>
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="relative flex w-full cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                  >
                    <LogOut className="mr-2 size-4" />
                    Cerrar Sesión
                  </button>
                </div>
              </PopoverContent>
            </Popover>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
