import {Injectable, signal} from '@angular/core';
import {ApiProduct, Product} from "../../models/product";

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  $searchword = signal<string>('');

  public updateSearchword(searchword: string) {
    this.$searchword.set(searchword)
  }

  public searchWith(products: ApiProduct[], searchword: string) {
    if (this.$searchword().length === 0) {
      return products;
    }
    const pieces = products.map(product => ({
      product,
      searchText: [product.name, product.description, product.category].join(' ').toLowerCase().split(' ')
    }));

    return pieces.filter(product =>
      product.searchText.some(text => text.includes(this.$searchword().toLowerCase())))
      .map(product => product.product);
  }

  public search(products: Product[]) {
    return this.searchWith(products, this.$searchword());
  }
}
