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
import OrderGoodsDetailModal from "@/components/order/OrderGoodsDetailModal";

export default function Order() {
    const router = useRouter()
    const {page, pageSize, order_id, order_no} = useParameters()
    let customerNo = parseQueryParam(router.query.customerNo)
    const {orders, total, isLoading, isValidating, key, mutate} = useOrders(customerNo)
    const [refresh, setRefresh] = useState<boolean>(false);
    const {reloadPage} = useRouterUtils()

    const [order, setOrder] = useState<Order | undefined>();
    const [orderNo, setOrderNo] = useState<string>('');
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
                    {record.is_return_order ? <Tag color='red' key={`${record.id}-return`}>返单</Tag> : null}
                    {record.is_urgent ? <Tag className='yellow' key={`${record.id}-urgent`}>加急单</Tag> : null}
                </>
            )
        },
        {
            title: "流程进度",
            key: "step_count",
            dataIndex: 'step_count',
            width: "300px",
            render: (_, record) => (
                <>
                    {record.steps.map(stepIndexCount => (
                        <Tag
                            color={getColorWithStepAndIndex(stepIndexCount.step, stepIndexCount.index)}
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
                    <a
                        key={`${record.id}-detail`}
                        href='#'
                        onClick={(event) => {
                            event.preventDefault()
                            showOrderModal(record)
                        }}>
                        查看订单
                    </a>

                    <a
                        key={`${record.id}-items`}
                        href='#'
                        onClick={
                            (event) => {
                                event.preventDefault()
                                showOrderGoodsModal(record)
                            }
                        }>
                        查看订单商品
                    </a>
                </Space>
            ),
        },
    ];

    const [openOrderModal, setOpenOrderModal] = useState<boolean>(false)
    const showOrderModal = (record: Order) => {
        console.log(`set order: ${record}, ${record.order_no}`)
        setOpenOrderModal(true)
        setOrder(record)
        setOrderNo(record.order_no)
    }

    const [openOrderGoodsModal, setOpenOrderGoodsModal] = useState<boolean>(false)
    const showOrderGoodsModal = (record: Order) => {
        setOpenOrderGoodsModal(true)
        setOrder(record)
        setOrderNo(record.order_no)
    }

    return (
        <LayoutWithMenu>
            <OrderModal
                open={openOrderModal}
                closeFn={(success) => {
                    setOpenOrderModal(false)
                    if (success) {
                        setRefresh(true)
                        // @ts-ignore
                        mutate(key).finally(() => setRefresh(false))
                    }
                }}
                order={order}
                orderNo={orderNo}
            />

            <OrderGoodsDetailModal
                open={openOrderGoodsModal}
                closeFn={() => setOpenOrderGoodsModal(false)}
                order={order} orderNo={orderNo}
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

                <ExcelImporter callback={() => {
                    setRefresh(true)
                    // @ts-ignore
                    mutate(key).finally(() => setRefresh(false))
                }}/>
            </div>

            <Table
                size={"middle"}
                loading={isLoading || (refresh && isValidating)}
                columns={columns}
                pagination={{total: total, current: page, pageSize: pageSize}}
                dataSource={orders}
                onChange={(pagination, filters, sorter) => {
                    reloadPage({
                        page: pagination.current,
                        pageSize: pagination.pageSize,
                    })
                }}
            />
        </LayoutWithMenu>
    );

};
