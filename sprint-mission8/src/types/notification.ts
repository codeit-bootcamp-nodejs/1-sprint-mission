export type NotificationType = 'NEW_COMMENT' | 'PRICE_CHANGED';

export interface NewCommentPayload {
  articleId: number;
}

export interface PriceChangedPayload {
  productId: number;
  price: number;
}

export type NotificationPayloadMap = {
  NEW_COMMENT: NewCommentPayload;
  PRICE_CHANGED: PriceChangedPayload;
};
