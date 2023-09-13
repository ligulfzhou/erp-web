import useSWR from 'swr'
import {fetcher} from "@/utils/utils";
import useParameters from "./useParameters";
import {host} from "@/utils/const";
import {ListReponse} from "@/types/common";
import {Order} from "@/types/orders";

export default function useOrders(customerNo: string) {
    const {page, pageSize} = useParameters()

    const key = `/api/orders?page=${page}&pageSize=${pageSize}&customer_no=${customerNo}`
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
