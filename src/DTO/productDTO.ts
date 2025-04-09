import { Product } from '@prisma/client';

export interface CreateProductDTO {
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
}

export interface GetProductDTO {
  name: string;
  description: string;
  price: number;
  tags: string[];
  images: string[];
  userId: number;
  favoriteCount: number;
  isFavorited?: boolean;
}

export interface UpdateProductDTO {
  name?: string;
  description?: string;
  price?: number;
  tags?: string[];
  images?: string[];
}

export type ProductFavoriteDTO = Product & {
  favoriteCount: number;
  isFavorited?: boolean;
};
