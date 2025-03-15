import {Pipe, PipeTransform} from '@angular/core';
import {NotificationMessage, Topic} from "../../../models/notification";
import {ApiProduct} from "../../../models/product";

const messages: Record<Topic, (arg: any) => string> = {
  new_product: (message: { product: ApiProduct }) => `Neues Produkt ${message.product.name} wurde hinzugefügt`,
  analyze_end: (_: {}) => `Analyse erfolgreich abgeschlossen`,
  product_update: (message: { product: ApiProduct }) => `Produkt ${message.product.name} wurde aktualisiert`
}

@Pipe({
  name: 'notificationText'
})
export class NotificationTextPipe implements PipeTransform {

  transform(notification: NotificationMessage<Topic>): string {
    return messages[notification.topic](notification.message);
  }

}
