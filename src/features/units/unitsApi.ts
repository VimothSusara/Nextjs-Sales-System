import { baseApi } from "@/lib/api/baseApi";
import { Unit } from "@prisma/client";

export type CreateUnitPayload = Omit<Unit, 'id' | 'active'>

export const unitsApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getUnits: builder.query<Unit[], void>({
            query: () => 'units',
            providesTags: ['Units'],
        }),
        createUnit: builder.mutation<Unit, CreateUnitPayload>({
            query: (unit) => ({
                url: 'units',
                method: 'POST',
                body: unit,
            }),
            invalidatesTags: ['Units'],
        })
    }),
})

export const { useGetUnitsQuery, useCreateUnitMutation } = unitsApi