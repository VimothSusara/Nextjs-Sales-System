"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SelectProps<T> = {
  options: T[];
  value: number | null;
  onValueChange: (value: number | null) => void;
  placeholder?: string;
  isLoading?: boolean;
  getLabel: (item: T) => string;
  getValue: (item: T) => number;
  disabled?: boolean;
  allowEmpty?: boolean;
  emptyLabel?: string;
};

const UNSELECTED_VALUE = "UNSELECTED";

export default function BasicSelect<T>({
  options,
  value,
  onValueChange,
  placeholder = "Select an option",
  isLoading = false,
  getLabel,
  getValue,
  disabled = false,
  allowEmpty = true,
  emptyLabel = "Select an option",
}: SelectProps<T>) {
  if (isLoading) {
    return <Skeleton className="h-8 w-full" />;
  }

  return (
    <Select
      value={value ? value.toString() : UNSELECTED_VALUE}
      onValueChange={(value) => {
        onValueChange(value !== UNSELECTED_VALUE ? Number(value) : null);
      }}
      disabled={disabled}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent>
        {allowEmpty && (
          <SelectItem value={UNSELECTED_VALUE}>{emptyLabel}</SelectItem>
        )}

        {options?.map((item) => (
          <SelectItem key={getValue(item)} value={getValue(item).toString()}>
            {getLabel(item)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
