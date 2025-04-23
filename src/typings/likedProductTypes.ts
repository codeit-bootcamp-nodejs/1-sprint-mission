import { Infer } from 'superstruct';
import { GetLikedProductListParamsStruct } from '../structs/usersStructs';

export interface LikedProduct {
  userId: number;
  productId: number;
  createdAt: Date;
}

type LikedProductListParams = Infer<typeof GetLikedProductListParamsStruct>;
export type LikedProductListParamsInput = LikedProductListParams & { userId: number };
