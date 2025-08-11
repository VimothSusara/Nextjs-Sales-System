import { DataTable } from "@/components/ui/data-table"; // your reusable table
import { itemColumns } from "@/app/(protected)/items/columns";
import { useGetItemsQuery } from "@/features/items/itemsApi";

export default function ItemTable() {
  const { data, isLoading, error } = useGetItemsQuery();
  return (
    <DataTable
      columns={itemColumns}
      data={data || []}
      isLoading={isLoading}
    //   searchField="name"
    //   exportable
    />
  );
}
