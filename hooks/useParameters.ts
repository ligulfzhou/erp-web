import {useRouter} from "next/router";
import {parseQueryParam, parseQueryParamToNumber, parseQueryParamToNumberArray} from "@/utils/utils";
import {defaultPageSize} from "@/utils/const";

export default function useParameters () {
    const router = useRouter()
    let {
        id,
        page,
        pageSize,
        order_id,
        order_no,
        sorter_field,
        sorter_order,
    } = router.query

    let idN = parseQueryParamToNumber(id)
    let pageN = parseQueryParamToNumber(page)
    let pageSizeN = parseQueryParamToNumber(pageSize)

    sorter_field = parseQueryParam(sorter_field)
    sorter_order = parseQueryParam(sorter_order)

    let order_idN = parseQueryParamToNumber(order_id)
    order_no = parseQueryParam(order_no)
    if (pageN==0){
        pageN = 1
    }
    if (pageSizeN==0) {
        pageSizeN = defaultPageSize
    }

    return {
        id: idN,
        page: pageN,
        pageSize: pageSizeN,

        order_id: order_idN,
        order_no,
        sorter_field,
        sorter_order
    }
}
