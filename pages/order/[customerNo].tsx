import {Table, Space, Button, Tag} from 'antd';
import LayoutWithMenu from "@/components/Layouts/LayoutWithMenu";
import {ColumnsType} from "antd/es/table";
import useOrders from "@/hooks/useOrders";
import {Order} from '@/types'
import {useRouter} from "next/router";
import {getColorWithStepAndIndex, getDepartmentAndNotesWithStepAndIndex, parseQueryParam} from "@/utils/utils";
import useParameters from "@/hooks/useParameters";
import ExcelImporter from "@/components/uploader/ExcelImporter";
import {useEffect, useState} from "react";
import OrderModal from "@/components/order/OrderModal";
import useRouterUtils from "@/hooks/useRouterUtils";

export default function Order() {
    const router = useRouter()
    const {page, pageSize, order_id, order_no} = useParameters()
    let customerNo = parseQueryParam(router.query.customerNo)
    const {orders, total, isLoading, isValidating, key, mutate} = useOrders(customerNo)
    const [refresh, setRefresh] = useState<boolean>(false);
    const [openOrderModal, setOpenOrderModal] = useState<boolean>(false)
    const {reloadPage} = useRouterUtils()

    useEffect(() => {
        if (order_id || order_no) {
            setOpenOrderModal(true)
        }
    }, [order_id, order_no]);

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
            width: "500px",
            render: (_, record) => (
                <>
                    {record.steps.map(stepIndexCount => (
                        <Tag color={getColorWithStepAndIndex(stepIndexCount.step, stepIndexCount.index)}
                             key={`${record.id}-${stepIndexCount.step}-${stepIndexCount.index}`}>
                            <div className='text-black'>
                                {getDepartmentAndNotesWithStepAndIndex(stepIndexCount.step, stepIndexCount.index)} {stepIndexCount.count}
                            </div>
                        </Tag>
                    ))}
                </>
            )
        },
        {
            title: '操作',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a href='#'
                       onClick={(event) => {
                           event.preventDefault()
                           reloadPage({
                               order_no: record.order_no
                           })
                           setOpenOrderModal(true)
                       }}>
                        查看订单
                    </a>

                    <a href='#' onClick={(event) => {
                        event.preventDefault()
                        console.log("查看订单商品")
                    }}>
                        查看订单商品
                    </a>
                </Space>
            ),
        },
    ];

    return (
        <LayoutWithMenu>
            <OrderModal
                open={openOrderModal}
                closeFn={
                    () => setOpenOrderModal(false)
                }
                orders={orders}
            />

            <div className='text-black my-2 gap-2 flex flex-row'>
                <Button
                    className='text-white'
                    type={'primary'}
                    style={{borderRadius: 8}}
                    onClick={() => {
                        setRefresh(true)
                        // @ts-ignore
                        mutate(key).finally(() => setRefresh(false))
                    }}
                >
                    刷新
                </Button>

                <ExcelImporter callback={()=> {
                    setRefresh(true)
                    // @ts-ignore
                    mutate(key).finally(()=> setRefresh(false))
                }}/>
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
