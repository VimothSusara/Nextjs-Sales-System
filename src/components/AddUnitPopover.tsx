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
import { useCreateUnitMutation } from "@/features/units/unitsApi";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  abbreviation: z.string().min(1, "Abbreviation is required"),
});

export default function AddUnitPopover({
  onSuccess,
}: {
  onSuccess: (newId: number) => void;
}) {
  const [createUnit, { isLoading }] = useCreateUnitMutation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      abbreviation: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const newId = await createUnit(values).unwrap();
      onSuccess(newId.id);
      form.reset();
      toast.success("Unit created successfully");
    } catch (error) {
      //   console.log(error);
      toast.error(error?.data?.message || "Failed to create unit");
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
                <Label>Unit Name</Label>
                <Input
                  placeholder="Enter unit name"
                  className="border border-gray-300 rounded-md p-2"
                  {...field}
                />
                <FormMessage />
              </FormItem>
            )}
          ></FormField>

          <FormField
            control={form.control}
            name="abbreviation"
            render={({ field }) => (
              <FormItem>
                <Label>Unit Abbreviation</Label>
                <Input
                  placeholder="Enter unit abbreviation"
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
