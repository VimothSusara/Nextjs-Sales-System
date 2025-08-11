import {
    LayoutDashboard,
    FileText,
    ShoppingCart,
    Users,
} from "lucide-react";
import React from "react";

export type Role = "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "SALES_REP" | "ACCOUNTANT" | "CUSTOMER" | "ALL";

export type NavItem = {
    path: string
    icon: React.ElementType
    label: string
    roles: Role[]
    children?: NavItem[]
}

export const navItems: NavItem[] = [
    {
        path: "/dashboard",
        icon: LayoutDashboard,
        label: "Dashboard",
        roles: ["ALL"],
        children: []
    },
    {
        path: "/items",
        icon: ShoppingCart,
        label: "Item Management",
        roles: ["SUPER_ADMIN", "ADMIN", "MANAGER", "SALES_REP", "ACCOUNTANT"],
        children: [
            {
                path: "/items",
                icon: FileText,
                label: "Items",
                roles: ["ALL"],
                children: []
            },
            {
                path: "/item/report",
                icon: ShoppingCart,
                label: "Item Report",
                roles: ["ALL"],
                children: []
            },
        ]
    },
    {
        path: "/users",
        icon: Users,
        label: "User Management",
        roles: ["SUPER_ADMIN"],
        children: [
            {
                path: "/users",
                icon: Users,
                label: "Users",
                roles: ["ALL"],
                children: []
            },
        ]
    },
]