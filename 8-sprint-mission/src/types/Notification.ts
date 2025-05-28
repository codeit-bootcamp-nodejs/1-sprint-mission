export interface Notification {
  id: number;
  userId: number | null;
  payload: JSON;
  read: Boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default Notification;
