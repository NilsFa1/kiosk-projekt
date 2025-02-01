import {Injectable, signal} from '@angular/core';
import {ApiProduct} from "../../models/product";

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  $selectedKategorien = signal<string[]>([]);

  public updateKategorien(kategorien: string[]) {
    this.$selectedKategorien.set(kategorien);
  }

  public filterWith(products: ApiProduct[], kategorien: string[]) {
    if (kategorien.length === 0) {
      return products;
    }
    return products.filter(product => kategorien.includes(product.category));
  }

  public filter(products: ApiProduct[]) {
    return this.filterWith(products, this.$selectedKategorien());
  }

}
