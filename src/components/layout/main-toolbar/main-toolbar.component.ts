import {ChangeDetectionStrategy, Component, computed, effect, inject, signal, untracked} from '@angular/core';
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
import {Popover} from "primeng/popover";
import {NotificationsService} from "../../../app/services/notifications.service";
import {NotificationMessage, Topic} from "../../../models/notification";
import {ApiProduct} from "../../../models/product";
import {OverlayBadge} from "primeng/overlaybadge";

@Component({
  selector: 'main-toolbar',
  imports: [
    Drawer,
    Menu,
    Button,
    ToggleSwitch,
    FormsModule,
    Toolbar,
    Popover,
    OverlayBadge
  ],
  standalone: true,
  templateUrl: './main-toolbar.component.html',
  styleUrl: './main-toolbar.component.css',
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MainToolbarComponent {
  public drawerService = inject(DrawerService)
  public dialogService = inject(DialogService)
  public userService = inject(UserService)
  public uiService = inject(UiService)
  public router = inject(Router)
  public $newnotifications = inject(NotificationsService).$allNotifications;

  #newNotificationEffect = effect(() => {
    const newNotification = this.$newnotifications();
    if (newNotification) {
      this.$notifications.set([...untracked(() => this.$notifications()), {
        seen: false,
        notification: newNotification
      }]);
    }
  })

  public $notifications = signal<{ seen: boolean, notification: NotificationMessage<Topic> }[]>([])
  public $newNotificationsCount = computed(() => this.$notifications().filter(n => !n.seen).length)

  gelesen(id: number) {
    this.$notifications.set(this.$notifications().map(n => n.notification.id === id ? {
      seen: true,
      notification: n.notification
    } : n))
  }

  add() {
    this.$notifications.set([{
      seen: false,
      notification: {
        id: Math.random(),
        topic: 'product_update',
        message: {product: {id: 1, name: 'Test'} as ApiProduct}
      }
    }])
  }

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
