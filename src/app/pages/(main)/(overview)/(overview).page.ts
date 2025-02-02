import {ChangeDetectionStrategy, Component, inject} from '@angular/core';
import {ProductService} from "../../../services/product.service";
import {UserService} from "../../../services/user.service";
import {DialogService, DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {FilterService} from "../../../services/filter.service";
import {SearchService} from "../../../services/search.service";
import {UiService} from "../../../services/ui.service";
import {map, startWith} from "rxjs";
import {FilterSettingsComponent} from "../../../../components/filter-settings/filter-settings.component";
import {AsyncPipe, CurrencyPipe} from "@angular/common";
import {Divider} from "primeng/divider";
import {SelectButton} from "primeng/selectbutton";
import {FormsModule} from "@angular/forms";
import {Button} from "primeng/button";
import {Chip} from "primeng/chip";
import {InputGroupAddon} from "primeng/inputgroupaddon";
import {InputGroup} from "primeng/inputgroup";
import {DataView} from "primeng/dataview";
import {InputText} from "primeng/inputtext";
import {FloatLabel} from "primeng/floatlabel";
import {GridItemComponent} from "../../../../components/grid-item/grid-item.component";
import {ListItemComponent} from "../../../../components/list-item/list-item.component";

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [
    CurrencyPipe,
    Divider,
    SelectButton,
    FormsModule,
    Button,
    Chip,
    InputGroupAddon,
    InputGroup,
    DataView,
    AsyncPipe,
    InputText,
    FloatLabel,
    GridItemComponent,
    GridItemComponent,
    ListItemComponent
  ],
  templateUrl: './(overview).page.html',
  styleUrl: './(overview).page.css',
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export default class OverviewPage {
  public $products = inject(ProductService).$products;

  public userService = inject(UserService)
  public dialogService = inject(DialogService)
  public filterService = inject(FilterService)
  public searchService = inject(SearchService)
  public uiService = inject(UiService)

  public layoutOptions$ = this.uiService.isMobile$.pipe(
    map((mobile) => {
      if (mobile) {
        return ['grid']
      }
      return ['list', 'grid']
    }),
    startWith(['list', 'grid'])
  )

  public dialogRef: DynamicDialogRef | undefined;

  show() {
    const config: DynamicDialogConfig<FilterSettingsComponent> = {
      header: 'Filtern',
      width: '50vw',
      modal: true,
      focusOnShow: false,
      closable: true,
      maximizable: false,
      breakpoints: {
        '960px': '75vw',
        '640px': '100vw'
      },
      height: '420px'
    }
    this.dialogRef = this.dialogService.open(FilterSettingsComponent, config);

    this.dialogRef.onClose.subscribe((kategorien: string[]) => {
      if (!kategorien) {
        return;
      }
      this.filterService.updateKategorien(kategorien)
    });

  }

  removeKategorie(kategorie: string, event: Event) {
    event.stopImmediatePropagation();
    event.preventDefault();
    this.filterService.updateKategorien(this.filterService.$selectedKategorien().filter(k => k !== kategorie))
  }
}
