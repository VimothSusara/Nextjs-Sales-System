import { baseApi } from "@/lib/api/baseApi";
import { Category } from "@prisma/client";

export type CreateCategoryPayload = Omit<Category, 'id' | 'createdAt' | 'updatedAt'| 'active'>

export const categoriesApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getCategories: builder.query<Category[], void>({
            query: () => 'categories',
            providesTags: ['Categories'],
        }),
        createCategory: builder.mutation<Category, CreateCategoryPayload>({
            query: (category) => ({
                url: 'categories',
                method: 'POST',
                body: category,
            }),
            invalidatesTags: ['Categories'],
        })
    })
})

export const { useGetCategoriesQuery, useCreateCategoryMutation } = categoriesApi