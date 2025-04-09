export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
  userId: number;
  createdAt: Date;
  updatedAt: Date;
}

export const productResponseDTO = (product: Product) => {
  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    tags: product.tags,
    images: product.images,
    userId: product.userId,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };
};
