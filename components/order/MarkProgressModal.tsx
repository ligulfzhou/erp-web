import React, {FC, useEffect, useState} from "react";
import {Modal, Form, Input, Select, DatePicker, Radio} from "antd";
import useRouterUtils from "@/hooks/useRouterUtils";
import useSWRMutation from "swr/mutation";
import {markProgress, MarkProgressParam} from "@/requests/order";

export interface MarkProgressProps{
    open: boolean,
    closeFn: (success: boolean) => void,
    order_goods_id: number,
    order_item_id: number,
    currentStep: number,
}

const OrderModal: FC<MarkProgressProps> = (
    {
        open,
        closeFn,
        order_goods_id,
        order_item_id,
        currentStep,
    }
) => {
    const {removeParams} = useRouterUtils();
    const [form] = Form.useForm();

    const [formValues, setFormValues] = useState<MarkProgressParam | undefined>(undefined)

    useEffect(() => {
        let _formValues: MarkProgressParam = {
            order_item_id: order_item_id,
            order_goods_id: order_goods_id,
            index: 0,
            notes: '',
        }
        setFormValues(_formValues)
        form.setFieldsValue(_formValues)
    }, [order_goods_id, order_item_id, currentStep])

    const {
        trigger: callMarkProgressAPI,
        isMutating: callingMarkProgressAPI
    } = useSWRMutation('/api/mark/progress', markProgress)

    const onFinish = (values: MarkProgressParam) => {

        callMarkProgressAPI(values).then((res)=> {
            console.log(res)
        })
        // callUpdateOrderAPI(values).then((res) => {
        //     if (res.code == 0) {
        //         console.log(res)
        //         message.success("修改成功")
        //         closeFn(true)
        //         form.resetFields()
        //     } else {
        //         message.error(res.msg)
        //     }
        // })
    };

    return (
        <div>
            <Modal
                width={'400px'}
                open={open}
                title={`标记流程`}
                onCancel={(e) => {
                    form.resetFields()
                    removeParams(['order_id', 'order_no'])
                    closeFn(false)
                }}
                closable={true}
                onOk={() => {
                    form.submit()
                }}
                okText={"确定"}
                cancelText={"取消"}
                confirmLoading={callingMarkProgressAPI}
            >
                <Form
                    form={form}
                    name="basic"
                    layout={'horizontal'}
                    initialValues={formValues}
                    labelCol={{span: 6}}
                    onFinish={onFinish}
                >
                    <Form.Item
                        label="客户编号"
                        name="customer_no"
                        // initialValue={curOrder?.customer_no || ""}
                        rules={[{required: true, message: '请输入客户编号!'}]}
                    >
                        <Select
                            options={[
                                {
                                    value: '',
                                    label: '请选择',
                                },
                                {
                                    value: 'L1001',
                                    label: 'L1001',
                                },
                                {
                                    value: 'L1002',
                                    label: 'L1002',
                                },
                                {
                                    value: 'L1003',
                                    label: 'L1003',
                                },
                                {
                                    value: 'L1004',
                                    label: 'L1004',
                                },
                                {
                                    value: 'L1005',
                                    label: 'L1005',
                                },
                                {
                                    value: 'L1006',
                                    label: 'L1006',
                                },
                            ]}
                        />
                    </Form.Item>

                    <Form.Item
                        label="订单编号"
                        name="order_no"
                        rules={[{required: true, message: '请输入订单编号!'}]}
                    >
                        <Input/>
                    </Form.Item>

                    <Form.Item
                        label="下单时间"
                        name="order_date"
                        rules={[{required: true, message: '请选择下单时间!'}]}
                    >
                        <DatePicker/>
                    </Form.Item>

                    <Form.Item
                        label="交付时间"
                        name="delivery_date"
                    >
                        <DatePicker/>
                    </Form.Item>

                    <Form.Item
                        label="返单"
                        name="is_return_order"
                        rules={[{required: true, message: '请选择是否返单!'}]}
                    >
                        <Radio.Group>
                            <Radio value={true}>是</Radio>
                            <Radio value={false}>否</Radio>
                        </Radio.Group>
                    </Form.Item>

                    <Form.Item
                        label="加急单"
                        name="is_urgent"
                        rules={[{required: true, message: '请选择是否加急单!'}]}
                    >
                        <Radio.Group>
                            <Radio value={true}>是</Radio>
                            <Radio value={false}>否</Radio>
                        </Radio.Group>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default OrderModal
