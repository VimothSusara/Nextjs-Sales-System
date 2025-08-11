import { ColumnDef } from "@tanstack/react-table";
import { Item } from "@prisma/client";

export const itemColumns: ColumnDef<Item>[] = [
    {
        accessorKey: "id",
        header: "ID",
        minSize: 50,
    },
    {
        accessorKey: "name",
        header: "Name",
        minSize: 150,
    },
    {
        accessorKey: "description",
        header: "Description",
        minSize: 150,
    },
    {
        accessorKey: "sku",
        header: "Sku",
        minSize: 80,
    },
    {
        accessorKey: "category.name",
        header: "Category",
        minSize: 100,
    },
    {
        accessorKey: "unit.name",
        header: "Unit",
        minSize: 50,
    },
    {
        accessorKey: "itemType",
        header: "Type",
        minSize: 100,
    },
    {
        accessorKey: "barcode",
        header: "Barcode",
        minSize: 150,
    },
    {
        accessorKey: "createdAt",
        header: "Created",
        minSize: 150,
    },
    {
        accessorKey: "active",
        header: "Status",
        minSize: 100,
    },
    // {
    //     accessorKey: "actions",
    //     header: "Actions",
    // }
];