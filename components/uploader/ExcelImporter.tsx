import {UploadOutlined} from '@ant-design/icons';
import type {UploadProps} from 'antd';
import {Button, message, Upload} from 'antd';
import React from 'react';
import {host} from "@/utils/const";

const props: UploadProps = {
    name: 'file',
    multiple: false,
    showUploadList: false,
    action: `${host}/api/upload/excel`,
    accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel",
    onChange(info) {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};

const ExcelImporter = () => {
    return (
        <>
            <Upload {...props}>
                <Button icon={<UploadOutlined/>}>导入订单</Button>
            </Upload>
        </>
    )
}


export default ExcelImporter;
