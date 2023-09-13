import {Table, Button, Tag} from 'antd';
import LayoutWithMenu from "@/components/Layouts/LayoutWithMenu";
import {ColumnsType} from "antd/es/table";
import {DateWithOrders} from '@/types'
import {useRouter} from "next/router";
import {parseQueryParam} from "@/utils/utils";
import useParameters from "@/hooks/useParameters";
import useOrderDates from "@/hooks/useOrderDates";


const columns: ColumnsType<DateWithOrders> = [
    {
        title: "日期",
        dataIndex: "date"
    },
    {
        title: "订单号",
        key: "order_nos",
        dataIndex: 'order_nos',
        render: (_, record) => (
            <>
                {record.orders.map(order => (
                    <Tag
                        className='cursor-pointer'
                        onClick={() => {
                            // todo:
                        }}
                    >
                        {order.order_no}
                    </Tag>
                ))}
            </>
        )
    },
];


export default function Order() {
    const router = useRouter()
    const {page, pageSize} = useParameters()
    let customerNo = parseQueryParam(router.query.customerNo)
    const {dateWithOrders, total, isLoading} = useOrderDates(customerNo)

    return (
        <LayoutWithMenu>
            <div style={{marginBottom: 16}}>
                <Button type="primary">
                    Reload
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
