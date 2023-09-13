import React, {FC, useState} from "react";
import {Modal, Form, Button, Input, message, Spin} from "antd";


interface Props {
    open: boolean,
    closeFn: ()=> void,
    id: number
}

const AddPRModal: FC<Props> = (
    {
        open,
        closeFn,
        id
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
                    closeFn()
                }}
                closable={true}
                footer={
                    null
                }
            >
                {/*{isMutating ? (*/}
                {/*    <div className='text-center mb-2'>*/}
                {/*        <Spin /> saving pr#{prIdForSearch}...*/}
                {/*    </div>*/}
                {/*) : null}*/}

                {savePRError ? (
                    <div className='text-center text-red-600 font-bold text-pink-darker mb-2'>
                        Error: {savePRError}
                    </div>
                ) : null}

                <Form
                    form={form}
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    // autoComplete="off"
                >
                    <Form.Item
                        label="PR ID"
                        name="prid"
                        rules={[{ required: true, message: 'Please input PR ID!' }]}
                    >
                        <Input
                            // onChange={(env)=>{
                            //     if (env.target.value && !containsOnlyNumbers(env.target.value)) {
                            //         setSavePRError(`pr_id#${env.target.value} not valid`)
                            //         return;
                            //     }
                            //     setSavePRError('')
                            //     setPrIdforSearch(parseInt(env.target.value))
                            // }}
                        />
                    </Form.Item>

                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType="submit">
                            ADD
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    )
}

export default AddPRModal
