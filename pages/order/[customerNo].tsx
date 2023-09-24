import {Table, Space, Button, Tag, Form, Input, DatePicker, Row, Col, Checkbox} from 'antd';
import LayoutWithMenu from "@/components/Layouts/LayoutWithMenu";
import {ColumnsType} from "antd/es/table";
import useOrders from "@/hooks/useOrders";
import {Order, OrderSearchParms} from '@/types'
import {useRouter} from "next/router";
import {getColorWithStepAndIndex, getDepartmentAndNotesWithStepAndIndex, parseQueryParam} from "@/utils/utils";
import useParameters from "@/hooks/useParameters";
import ExcelImporter from "@/components/uploader/ExcelImporter";
import React, {useEffect, useState} from "react";
import OrderModal from "@/components/order/OrderModal";
import useRouterUtils from "@/hooks/useRouterUtils";
import OrderGoodsDetailModal from "@/components/order/OrderGoodsDetailModal";
import moment from "moment";
import {dateFormat} from "@/utils/const";
import {useSWRConfig} from "swr";

const {RangePicker} = DatePicker;

export default function Order() {
    const router = useRouter()
    const {
        page, pageSize,
        order_no, order_date_start, order_date_end, delivery_date_start, delivery_date_end, is_return_order, is_urgent
    } = useParameters()
    let customerNo = parseQueryParam(router.query.customerNo)
    const {orders, total, isLoading, isValidating, key} = useOrders(customerNo)
    console.log(key)
    const [refresh, setRefresh] = useState<boolean>(false);
    const {reloadPage, removeParams} = useRouterUtils()

    const [order, setOrder] = useState<Order | undefined>();
    const [orderNo, setOrderNo] = useState<string>('');

    useEffect(() => {
        // 用户切换tab时，清掉form
        let values = {}
        if (order_no) {
            // @ts-ignore
            values['order_no'] = order_no
        } else {
            // @ts-ignore
            values['order_no'] = undefined
        }
        if (order_date_start && order_date_end) {
            // @ts-ignore
            values['order_date'] = [moment(order_date_start, dateFormat), moment(order_date_end, dateFormat)]
        } else {
            // @ts-ignore
            values['order_date'] = undefined
        }
        if (delivery_date_start && delivery_date_end) {
            // @ts-ignore
            values['delivery_date'] = [moment(delivery_date_start, dateFormat), moment(delivery_date_end, dateFormat)]
        } else {
            // @ts-ignore
            values['delivery_date'] = undefined
        }
        if (is_urgent) {
            // @ts-ignore
            values['is_urgent'] = true
        } else {
            // @ts-ignore
            values['is_urgent'] = undefined
        }
        if (is_return_order) {
            // @ts-ignore
            values['is_return_order'] = true
        } else {
            // @ts-ignore
            values['is_return_order'] = undefined
        }

        form.setFieldsValue(values)
    }, [customerNo]);

    const columns: ColumnsType<Order> = [
        {
            title: 'ID',
            dataIndex: 'id',
            sorter: (a, b) => a.id - b.id
        },
        {
            title: "订单编号",
            dataIndex: "order_no",
            sorter: (a, b) => a.order_no.localeCompare(b.order_no),
            render: (text) => (
                <div className='font-medium'>
                    {text}
                </div>
            )
        },
        {
            title: "下单时间",
            dataIndex: "order_date",
            // defaultSortOrder: 'descend',
            sorter: (a, b) => a.order_date - b.order_date,
        },
        {
            title: "交付时间",
            dataIndex: "delivery_date",
            // defaultSortOrder: 'descend',
            sorter: (a, b) => a.order_date - b.order_date,
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
    const [form] = Form.useForm();
    const {mutate} = useSWRConfig()

    const searchOrders = () => {
        const formParams: {
            order_no: string | undefined,
            is_return_order: boolean | undefined,
            is_urgent: boolean | undefined,
            order_date: moment.Moment[] | undefined,
            delivery_date: moment.Moment[] | undefined
        } = form.getFieldsValue();
        let order_date_start: string | undefined = undefined;
        let order_date_end: string | undefined = undefined;
        if (formParams.order_date && formParams.order_date.length == 2) {
            order_date_start = formParams.order_date[0].format(dateFormat)
            order_date_end = formParams.order_date[1].format(dateFormat)
        }

        let delivery_date_start: string | undefined = undefined;
        let delivery_date_end: string | undefined = undefined;
        if (formParams.delivery_date && formParams.delivery_date.length == 2) {
            delivery_date_start = formParams.delivery_date[0].format(dateFormat)
            delivery_date_end = formParams.delivery_date[1].format(dateFormat)
        }
        let params: OrderSearchParms = {
            delivery_date_end,
            delivery_date_start,
            order_date_end,
            order_date_start,
            is_return_order: formParams['is_return_order'],
            is_urgent: formParams['is_urgent'],
            order_no: formParams['order_no']
        }

        reloadPage(params)
    }
    const reset = () => {
        let obj: OrderSearchParms = {
            delivery_date_end: "",
            delivery_date_start: "",
            is_return_order: false,
            is_urgent: false,
            order_date_end: "",
            order_date_start: "",
            order_no: ""
        }
        removeParams(Object.keys(obj))
        form.resetFields()
    }

    return (
        <LayoutWithMenu>
            <OrderModal
                open={openOrderModal}
                closeFn={(success) => {
                    setOpenOrderModal(false)
                    if (success) {
                        setRefresh(true)
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

            <div className='p-5 m-2 bg-white rounded text-black gap-2 flex flex-row'>
                <Button
                    loading={refresh}
                    type={'primary'}
                    onClick={() => {
                        console.log("refresh....")
                        setRefresh(true)
                        mutate(key).finally(() => setRefresh(false))
                        // mutate(key)
                    }}
                >
                    刷新
                </Button>

                <ExcelImporter callback={() => {
                    setRefresh(true)
                    mutate(key).finally(() => setRefresh(false))
                }}/>
            </div>

            {/*filters*/}
            <div className='bg-white p-5 m-2 rounded'>
                <Form
                    form={form}
                    name="basic"
                    layout={'horizontal'}
                    // initialValues={formValues}
                    // labelCol={{span: 5}}
                    // onFinish={onSearch}
                >
                    <div className='flex flex-row justify-around flex-wrap items-start'>
                        <div className='w-72'>
                            <Form.Item
                                label="订单编号"
                                name="order_no"
                            >
                                <Input placeholder={'订单编号'}/>
                            </Form.Item>
                        </div>

                        <div className='w-72'>
                            <Form.Item
                                label="下单时间"
                                name="order_date"
                            >
                                <RangePicker/>
                            </Form.Item>
                        </div>

                        <div className='w-72'>
                            <Form.Item
                                label="交付时间"
                                name="delivery_date"
                            >
                                <RangePicker/>
                            </Form.Item>
                        </div>
                        <div className='w-72 flex flex-row gap-2'>
                            <div className='w-32'>
                                <Form.Item
                                    label="返单"
                                    name="is_return_order"
                                    valuePropName='checked'
                                >
                                    <Checkbox/>
                                </Form.Item>
                            </div>
                            <div className='w-32'>
                                <Form.Item
                                    label="加急"
                                    name="is_urgent"
                                    valuePropName='checked'
                                >
                                    <Checkbox/>
                                </Form.Item>
                            </div>
                        </div>
                        <Col span={6}>
                            <Form.Item>
                                <div className='flex flex-row justify-center gap-2'>
                                    <Button type="primary" htmlType="submit"
                                            onClick={(event) => {
                                                console.log(form.getFieldsValue())
                                                event.preventDefault()
                                                searchOrders()
                                            }}>
                                        搜索
                                    </Button>

                                    <Button
                                        htmlType="submit"
                                        onClick={() => {
                                            reset()
                                        }}>
                                        重置
                                    </Button>
                                </div>
                            </Form.Item>
                        </Col>
                    </div>

                    {/*</Row>*/}
                </Form>
            </div>

            <div className='bg-white p-5 m-2 rounded'>
                <Table
                    rowKey={"id"}
                    size={"small"}
                    bordered={true}
                    loading={isLoading || refresh || isValidating}
                    columns={columns}
                    pagination={{total: total, current: page, pageSize: pageSize}}
                    dataSource={orders}
                    onChange={(pagination, filters, sorter) => {
                        var obj = {
                            page: pagination.current,
                            pageSize: pagination.pageSize,
                            sorter_field: '',
                            sorter_order: '',
                        }
                        if (!Array.isArray(sorter)) {
                            obj['sorter_field'] = sorter.field as string || ''
                            obj['sorter_order'] = sorter.order as string || ''
                        }
                        reloadPage(obj)
                    }}
                />
            </div>

        </LayoutWithMenu>
    );

};
