import {ApiProduct} from "./product";

export type Topic = 'product_update' | 'new_product' | 'analyze_end'

type NotificationType<T extends Topic> = T extends 'product_update' ? { product: ApiProduct }
  : T extends 'new_product' ? { product: ApiProduct }
    : T extends 'analyze_end' ? {}
      : never

export interface NotificationMessage<T extends Topic> {
  topic: T;
  id: number;
  message: NotificationType<T>
}
