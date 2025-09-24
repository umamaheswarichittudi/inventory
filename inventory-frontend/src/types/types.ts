export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  quantity?: number;
  image_url?: string;
}

export interface Order {
  id: number;
  products: Product[];
  total: number;
  status: string;
}
