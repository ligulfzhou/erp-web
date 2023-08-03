import React, {FC, ReactNode, useEffect, useState} from 'react';
import {LaptopOutlined, NotificationOutlined, UserOutlined} from '@ant-design/icons';
import {Breadcrumb, Layout, Menu} from 'antd';
import {useRouter} from "next/router";
import {useIsMounted} from "@/hooks/useIsMounted";

const {Header, Content, Sider} = Layout;

// const items: MenuProps['items'] = [
const items = [
    {
        key: 'resource',
        icon: React.createElement(LaptopOutlined),
        label: "资料",
        children: [
            {
                key: "/",
                label: "商品信息"
            },
            {
                key: "/item",
                label: "商品信息"
            }
        ]
    },
    {
        key: 'item',
        icon: React.createElement(UserOutlined),
        label: "label",
        children: [
            {
                key: "/item/index",
                label: "dash-1-label"
            },
            {
                key: "/login",
                label: "dash-2-label"
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
    const {pathname, push} = useRouter()
    const [openedKey, setOpenedKey] = useState<string>('')

    useEffect(()=> {
        items.map(item=> item.children.map(child=> {
            console.log(`child.key: ${child.key}`)
            if (child.key==pathname) {
                console.log(item.key)
                setOpenedKey(item.key)
            }
        }))
    })

    const isMounted = useIsMounted()
    if (!isMounted) {
        return
    }

    return (
        <Layout style={{minHeight: '100vh'}}>
            <Header style={{display: 'flex', alignItems: 'center', height: "3rem", backgroundColor: "white"}}>
                <div className="demo-logo font-bold">
                    Dashboard
                </div>
                {/*<Menu theme="light" mode="horizontal" defaultSelectedKeys={['2']} items={items1} />*/}
            </Header>
            <Layout>
                <Sider width={200} style={{background: 'white'}}>
                    <Menu
                        onClick={(env) => {
                            console.log(env.key)
                            push(env.key)
                        }}
                        mode="inline"
                        defaultSelectedKeys={[pathname]}
                        defaultOpenKeys={[openedKey]}
                        style={{height: '100%', borderRight: 0}}
                        items={items}
                    />
                </Sider>
                <Layout style={{padding: '0 24px 24px'}}>
                    {/*<Breadcrumb style={{margin: '16px 0'}}>*/}
                    {/*    <Breadcrumb.Item>Home</Breadcrumb.Item>*/}
                    {/*    <Breadcrumb.Item>List</Breadcrumb.Item>*/}
                    {/*    <Breadcrumb.Item>App</Breadcrumb.Item>*/}
                    {/*</Breadcrumb>*/}

                    {/*<Content*/}
                    {/*    style={{*/}
                    {/*        padding: 24,*/}
                    {/*        margin: 0,*/}
                    {/*        minHeight: 280,*/}
                    {/*        background: 'white',*/}
                    {/*    }}*/}
                    {/*>*/}
                    {/*    {children}*/}
                    {/*</Content>*/}

                    {children}
                </Layout>
            </Layout>
        </Layout>
    );
};

export default LayoutWithMenu;
