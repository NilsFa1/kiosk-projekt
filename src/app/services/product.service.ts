import {computed, effect, inject, Injectable, linkedSignal, resource} from '@angular/core';
import {FilterService} from "./filter.service";
import {SearchService} from "./search.service";
import {NotificationsService} from "./notifications.service";
import {usingFetch} from "./$HttpClient";

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  #filterService = inject(FilterService);
  #searchService = inject(SearchService);
  #notificationsService = inject(NotificationsService);
  #newProductNotification = this.#notificationsService.$subscribe('new_product');
  $fetch = usingFetch();

  #updateProductsEffect = effect(() => {
    const newProduct = this.#newProductNotification();
    if (newProduct) {
      this.$allProducts.update(notifications => [...(notifications ?? []), newProduct.message.product]);
    }
  })

  private productsRessource = resource({
    loader: async ({request}) => await this.$fetch('/v1/products')
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
