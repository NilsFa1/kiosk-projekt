import {ChangeDetectionStrategy, Component, computed, inject, signal} from '@angular/core';
import {DynamicDialogRef} from "primeng/dynamicdialog";
import {MultiSelect} from "primeng/multiselect";
import {FormsModule} from "@angular/forms";
import {Button} from "primeng/button";
import {ProductService} from "../../app/services/product.service";
import {FilterService} from "../../app/services/filter.service";

@Component({
  selector: 'app-filter-settings',
  standalone: true,
  imports: [
    MultiSelect,
    FormsModule,
    Button
  ],
  templateUrl: './filter-settings.component.html',
  styleUrl: './filter-settings.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FilterSettingsComponent {
  public dialogRef = inject<DynamicDialogRef<FilterSettingsComponent>>(DynamicDialogRef)
  public productsService = inject(ProductService);
  public filterService = inject(FilterService);

  $options = computed(() => {
    const all = this.productsService.$allProducts()?.map(product => product.category)
    const unique = [...new Set(all)];
    return unique;
  })

  $selectedOptions = signal<string[]>(this.filterService.$selectedKategorien());

  onSave() {
    this.dialogRef.close(this.$selectedOptions());
  }

}
