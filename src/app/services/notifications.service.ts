import {effect, inject, Injectable, PLATFORM_ID, Signal, signal, WritableSignal} from "@angular/core";
import {isPlatformBrowser} from "@angular/common";
import {NotificationMessage, Topic} from "../../models/notification";

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {
  #$notifications = signal<NotificationMessage<Topic> | undefined>(undefined)
  #topicNotifications = new Map<Topic, WritableSignal<NotificationMessage<Topic> | undefined>>();

  public $allNotifications = this.#$notifications;

  public $subscribe<T extends Topic>(topic: T): Signal<NotificationMessage<T> | undefined> {
    if (!this.#topicNotifications.has(topic)) {
      this.#topicNotifications.set(topic, signal<NotificationMessage<Topic> | undefined>(undefined));
    }

    return this.#topicNotifications.get(topic)! as Signal<NotificationMessage<T> | undefined>;
  }

  constructor() {
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      const eventSource = new EventSource('/api/v1/notifications')
      eventSource.onmessage = (e) => {
        const notification = JSON.parse(e.data) as NotificationMessage<Topic>;
        this.#$notifications.set(notification);
      };

      effect(() => {
        const lastNotification = this.#$notifications();
        if (lastNotification) {
          console.log(`New notification: ${lastNotification.topic}`);
          const topicNotifications = this.#topicNotifications.get(lastNotification.topic);
          topicNotifications?.set(lastNotification);
        }
      })
    }
  }
}
