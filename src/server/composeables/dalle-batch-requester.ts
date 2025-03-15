import {AnalyzeResponse} from "../../models/Benutzer";
import OpenAI from "openai";
import {Product} from "../../models/product";
import {useProgressManager} from "./progress";
import {useNotificationManager} from "./notification";
import {BehaviorSubject, debounceTime, skip} from "rxjs";

async function createImageProduct(p: AnalyzeResponse['products'][0], openai: OpenAI) {
  const prompt = `A realistic image of a ${p.name}. The product is well-lit with a neutral background, detailed and sharp, emphasizing its design and features. A typical ImageDescription of the Product is ${p.imageDescription}. The product should be displayed prominently in the middle to ensure visibility even when cropped to a 200x300 format.`;
  const imageGenerationResult = await openai.images.generate({
    model: "dall-e-3",
    prompt: prompt,
    size: "1024x1024",
    quality: "standard",
    n: 1,
  })

  const imageUrl = imageGenerationResult.data.at(0)?.url;
  const imageBlob = await downloadImageAsBlob(imageUrl ?? '');

  return {
    name: p.name,
    price: p.price,
    category: p.category,
    description: p.description,
    image: imageBlob,
    active: false
  } as Product
}

async function downloadImageAsBlob(imageUrl: string): Promise<Blob> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return await response.blob();
  } catch (error) {
    console.error("Error downloading image:", error);
    throw error;
  }
}


class DalleBatchRequester {
  private activeRequests = new BehaviorSubject<number>(0);
  private activeQueue$ = new BehaviorSubject<(() => Promise<void>) | undefined>(undefined);
  private waitingQueue$ = new BehaviorSubject<(() => Promise<void>)[]>([]);
  private maxRequestsPerMinute = 5;
  private progressManager = useProgressManager();

  private analyzeEnd$$ = this.activeRequests.pipe(
    skip(1),
    debounceTime(2000),
  ).subscribe(async (requests) => {
    if (requests === 0) {
      await useNotificationManager().push({
        topic: 'analyze_end',
        id: Math.random(),
        message: {}
      })
    }
  })

  private processWatiningQueue$$ = this.waitingQueue$.subscribe(async (requests) => {
    if (requests.length === 0) {
      return;
    }

    if (this.activeRequests.value < this.maxRequestsPerMinute) {
      const nextReq = requests.shift();
      this.activeRequests.next(this.activeRequests.value + 1);
      this.activeQueue$.next(nextReq);
      this.waitingQueue$.next(requests);
    }
  })

  private processActiveQueue$$ = this.activeQueue$.subscribe(async (request) => {
    if (request == undefined) {
      return
    }
    await this.pushProgress()
    await request()
    this.activeRequests.next(this.activeRequests.value - 1)
    await this.pushProgress()

    this.waitingQueue$.next(this.waitingQueue$.value);
  })

  constructor(private dalleCall: typeof createImageProduct) {
  }

  private addRequestToQueue(request: () => Promise<void>) {
    this.waitingQueue$.next([...this.waitingQueue$.value, request]);
  }

  async addRequest(product: Parameters<typeof createImageProduct>[0], openai: Parameters<typeof createImageProduct>[1]): ReturnType<typeof createImageProduct> {
    return new Promise((resolve, reject) => {
      const request = async () => {
        try {
          const result = await this.dalleCall(product, openai);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      };

      this.addRequestToQueue(request);
    });
  }

  private async pushProgress() {
    await this.progressManager.push({
      activeCount: this.activeRequests.value,
      totalCount: this.activeRequests.value + this.waitingQueue$.value.length,
      waitingCount: this.waitingQueue$.value.length,
      id: Math.random()
    });
  }
}

const dalleRequestBatcher = new DalleBatchRequester(createImageProduct);

export function useDalleRequestBatcher() {
  return dalleRequestBatcher;
}
