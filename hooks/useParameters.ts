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

        mpage,
        mpageSize,
    } = router.query

    let idN = parseQueryParamToNumber(id)
    let pageN = parseQueryParamToNumber(page)
    let pageSizeN = parseQueryParamToNumber(pageSize)

    let mpageN = parseQueryParamToNumber(mpage)
    let mpageSizeN = parseQueryParamToNumber(mpageSize)

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
    if (mpageN==0){
        mpageN = 1
    }
    if (mpageSizeN==0) {
        mpageSizeN = defaultPageSize
    }

    return {
        id: idN,
        page: pageN,
        pageSize: pageSizeN,

        mpage: mpageN,
        mpageSize: mpageSizeN,

        order_id: order_idN,
        order_no,
        sorter_field,
        sorter_order
    }
}
