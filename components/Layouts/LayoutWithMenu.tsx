import React, {FC, ReactNode, useEffect, useState} from 'react';
import {DollarCircleOutlined, LaptopOutlined, LineChartOutlined, UserOutlined} from '@ant-design/icons';
import {Layout, Menu, MenuProps} from 'antd';
import {useRouter} from "next/router";
import {useIsMounted} from "@/hooks/useIsMounted";

const {
    Header,
    Content,
    Sider
} = Layout;


let customers = ["L1001", "L1002", "L1003", "L1004", "L1005", "L1006"]


const items: MenuProps["items"] = [
    {
        key: "home",
        icon: React.createElement(LineChartOutlined),
        label: "统计",
        children: [
            {
                key: "/",
                label: "统计"
            }
        ]
    },
    {
        key: 'order',
        icon: React.createElement(DollarCircleOutlined),
        label: "订单管理",
        children: [
            ...customers.map(customer => ({
                "key": `/order/${customer}`,
                "label": `${customer}客户`
            })),
            {
                'key': '/order',
                'label': '所有客户'
            }
        ]
    },
    {
        key: 'order-goods',
        icon: React.createElement(LaptopOutlined),
        label: "订单商品",
        children: [...customers.map(customer => ({
            "key": `/goods/order/${customer}`,
            "label": `${customer}客户`
        })), {
            'key': '/goods/order',
            'label': '所有客户'
        }]
    },
    {
        key: 'customer',
        icon: React.createElement(UserOutlined),
        label: "客户",
        children: [
            {
                key: "/customer",
                label: "客户列表"
            }
        ]
    }
]

interface Props {
    children: ReactNode
}


const LayoutWithMenu: FC<Props> = ({
                                       children
                                   }) => {
    const router = useRouter()
    const {pathname, push} = router;
    const [openedKey, setOpenedKey] = useState<string>('')

    useEffect(() => {
        if (pathname.startsWith("/goods/order")) {
            setOpenedKey("order-goods")
        } else if (pathname.startsWith("/order")) {
            setOpenedKey("order")
        } else if (pathname == '/') {
            setOpenedKey('home')
        } else if (pathname == '/customer') {
            setOpenedKey('customer')
        }
    }, [pathname])

    const isMounted = useIsMounted()
    if (!isMounted) {
        return
    }

    return (
        <Layout className='h-screen'>
            <Header
                style={{display: 'flex', alignItems: 'center', height: "3rem"}}
            >
                <div className="demo-logo font-bold text-white">
                    lien后台管理
                </div>
            </Header>
            <Layout>
                <Sider
                    width={200}
                    style={{background: 'white'}}
                    collapsible={true}
                    trigger={null}
                >
                    <Menu
                        multiple={false}
                        onClick={(env) => {
                            push(env.key)
                        }}
                        mode="inline"
                        defaultSelectedKeys={[router.asPath]}
                        defaultOpenKeys={[openedKey]}
                        style={{height: '100%', borderRight: 0}}
                        items={items}
                    />
                </Sider>
                <Layout>
                    <Content className='overflow-auto'>
                        <div className='bg-white p-5 m-5 rounded overflow-y-auto'>
                            {children}
                        </div>
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default LayoutWithMenu;
