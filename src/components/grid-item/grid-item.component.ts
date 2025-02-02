import {ChangeDetectionStrategy, Component, input} from '@angular/core';
import {CurrencyPipe} from "@angular/common";
import {ApiProduct} from "../../models/product";

@Component({
  selector: 'grid-item',
  imports: [
    CurrencyPipe
  ],
  standalone: true,
  templateUrl: './grid-item.component.html',
  styleUrl: './grid-item.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GridItemComponent {
  public items = input<ApiProduct[]>([])
}
