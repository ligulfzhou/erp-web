
export interface StepCount {
    [key: string]: number;
}

export interface Order {
    id: number,
    customer_no: string,
    order_no: string,
    order_date: number
    delivery_date: number,
    is_return_order: boolean,
    is_urgent: boolean
    steps: StepCount;
}

export interface OrderGoods {
    id: number,
    order_id: number,
    goods_id: number,
    order_no: string,
    image: string,
    name: string,
    package_card: string,
    package_card_des: string
}

export interface OrderItem {
    id: number,
    order_goods_id: number,
    order_id: number,
    sku_id: number
    count: number,
    unit: string,
    unit_price: number | null,
    total_price: number | null
    notes: string | null
}


export interface DateWithOrders {
    date: string;
    orders: Order[];
}
