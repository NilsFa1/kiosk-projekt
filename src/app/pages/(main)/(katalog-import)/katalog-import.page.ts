import {Component, inject} from '@angular/core';
import {
  KatalogImportWrapperComponent
} from "../../../../components/katalog-import-wrapper/katalog-import-wrapper.component";
import {RouteMeta} from "@analogjs/router";
import {UserService} from "../../../services/user.service";
import {Router} from "@angular/router";

export const routeMeta: RouteMeta = {
  canActivate: [
    () => {
      const userService = inject(UserService);
      const router = inject(Router);
      if (userService.$loggedIn()) {
        return true;
      }
      router.navigate(['/']);
      return false;
    }
  ]
};

@Component({
  selector: 'katalog-import',
  imports: [
    KatalogImportWrapperComponent
  ],
  standalone: true,
  templateUrl: './katalog-import.page.html',
  styleUrl: './katalog-import.page.css'
})
export default class KatalogImportPage {

}
