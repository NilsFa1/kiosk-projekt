import {Injectable, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DrawerService {
  public $isVisible = signal(false);

  public toggle() {
    this.$isVisible.set(!this.$isVisible());
  }
}
