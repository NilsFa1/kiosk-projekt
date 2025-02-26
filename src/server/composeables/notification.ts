import {createEventStream, EventStream, H3Event} from "h3";
import {NotificationMessage, Topic} from "../../models/notification";

type EventStreamRecords = Record<number, EventStream>

interface EventStreamConnectionResult {
  id: number;
  send: () => Promise<void>;
}

class NotificationManager {
  #eventStreams: EventStreamRecords = {};

  connect(event: H3Event): EventStreamConnectionResult {
    const eventStream = createEventStream(event);
    const eventStreamIdentifier = Math.random();
    this.#eventStreams[eventStreamIdentifier] = eventStream;
    eventStream.onClosed(async () => {
      delete this.#eventStreams[eventStreamIdentifier]
      await eventStream.close();
    })
    return {id: eventStreamIdentifier, send: () => eventStream.send()};
  }

  async push<T extends Topic>(notification: NotificationMessage<T>) {
    if (Object.keys(this.#eventStreams).length === 0) {
      return Promise.resolve();
    }
    return Promise.any(Object.values(this.#eventStreams).map(eventStream => eventStream.push(JSON.stringify(notification))));
  }
}

const notificationManager = new NotificationManager();

export function useNotificationManager() {
  return notificationManager;
}


