import useSWR from 'swr'
import {fetcher} from "@/utils/utils";
import useParameters from "./useParameters";
import {host} from "@/utils/const";
import {ListReponse} from "@/types/common";
import {Order} from "@/types/orders";

export default function useOrders(customerNo: string) {
    const {page, pageSize, sorter_order, sorter_field} = useParameters()

    let key = `/api/orders?page=${page}&pageSize=${pageSize}&customer_no=${customerNo}`
    if (sorter_order&&sorter_field) {
        key = `/api/orders?page=${page}&pageSize=${pageSize}&customer_no=${customerNo}&sorter_field=${sorter_field}&sorter_order=${sorter_order}`
    }

    const {data, error, mutate, isValidating} = useSWR<ListReponse<Order>>(
        `${host}${key}`,
        fetcher
    )

    let orders: Order[] = []
    let total: number = 0
    if (data !== undefined && data.data !== undefined && data.data.list) {
        orders = data.data.list
        total = data.data.total
    }

    return {
        key,
        mutate,
        isValidating,
        orders,
        total,
        isLoading: !error && !data,
        isError: error
    }

}
