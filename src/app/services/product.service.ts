import {computed, effect, inject, Injectable, linkedSignal, resource, untracked} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {ApiProduct} from "../../models/product";
import {firstValueFrom} from "rxjs";
import {FilterService} from "./filter.service";
import {SearchService} from "./search.service";
import {NotificationsService} from "./notifications.service";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  #filterService = inject(FilterService);
  #searchService = inject(SearchService);
  #httpclient = inject(HttpClient);
  #notificationsService = inject(NotificationsService);
  #newProductNotification = this.#notificationsService.$subscribe('new_product');

  #updateProductsEffect = effect(() => {
    const newProduct = this.#newProductNotification();
    if (newProduct) {
      this.$allProducts.set([...(untracked(() => this.$allProducts()) ?? []), newProduct.message.product]);
    }
  })

  private productsRessource = resource({
    loader: async ({request}) => await firstValueFrom(this.#httpclient.get<ApiProduct[]>('/api/v1/products'))
  });

  public reload() {
    this.productsRessource.reload();
  }

  public $allProducts = linkedSignal(() => this.productsRessource.value());

  private $filteredProducts = computed(() => {
    return this.#filterService.filterWith(this.$allProducts() ?? [], this.#filterService.$selectedKategorien());
  });

  private $searchedProducts = computed(() => {
    return this.#searchService.searchWith(this.$filteredProducts() ?? [], this.#searchService.$searchword());
  })

  public $products = computed(() => this.$searchedProducts());
}
