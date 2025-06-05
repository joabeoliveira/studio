"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileSearch,
  Users,
  FileText,
  UserCog, // Corrected from UsersCog
  Briefcase,
  DollarSign,
  ShoppingCart,
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

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/research", label: "Price Research", icon: FileSearch },
  { href: "/suppliers", label: "Suppliers", icon: Building },
  { href: "/reports", label: "Reports", icon: ClipboardList },
  { href: "/admin/users", label: "User Management", icon: UserCog, adminOnly: true }, // Corrected from UsersCog
];

// Placeholder for user role, replace with actual auth context
const currentUserRole = "Admin"; 

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <ScrollArea className="flex-1">
      <SidebarMenu>
        <SidebarGroup>
          <SidebarGroupLabel className="font-headline">Menu</SidebarGroupLabel>
            {navItems.map((item) => {
              if (item.adminOnly && currentUserRole !== "Admin") {
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
