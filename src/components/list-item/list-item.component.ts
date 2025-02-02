import {Component, input} from '@angular/core';
import {ApiProduct} from "../../models/product";
import {Divider} from "primeng/divider";
import {CurrencyPipe} from "@angular/common";

@Component({
  selector: 'app-list-item',
  imports: [
    Divider,
    CurrencyPipe
  ],
  standalone: true,
  templateUrl: './list-item.component.html',
  styleUrl: './list-item.component.css'
})
export class ListItemComponent {
  public items = input<ApiProduct[]>([])
}
