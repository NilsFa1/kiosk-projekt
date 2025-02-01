import {ChangeDetectionStrategy, Component} from '@angular/core';
import {KatalogImportFormComponent} from "./katalog-import-form/katalog-import-form.component";

@Component({
  selector: 'katalog-import-wrapper',
  standalone: true,
  templateUrl: './katalog-import-wrapper.component.html',
  imports: [
    KatalogImportFormComponent
  ],
  styleUrl: './katalog-import-wrapper.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class KatalogImportWrapperComponent {

}
