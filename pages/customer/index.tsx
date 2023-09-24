import {Table, Space, Button} from 'antd';
import LayoutWithMenu from "@/components/Layouts/LayoutWithMenu";
import {ColumnsType} from "antd/es/table";
import useCustomers from "@/hooks/useCustomers";
import {Customer} from "@/types/customer";
import useRouterUtils from "@/hooks/useRouterUtils";
import useParameters from "@/hooks/useParameters";
import {defaultPageSize} from "@/utils/const";
import AddCustomer from "@/components/customer/AddCustomer";
import {useState} from "react";
import {useSWRConfig} from "swr"


const columns: ColumnsType<Customer> = [
    {
        title: 'ID',
        dataIndex: 'id',
    },
    {
        title: '客户编号',
        dataIndex: "customer_no",
    },
    {
        title: '备注',
        dataIndex: "notes",
    },
    {
        title: '操作',
        key: 'action',
        render: () => (
            <Space size="middle">
                <Button>修改</Button>
            </Space>
        ),
    },
];

export default function Order() {
    const {page, pageSize} = useParameters()
    const {customers, total, isLoading, isError, key} = useCustomers()
    const [addCustomer, setAddCustomer] = useState<boolean>(false)
    const {reloadPage} = useRouterUtils()
    const {mutate} = useSWRConfig()

    const [refresh, setRefresh] = useState<boolean>(false)
    return (
        <LayoutWithMenu>
            <AddCustomer
                open={addCustomer}
                closeFn={(success) => {
                    setAddCustomer(false)
                    if (success) {
                        setRefresh(true)
                        mutate(key).finally(()=> setRefresh(false))
                    }
                }}
            />

            <div className='p-5 m-2 bg-white rounded'>
                <Button
                    loading={refresh}
                    type="primary"
                    onClick={() => {
                        setAddCustomer(true)
                    }}
                >
                    刷新
                </Button>
            </div>

            <div className='p-5 m-2 bg-white rounded'>
                <div></div>
                <Table
                    size={"small"}
                    loading={isLoading}
                    columns={columns}
                    pagination={{
                        total: total,
                        current: page,
                        defaultPageSize: defaultPageSize,
                        pageSize: pageSize,
                        onChange: (thisPage, thisPageSize) => {
                            reloadPage({
                                page: thisPage,
                                pageSize: thisPageSize
                            })
                        }
                    }}
                    dataSource={customers}
                />
            </div>
        </LayoutWithMenu>
    );
};
