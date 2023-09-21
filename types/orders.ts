
export interface StepIndexCount {
    step: number;
    index: number;
    count: number;
}
export interface Order {
    id: number,
    customer_no: string,
    order_no: string,
    order_date: number
    delivery_date: number,
    is_return_order: boolean,
    is_urgent: boolean
    steps: StepIndexCount[];
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

export interface OrderPlainSkuModel {
    id: number;
    name: string;
    image: string;
    sku_no: string;
    count: number;
    unit: string;
    unit_price: number;
    total_price: number;
    notes: string;
    step: number;
    is_next_action: boolean;
    current_index: number;
    current_step: number;
    current_notes: string;
}

export interface DateWithOrders {
    date: string;
    orders: Order[];
}
