import { baseApi } from "@/lib/api/baseApi";
import type { AppStore } from "@/app/store";

export async function ssrPreload(store: AppStore, preloadFns: (() => any)[]) {
    preloadFns.forEach(fn => fn());
    await Promise.all(store.dispatch(baseApi.util.getRunningQueriesThunk()));
}