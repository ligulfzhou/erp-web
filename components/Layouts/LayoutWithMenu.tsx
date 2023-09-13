import React, {FC, ReactNode, useEffect, useState} from 'react';
import {LaptopOutlined, UserOutlined} from '@ant-design/icons';
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
        icon: React.createElement(LaptopOutlined),
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
        icon: React.createElement(LaptopOutlined),
        label: "订单管理",
        children: [
            ...customers.map(customer => ({
                "key": `/order/${customer}`,
                "label": customer
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
            "label": customer
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
        <Layout style={{minHeight: '100vh'}}>
            <Header
                style={{display: 'flex', alignItems: 'center', height: "3rem", backgroundColor: "white"}}
            >
                <div className="demo-logo font-bold">
                    lien后台管理
                </div>
            </Header>
            <Layout>
                <Sider
                    width={200}
                    style={{background: ''}}
                    collapsible={true}
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
                <Layout style={{padding: '12px'}}>
                    <Content
                        style={{
                            padding: 12,
                            margin: 0,
                            minHeight: 280,
                            background: 'white',
                        }}
                    >
                        {children}
                    </Content>
                </Layout>
            </Layout>
        </Layout>
    );
};

export default LayoutWithMenu;
