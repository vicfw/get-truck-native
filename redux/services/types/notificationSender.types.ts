import { NotificationSender } from '../../../globalTypes';

export interface CreateOrUpdateNotificationSenderResponse {
  data: NotificationSender;
  status: string;
}

export interface GetNotificationSender {
  data: NotificationSender;
  status: string;
}
