import React, {FC, useState} from "react";
import {Modal, Form, Input} from "antd";
import {Customer} from "@/types";


interface Props {
    open: boolean,
    closeFn: (success: boolean)=> void,
    customer: Customer|undefined
}

const EditCustomerModal: FC<Props> = (
    {
        open,
        closeFn,
        customer
    }
) => {
    const [savePRError, setSavePRError] = useState<string>('')
    const [form] = Form.useForm();

    const onFinish = (values: any) => {
        setSavePRError('')
        form.resetFields()
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    return (
        <div>
            <Modal
                open={open}
                title='Add PR'
                onCancel={(e) => {
                    e.preventDefault()
                    form.resetFields()
                    setSavePRError('')
                    closeFn(true)
                }}
                closable={true}
                footer={
                    null
                }
            >
                {savePRError ? (
                    <div className='text-center text-red-600 font-bold text-pink-darker mb-2'>
                        Error: {savePRError}
                    </div>
                ) : null}

                <Form
                    form={form}
                    name="修改客户"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ customer }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
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

                    {/*<Form.Item wrapperCol={{offset: 8, span: 16}}>*/}
                    {/*    <Button*/}
                    {/*        disabled={callingAddCustomerAPI}*/}
                    {/*        loading={callingAddCustomerAPI}*/}
                    {/*        type="primary"*/}
                    {/*        htmlType="submit"*/}
                    {/*    >*/}
                    {/*        添加*/}
                    {/*    </Button>*/}
                    {/*</Form.Item>*/}
                </Form>
            </Modal>
        </div>
    )
}

export default EditCustomerModal
