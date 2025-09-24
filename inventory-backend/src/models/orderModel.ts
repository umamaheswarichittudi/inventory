export interface OrderItem {
  productId: number;
  quantity: number;
}

export interface Order {
  id?: number;
  userId: number;
  items: OrderItem[];
  created_at?: Date;
}
