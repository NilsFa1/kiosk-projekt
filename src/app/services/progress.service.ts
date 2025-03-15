import {computed, effect, inject, Injectable, PLATFORM_ID, signal} from '@angular/core';
import {isPlatformBrowser} from "@angular/common";
import {ProgressMessage} from "../../models/progress";

@Injectable({
  providedIn: 'root'
})
export class ProgressService {

  $progress = signal<ProgressMessage>({waitingCount: 0, activeCount: 0, totalCount: 0, id: 0});
  $isProgressActive = computed(() => this.$progress().activeCount > 0 || this.$progress().waitingCount > 0);

  constructor() {
    if (isPlatformBrowser(inject(PLATFORM_ID))) {
      const eventSource = new EventSource('/api/v1/progress')
      eventSource.onmessage = (e) => {
        const progress = JSON.parse(e.data) as ProgressMessage;
        this.$progress.set(progress);
      };

      effect(() => {
        const newProgress = this.$progress();
        if (newProgress) {
          console.log(`New Progress: ${JSON.stringify(newProgress)}`);
        }
      })
    }
  }
}
