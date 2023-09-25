import useSWR from 'swr'
import {fetcher} from "@/utils/utils";
import {host} from "@/utils/const";
import {ListReponse} from "@/types/common";
import useParameters from "@/hooks/useParameters";
import {ReturnOrderStats} from "@/types/stats";

export default function useReturnOrderStats () {
    const {page, pageSize} = useParameters()

    const key = `${host}/api/stats/return/orders?page=${page}&pageSize=${pageSize}`
    const { data, error } = useSWR<ListReponse<ReturnOrderStats>>(
        key, fetcher
    )

    let returnOrderStats: ReturnOrderStats[] = []
    let total: number = 0
    if (data !== undefined && data.data !== undefined && data.data.list) {
        returnOrderStats = data.data.list
        total = data.data.total
    }

    return {
        key,
        returnOrderStats,
        total,
        isLoading: !error && !data,
        isError: error
    }
}
