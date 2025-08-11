import { useCreateCategoryMutation } from "@/features/categories/categoriesApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useForm } from "react-hook-form";
import * as z from "zod";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Loader2, Plus } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormField, FormItem, FormMessage } from "./ui/form";
import { toast } from "sonner";
import { DialogClose } from "@/components/ui/dialog";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
});

export default function AddCategoryPopover({
  onSuccess,
}: {
  onSuccess: (newId: number) => void;
}) {
  const [createCategory, { isLoading }] = useCreateCategoryMutation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const newId = await createCategory(values).unwrap();
      onSuccess(newId.id);
      form.reset();
      toast.success("Category created successfully");
    } catch (error) {
      //   console.log(error);
      toast.error(error?.data?.message || "Failed to create category");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="default"
          size="sm"
          className="px-1 m-1 h-full"
          disabled={isLoading}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        className="w-auto md:w-80 bg-blue-100"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit(onSubmit)(e);
          }}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <Label>Category Name</Label>
                <Input
                  placeholder="Enter item description"
                  className="border border-gray-300 rounded-md p-2"
                  {...field}
                />
                <FormMessage />
              </FormItem>
            )}
          ></FormField>

          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? <Loader2 className="mr-2 animate-spin" /> : "Save"}
            </Button>
          </div>
        </form>
      </PopoverContent>
    </Popover>
  );
}
