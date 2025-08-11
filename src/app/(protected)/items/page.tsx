"use client";

import ItemTable from "@/app/(protected)/items/data-table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import BasicSelect from "@/components/BasicSelect";
import { useGetUnitsQuery } from "@/features/units/unitsApi";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ITEM_TYPE } from "@prisma/client";
import { useGetCategoriesQuery } from "@/features/categories/categoriesApi";
import AddCategoryPopover from "@/components/AddCategoryPopover";
import AddUnitPopover from "@/components/AddUnitPopover";
import { useCreateItemMutation } from "@/features/items/itemsApi";
import { toast } from "sonner";
import { Decimal } from "decimal.js";

const formSchema = z.object({
  unitId: z.number(),
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  sku: z.string().nullable(),
  itemType: z.enum(ITEM_TYPE),
  categoryId: z.number(),
  reorderLevel: z.coerce.number().nullable(),
  barcode: z.string().nullable(),
  imageUrl: z.string().nullable(),
});

export default function Items() {
  const { data: units, isLoading: unitsLoading } = useGetUnitsQuery();
  const { data: categories, isLoading: categoriesLoading } =
    useGetCategoriesQuery();
  const [createItem, { isLoading: itemCreateLoading }] = useCreateItemMutation();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      unitId: undefined,
      name: "",
      description: "",
      sku: "",
      itemType: ITEM_TYPE.NORMAL,
      categoryId: undefined,
      reorderLevel: 10,
      barcode: "",
      imageUrl: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await createItem(
        {
          unitId: values.unitId,
          name: values.name,
          description: values.description,
          sku: values.sku,
          itemType: values.itemType,
          categoryId: values.categoryId,
          reorderLevel: new Decimal(values.reorderLevel || 10),
          barcode: values.barcode,
          imageUrl: values.imageUrl,
        }
      ).unwrap();
      form.reset();
      toast.success("Item created successfully");
    } catch (error) {
      console.log(error);
      toast.error(error?.data?.message || "Failed to create item");
    }
  };

  return (
    <div>
      <h1 className="text-2xl text-neutral-500 font-semibold my-1 md:my-2">
        Items
      </h1>

      <div className="flex justify-end">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="default">Add Item</Button>
          </DialogTrigger>
          <DialogContent className="md:max-w-3xl overflow-auto">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <DialogHeader>
                  <DialogTitle>Add New Item</DialogTitle>
                  <DialogDescription>
                    Add a new item to your inventory
                  </DialogDescription>
                </DialogHeader>

                <div className="my-1 md:my-4 grid gap-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Name</Label>
                        <Input
                          placeholder="Enter item name"
                          className="border border-gray-300 rounded-md p-2"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Description</Label>
                        <Input
                          placeholder="Enter item description"
                          className="border border-gray-300 rounded-md p-2"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="sku"
                      render={({ field }) => (
                        <FormItem>
                          <Label>SKU</Label>
                          <Input
                            placeholder="Enter SKU"
                            className="border border-gray-300 rounded-md p-2"
                            {...field}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    ></FormField>

                    <FormField
                      control={form.control}
                      name="itemType"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Type</Label>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select a type" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(ITEM_TYPE).map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    ></FormField>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Category</Label>
                          <div className="flex justify-between items-center">
                            <BasicSelect
                              options={categories || []}
                              value={field.value}
                              onValueChange={field.onChange}
                              getLabel={(category) => category.name}
                              getValue={(category) => category.id}
                              isLoading={categoriesLoading}
                              allowEmpty={true}
                              emptyLabel="Select a category"
                            />
                            <AddCategoryPopover
                              onSuccess={(newId) => {
                                field.onChange(newId);
                              }}
                            />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    ></FormField>
                    <FormField
                      control={form.control}
                      name="unitId"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Unit</Label>
                          <div className="flex justify-between items-center">
                            <BasicSelect
                              options={units || []}
                              value={field.value}
                              onValueChange={field.onChange}
                              getLabel={(unit) => unit.name}
                              getValue={(unit) => unit.id}
                              isLoading={unitsLoading}
                              allowEmpty={true}
                              emptyLabel="Select a unit"
                            />
                            <AddUnitPopover
                              onSuccess={(newId) => {
                                field.onChange(newId);
                              }}
                            />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    ></FormField>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <FormField
                      control={form.control}
                      name="barcode"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Barcode</Label>
                          <Input
                            placeholder="Enter barcode"
                            className="border border-gray-300 rounded-md p-2"
                            {...field}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    ></FormField>
                    <FormField
                      control={form.control}
                      name="reorderLevel"
                      render={({ field }) => (
                        <FormItem>
                          <Label>Reorder Level</Label>
                          <Input
                            type="number"
                            placeholder="Enter reorder level"
                            className="border border-gray-300 rounded-md p-2"
                            {...field}
                            onChange={(e) => {
                              const value =
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value);
                              field.onChange(value as number | undefined);
                            }}
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    ></FormField>
                  </div>

                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <Label>Item Image</Label>
                        <Input
                          type="file"
                          className="border border-gray-300 rounded-md p-2"
                          {...field}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => form.reset()}
                    >
                      Cancel
                    </Button>
                  </DialogClose>
                  <Button type="submit" disabled={itemCreateLoading}>Save</Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="w-full my-2">
        <ItemTable />
      </div>
    </div>
  );
}
