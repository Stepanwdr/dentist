import { NotificationType ,Notification} from "@shared/types/notifications";
import {PaginationParams} from "@shared/types";
import {ApiResponse} from "@shared/api";

export interface GetNotificationsParams extends PaginationParams {
  isRead?: boolean;
  type?: NotificationType;
}

export interface GetNotificationsResponse {
  pagination: PaginationParams;
  data: {
    data: Notification[];
  }
}
