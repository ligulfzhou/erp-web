import React, {FC, useEffect, useState} from "react";
import {Modal, Form, Input, Select, DatePicker, Radio, message, Spin} from "antd";
import useRouterUtils from "@/hooks/useRouterUtils";
import moment from "moment";
import useSWRMutation from "swr/mutation";
import {updateOrder, UpdateOrderParam} from "@/requests/order";
import {Order} from "@/types";
import useOrderGoodsItems from "@/hooks/useOrderGoodsItems";

const dateFormat = 'YYYY-MM-DD';

interface Props {
    open: boolean,
    closeFn: (success: boolean) => void,
    order: Order | undefined,
    orderNo: string,
}

const OrderGoodsDetailModal: FC<Props> = (
    {
        open,
        closeFn,
        order,
        orderNo
    }
) => {

    const {orderGoods, isError, isLoading,} = useOrderGoodsItems(0, orderNo)

    if (isError) {
        message.error(isError)
    }

    const {
        trigger: callUpdateOrderAPI,
        isMutating: callingUpdateOrderAPI
    } = useSWRMutation('/api/order/update', updateOrder)

    const onFinish = (values: UpdateOrderParam) => {
    };

    return (
        <Modal
            width={'800px'}
            open={open}
            title={'订单商品'}
            onCancel={(e) => {
                closeFn(false)
            }}
            closable={true}
            footer={null}
        >
        </Modal>
    )
}


export default OrderGoodsDetailModal
