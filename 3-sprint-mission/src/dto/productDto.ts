export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  tags?: string[];
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}
export interface CreateProduct {
  name: string;
  description: string;
  price: number;
  tags: string[];
}

export interface UpdatedProduct extends Partial<CreateProduct> {}
