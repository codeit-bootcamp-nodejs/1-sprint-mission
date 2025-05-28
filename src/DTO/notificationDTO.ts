export interface NotificationDTO {
  id: number;
  userId: number;
  type: 'NEW_COMMENT' | 'PRICE_CHANGED';
  payload: object;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface GetMyNotificationListDTO {
  userId: number;
  type: 'NEW_COMMENT' | 'PRICE_CHANGED';
  payload: object;
  read: boolean;
}

export interface ReadMyNotificationListDTO {
  userId: number;
  type?: 'NEW_COMMENT' | 'PRICE_CHANGED';
  payload?: object;
  read?: boolean;
}
