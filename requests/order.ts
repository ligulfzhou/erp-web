import {Order} from '@/types'
import {commonDataPost, commonEmptyPost} from "@/requests/common";
import {Moment} from "moment/moment";


export interface UpdateOrderParam {
    id: number,
    customer_no: string,
    order_no: string,
    order_date: Moment|string|undefined,
    delivery_date: Moment|string|undefined,
    is_return_order: boolean,
    is_urgent: boolean
}


export async function updateOrder(url: string, {arg}: {arg: UpdateOrderParam}) {
    return commonDataPost<Order>(url, arg)
}


export interface MarkProgressParam {
    order_goods_id: number,
    order_item_id: number,
    index: number,
    notes: string
}

export async function markProgress(url: string, {arg}: {arg: MarkProgressParam}) {
    return commonEmptyPost(url, arg)
}
