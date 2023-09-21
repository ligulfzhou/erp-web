import React, {FC, useEffect, useState} from "react";
import useSWRMutation from "swr/mutation";
import {Modal, Form, Button, Input, message} from "antd";
import {addCustomer} from "@/requests";
import {Order} from "@/types";
import useParameters from "@/hooks/useParameters";
import useRouterUtils from "@/hooks/useRouterUtils";


interface Props {
    open: boolean,
    closeFn: (success: boolean) => void,
    orders: Order[]
}

const OrderModal: FC<Props> = (
    {
        open,
        closeFn,
        orders
    }
) => {
    const {order_id, order_no} = useParameters()
    const [curOrder, setCurOrder] = useState<Order | undefined>();
    const [isEdit, setIsEdit] = useState<boolean>(true)
    const {removeParams} = useRouterUtils();

    useEffect(() => {
        if (!order_id && !order_no) {
            setIsEdit(false)
        } else {
            setIsEdit(true)
            let findOrders = orders.filter(order=> order.order_no == order_no || order.id == order_id);
            setCurOrder(findOrders[0])
        }
    }, [order_id, order_no])

    const {
        trigger: callAddCustomerAPI,
        isMutating: callingAddCustomerAPI
    } = useSWRMutation('/api/customers', addCustomer)

    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        callAddCustomerAPI(values).then((res) => {
            if (res.code == 0) {
                console.log(res)
                message.success("添加成功")
            } else {
                message.error(res.msg)
            }
        })
    };

    return (
        <div>
            <Modal
                open={open}
                title={`${isEdit ? "编辑" : "添加"}订单`}
                onCancel={(e) => {
                    e.preventDefault()
                    form.resetFields()
                    removeParams(['order_id', 'order_no'])
                    closeFn(false)
                }}
                closable={true}
                onOk={()=> {
                    console.log("保存")
                }}
            >
                <Form
                    form={form}
                    name="basic"
                    initialValues={{remember: true}}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="客户编号"
                        name="customer_no"
                        rules={[{required: true, message: '请输入客户编号!'}]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label="备注"
                        name="notes"
                        rules={[{required: false, message: '请输入备注!'}]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item wrapperCol={{offset: 8, span: 16}}>
                        <Button
                            disabled={callingAddCustomerAPI}
                            loading={callingAddCustomerAPI}
                            type="primary"
                            htmlType="submit"
                        >
                            添加
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default OrderModal
