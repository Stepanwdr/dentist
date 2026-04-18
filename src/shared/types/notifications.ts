export interface NotificationData {
  bookingId?: number;
  action?: string;
  [key: string]: unknown;
}



export type NotificationType =
  | "info"
  | "warning"
  | "booking"
  | "promotion"

export interface Notification {
  id: number
  userId: string
  title: string
  message: string
  type: NotificationType
  isRead: boolean
  data: NotificationData
  createdAt: Date
}