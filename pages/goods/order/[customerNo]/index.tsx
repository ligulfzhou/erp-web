import {Table, Button, Tag} from 'antd';
import LayoutWithMenu from "@/components/Layouts/LayoutWithMenu";
import {ColumnsType} from "antd/es/table";
import {DateWithOrders} from '@/types'
import {useRouter} from "next/router";
import {parseQueryParam} from "@/utils/utils";
import useParameters from "@/hooks/useParameters";
import useOrderDates from "@/hooks/useOrderDates";



export default function Order() {
    const router = useRouter()
    const {page, pageSize} = useParameters()
    let customerNo = parseQueryParam(router.query.customerNo)
    const {dateWithOrders, total, isLoading} = useOrderDates(customerNo)

    console.log("index..")
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
                                router.replace(`/goods/order/${customerNo}/${order.order_no}`)
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
            <div style={{marginBottom: 16}}>
                <Button type="primary">
                    刷新
                </Button>
            </div>

            <Table
                loading={isLoading}
                columns={columns}
                pagination={{total: total, current: page, pageSize: pageSize}}
                dataSource={dateWithOrders}
            />
        </LayoutWithMenu>
    );
};
