"use client"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavMain({
  items
}) {
  const pathname = usePathname();
  return (
    (<SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title} >
                <Link href={item.url}>
              <SidebarMenuButton tooltip={item.title} className={`${
                  item.url === pathname &&
                   " bg-gray-200 dark:bg-gray-800"
                 } capitalize font-medium hover:bg-gray-300 dark:hover:bg-gray-800 transition-all cursor-pointer`}
              >
                {item.icon && <item.icon />}
                <span>{item.title}</span>
              </SidebarMenuButton>
                </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>)
  );
}
