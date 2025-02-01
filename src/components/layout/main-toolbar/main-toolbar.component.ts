import {Component, inject} from '@angular/core';
import {DrawerService} from "../../../app/services/drawer.service";
import {DialogService} from "primeng/dynamicdialog";
import {UserService} from "../../../app/services/user.service";
import {UiService} from "../../../app/services/ui.service";
import {Router} from "@angular/router";
import {LoginComponent} from "../../login/login.component";
import {MenuItem} from "primeng/api";
import {Drawer} from "primeng/drawer";
import {Menu} from "primeng/menu";
import {Button} from "primeng/button";
import {ToggleSwitch} from "primeng/toggleswitch";
import {FormsModule} from "@angular/forms";
import {Toolbar} from "primeng/toolbar";

@Component({
  selector: 'main-toolbar',
  imports: [
    Drawer,
    Menu,
    Button,
    ToggleSwitch,
    FormsModule,
    Toolbar
  ],
  standalone: true,
  templateUrl: './main-toolbar.component.html',
  styleUrl: './main-toolbar.component.css',
  providers: [DialogService]
})
export class MainToolbarComponent {
  public drawerService = inject(DrawerService)
  public dialogService = inject(DialogService)
  public userService = inject(UserService)
  public uiService = inject(UiService)
  public router = inject(Router)

  login() {
    this.dialogService.open(LoginComponent, {
      header: 'Login',
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
    });
  }

  logout() {
    this.userService.logOut();
  }

  public items: MenuItem[] = [
    {
      label: 'Übersicht',
      command: () => this.drawerNavigate(['/'])
    },
    {
      label: 'Katalog-Import',
      command: () => this.drawerNavigate(['/katalog-import'])
    }
  ];

  drawerNavigate(path: string[]) {
    this.router.navigate(path);
    this.drawerService.toggle();
  }
}
