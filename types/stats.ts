import {Sku} from "@/types/goods";


export interface ReturnOrderStats {
    sku: Sku,
    count: number,
    sum: number
}
