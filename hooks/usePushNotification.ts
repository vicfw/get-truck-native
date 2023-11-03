import * as Notifications from 'expo-notifications';
import { useEffect, useRef, useState } from 'react';

export const usePushNotification = (routeName?: string) => {
  if (routeName !== 'Chat') {
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
      }),
    });

    const [notifications, setNotifications] = useState<boolean>(false);
    const [notification, setNotification] = useState(false);

    const notificationListener = useRef<any>();

    const responseListener = useRef<any>();

    const handleNotification = (notification: any) => {
      setNotifications(notifications);
    };

    const handleNotificationResponse = (response: any) => {
      console.log(response, 'response');
    };

    useEffect(() => {
      notificationListener.current =
        Notifications.addNotificationReceivedListener(handleNotification);
      responseListener.current =
        Notifications.addNotificationResponseReceivedListener(
          handleNotificationResponse
        );
      return () => {
        Notifications.removeNotificationSubscription(
          notificationListener.current
        );

        Notifications.removeNotificationSubscription(responseListener.current);
      };
    }, [routeName]);
  }
  return {};
};

export function hidePushNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: false,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
}

export function unhidePushNotifications() {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
}
