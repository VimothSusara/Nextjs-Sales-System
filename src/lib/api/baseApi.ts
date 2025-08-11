import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseApi = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: process.env.NEXTAUTH_URL || "/api",
        credentials: "include",
    }),
    tagTypes: ['PurchaseOrders', 'Quotations', 'Sales', 'GRNs', 'Suppliers', 'Customers', 'Items', 'Categories', 'Units'],
    endpoints: () => ({}),
})