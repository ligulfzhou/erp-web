import {Table, Button, Tag} from 'antd';
import LayoutWithMenu from "@/components/Layouts/LayoutWithMenu";
import {ColumnsType} from "antd/es/table";
import {DateWithOrders} from '@/types'
import {useRouter} from "next/router";
import {parseQueryParam} from "@/utils/utils";
import useParameters from "@/hooks/useParameters";
import useOrderDates from "@/hooks/useOrderDates";
import useRouterUtils from "@/hooks/useRouterUtils";
import {b64Encode} from "@/utils/b64";


export default function Order() {
    const router = useRouter()
    const {page, pageSize} = useParameters()
    let customerNo = parseQueryParam(router.query.customerNo)
    const {dateWithOrders, total, isLoading} = useOrderDates(customerNo)
    const {reloadPage} = useRouterUtils()

    const columns: ColumnsType<DateWithOrders> = [
        {
            title: "日期",
            dataIndex: "date",
            width: "150px"
        },
        {
            title: "订单号",
            key: "order_nos",
            dataIndex: 'order_nos',
            render: (_, record) => (
                <>
                    {record.orders.map(order => (
                        <Tag
                            key={`order-${order.id}`}
                            className='cursor-pointer'
                            onClick={() => {
                                const back = router.asPath;
                                router.replace(`/goods/order/${customerNo}/${order.order_no}?back=${b64Encode(back)}`)
                            }}
                        >
                            {order.order_no}
                        </Tag>
                    ))}
                </>
            )
        },
    ];


    return (
        <LayoutWithMenu>
            <div className='m-2 p-5 bg-white rounded'>
                <Button type="primary">
                    刷新
                </Button>
            </div>

            <div className='m-2 p-5 bg-white rounded'>
                <Table
                    bordered={true}
                    size={"small"}
                    loading={isLoading}
                    columns={columns}
                    pagination={{total: total, current: page, pageSize: pageSize}}
                    dataSource={dateWithOrders}
                    onChange={(pagination, filters, sorter) => {
                        reloadPage({
                            page: pagination.current,
                            pageSize: pagination.pageSize,
                        })
                    }}
                />
            </div>
        </LayoutWithMenu>
    );
};
