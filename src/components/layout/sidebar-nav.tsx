"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileSearch,
  UserCog, 
  Building,
  ClipboardList,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { UserRole } from "@/types";


const navItems = [
  { href: "/", label: "Painel Principal", icon: LayoutDashboard },
  { href: "/research", label: "Pesquisa de Preços", icon: FileSearch },
  { href: "/suppliers", label: "Fornecedores", icon: Building },
  { href: "/reports", label: "Relatórios", icon: ClipboardList },
  { href: "/admin/users", label: "Gerenciamento de Usuários", icon: UserCog, adminOnly: true },
];

const currentUserRole: UserRole = "Administrador"; 

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <ScrollArea className="flex-1">
      <SidebarMenu>
        <SidebarGroup>
          <SidebarGroupLabel className="font-headline">Menu</SidebarGroupLabel>
            {navItems.map((item) => {
              if (item.adminOnly && currentUserRole !== "Administrador") {
                return null;
              }
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <SidebarMenuItem key={item.href}>
                  <Link href={item.href} passHref legacyBehavior>
                    <SidebarMenuButton
                      isActive={isActive}
                      tooltip={item.label}
                      className="justify-start"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              );
            })}
        </SidebarGroup>
      </SidebarMenu>
    </ScrollArea>
  );
}
