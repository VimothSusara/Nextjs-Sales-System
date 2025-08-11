import { baseApi } from "@/lib/api/baseApi";
import { Item } from "@prisma/client";

export type CreateItemPayload = Omit<Item, 'id' | 'createdAt' | 'updatedAt' | 'active'>

export const itemsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getItems: builder.query<Item[], void>({
            query: () => 'items',
            providesTags: ['Items'],
        }),
        createItem: builder.mutation<Item, CreateItemPayload>({
            query: (item) => ({
                url: 'items',
                method: 'POST',
                body: item,
            }),
            invalidatesTags: ['Items'],
        })
    })
})

export const { useGetItemsQuery, useCreateItemMutation } = itemsApi
