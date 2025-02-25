import {
  effect,
  EffectRef,
  inject,
  Injectable,
  Injector,
  NgZone,
  PLATFORM_ID,
  signal,
  WritableSignal
} from '@angular/core';
import {DOCUMENT, isPlatformBrowser} from "@angular/common";
import {debounceTime, defer, fromEvent, map, of, startWith} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UiService {
  public $darkMode = signal(true);
  public $viewMode: WritableSignal<'list' | 'grid'> = signal('list');

  public platform = inject(PLATFORM_ID);
  private doc = inject(DOCUMENT)
  private injector = inject(Injector);
  private ngZone = inject(NgZone);

  private screenSize$ = this.ngZone.runOutsideAngular(() => defer(() => {
    if (isPlatformBrowser(this.platform)) {
      return fromEvent(window, 'resize').pipe(
        debounceTime(200),
        startWith({width: window.innerWidth, height: window.innerHeight}),
        map(() => ({
          width: window.innerWidth,
          height: window.innerHeight
        }))
      );
    } else {
      return of({width: 0, height: 0});
    }
  }));

  public isMobile$ = this.screenSize$.pipe(
    map(size => size.width < 768)
  );

  private isMobileSubsc = this.ngZone.runOutsideAngular(() => this.isMobile$.subscribe(isMobile => {
    if (isMobile) {
      this.$viewMode.set('grid');
    }
  }))

  private $setDarkModeEffect: EffectRef | undefined;
  private $setViewModeEffect: EffectRef | undefined;

  constructor() {
    if (!isPlatformBrowser(this.platform)) {
      return;
    }
    const darkMode = localStorage.getItem('darkMode');
    if (darkMode) {
      this.$darkMode.set(darkMode === 'true');
    }
    const viewMode = localStorage.getItem('viewMode');
    if (viewMode) {
      this.$viewMode.set(viewMode as 'list' | 'grid');
    }

    this.$setViewModeEffect = effect(() => {
      if (isPlatformBrowser(this.platform)) {
        localStorage.setItem('viewMode', this.$viewMode());
      }
    }, {injector: this.injector});

    this.$setDarkModeEffect = effect(() => {

      if (this.doc == null) {
        return;
      }

      if (this.$darkMode()) {
        this.doc.querySelector('html')?.classList.add('my-app-dark');
      } else {
        this.doc.querySelector('html')?.classList.remove('my-app-dark');
      }

      if (isPlatformBrowser(this.platform)) {
        localStorage.setItem('darkMode', this.$darkMode() ? 'true' : 'false');
      }
    }, {injector: this.injector})
  }

}
