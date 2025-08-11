import { DataTable } from "@/components/ui/data-table"; // your reusable table
import { itemColumns } from "@/app/(protected)/items/columns";
import { useGetItemsQuery } from "@/features/items/itemsApi";
import { useState } from "react";

export default function ItemTable() {
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 15 });

  const { data, isLoading, error } = useGetItemsQuery({
    page: pagination.pageIndex + 1,
    limit: pagination.pageSize,
  });

  return (
    <DataTable
      columns={itemColumns}
      data={data?.data || []}
      isLoading={isLoading}
      total={data?.total || 0}
      pageIndex={pagination.pageIndex}
      pageSize={pagination.pageSize}
      setPagination={setPagination}
      //   searchField="name"
      //   exportable
    />
  );
}
