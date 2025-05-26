export interface ProductDTO {
  name: string;
  description: string;
  price: number;
  tags: string[];
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  tags?: string[];
}

