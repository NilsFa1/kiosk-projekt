import {createEventStream, EventStream, H3Event} from "h3";
import {ProgressMessage} from "../../models/progress";

interface EventStreamConnectionResult {
  id: number;
  send: () => Promise<void>;
}

type EventStreamRecords = Record<number, EventStream>

class ProgressManager {
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

  async push(progressMessage: ProgressMessage) {
    if (Object.keys(this.#eventStreams).length === 0) {
      return Promise.resolve();
    }
    return Promise.any(Object.values(this.#eventStreams).map(eventStream => eventStream.push(JSON.stringify(progressMessage))));
  }
}

const progressManager = new ProgressManager();

export function useProgressManager() {
  return progressManager;
}
