import {Table, Space, Button, Tag} from 'antd';
import LayoutWithMenu from "@/components/Layouts/LayoutWithMenu";
import {ColumnsType} from "antd/es/table";
import useOrders from "@/hooks/useOrders";
import {Order} from '@/types'
import {useRouter} from "next/router";
import {parseQueryParam} from "@/utils/utils";
import useParameters from "@/hooks/useParameters";
import ExcelImporter from "@/components/uploader/ExcelImporter";
import {useState} from "react";


export default function Order() {
    const router = useRouter()
    const {page, pageSize} = useParameters()
    let customerNo = parseQueryParam(router.query.customerNo)
    const {orders, total, isLoading, isValidating, key, mutate} = useOrders(customerNo)
    const [refresh, setRefresh] = useState<boolean>(false);

    const columns: ColumnsType<Order> = [
        {
            title: 'ID',
            dataIndex: 'id',
        },
        {
            title: "订单编号",
            dataIndex: "order_no",
            render: (text) => (
                <div className='font-medium'>
                    {text}
                </div>
            )
        },
        {
            title: "下单时间",
            dataIndex: "order_date"
        },
        {
            title: "交付时间",
            dataIndex: "delivery_date"
        },
        {
            title: "返单/加急",
            key: "return_order_or_urgent",
            dataIndex: 'return_order_or_urgent',
            render: (_, record) => (
                <>
                    {record.is_return_order ? <Tag color='red'>返单</Tag> : null}
                    {record.is_urgent ? <Tag className='yellow'>加急单</Tag> : null}
                </>
            )
        },
        {
            title: "流程进度",
            key: "step_count",
            dataIndex: 'step_count',
            render: (_, record) => (
                <>
                    {Object.entries(record.steps).map((sc, index) => (
                        <Tag color={'red'} key={index}>
                            {sc[0]}: {sc[1]}
                        </Tag>
                    ))}
                </>
            )
        },
        {
            title: '操作',
            key: 'action',
            render: () => (
                <Space size="middle">
                </Space>
            ),
        },
    ];

    return (
        <LayoutWithMenu>
            <div className='my-2 gap-2 flex flex-row'>
                <Button
                    onClick={() => {
                        setRefresh(true)
                        // @ts-ignore
                        mutate(key).finally(() => setRefresh(false))
                    }}
                    type="primary">
                    刷新
                </Button>

                <ExcelImporter/>
            </div>

            <Table
                size={"middle"}
                loading={isLoading || (refresh && isValidating)}
                columns={columns}
                pagination={{total: total, current: page, pageSize: pageSize}}
                dataSource={orders}
            />
        </LayoutWithMenu>
    );

};
