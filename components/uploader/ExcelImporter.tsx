import {UploadOutlined} from '@ant-design/icons';
import type {UploadProps} from 'antd';
import {Button, message, Upload} from 'antd';
import React, {FC} from 'react';
import {host} from "@/utils/const";
import {EmptyResponse} from "@/types";

interface Props {
    callback: () => void
}

const ExcelImporter: FC<Props> = (
    {
        callback
    }
) => {
    const key = 'excel_importer';

    const props: UploadProps = {
        name: 'file',
        multiple: false,
        showUploadList: false,
        action: `${host}/api/upload/excel`,
        accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel",
        onChange(info) {
            if (info.file.status === 'uploading') {
                message.loading({content: "正在上传excel..", key})
                console.log(info.file, info.fileList);
            }

            if (info.file.status === 'done') {
                let res = info.file.response as EmptyResponse;
                if (res.code == 0) {
                    message.success({
                        content: '导入成功', key
                    });
                    callback()
                } else {
                    message.error({
                        content: `导入失败: ${res.msg}`, key
                    });
                }
            } else if (info.file.status === 'error') {
                let res = info.file.response as EmptyResponse;
                message.error({
                    content: `导入失败: ${res.msg}`, key
                });
            }
        },
    };

    return (
        <>
            <Upload {...props}>
                <Button icon={<UploadOutlined/>}>导入订单</Button>
            </Upload>
        </>
    )
}


export default ExcelImporter;
