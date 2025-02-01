import {ChangeDetectionStrategy, Component, inject, OnInit, PLATFORM_ID, signal} from '@angular/core';
import {MainToolbarComponent} from "../../components/layout/main-toolbar/main-toolbar.component";
import {RouterOutlet} from "@angular/router";
import {UserService} from "../services/user.service";
import {UiService} from "../services/ui.service";
import {ProductService} from "../services/product.service";
import {isPlatformBrowser} from "@angular/common";

@Component({
  selector: 'main-page',
  imports: [
    MainToolbarComponent,
    RouterOutlet
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if ($loaded()) {
      <main-toolbar></main-toolbar>
      <router-outlet></router-outlet>
    } @else {
      <div class="glass-container">
        <!-- Das Glas -->
        <div class="glass">
          <!-- Wasseranimation im Inneren des Glases -->
          <div class="water-animation">
            <!-- Mehrere, animierte Wellen -->
            <div class="wave wave1"></div>
            <div class="wave wave2"></div>
            <div class="wave wave3"></div>
          </div>

          <div class="water-splash">
            <div class="splash splash1"></div>
            <div class="splash splash2"></div>
            <div class="splash splash3"></div>
          </div>
        </div>
      </div>
    }
  `,
  styles: `
    .glass-container {
      position: fixed;
      top: 50%;
      left: 50%;
      width: 300px;
      height: 400px;
      transform: translate(-50%, -50%);
    }

    .glass {
      position: relative;
      width: 100%;
      height: 100%;
      border: 4px solid #fff;
      border-radius: 20px;
      box-shadow: 0 0 15px rgba(0, 0, 0, 0.5);
      overflow: hidden;
      background: rgba(255, 255, 255, 0.1);
    }

    .water-animation {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(to top, #0077be, #00aaff);
      animation: waterRise 2s ease-in-out forwards;
      z-index: 1;
    }

    @keyframes waterRise {
      0% {
        transform: translateY(100%);
      }
      100% {
        transform: translateY(0);
      }
    }

    .wave {
      position: absolute;
      left: 0;
      width: 200%;
      height: 50px;
      background-size: 50% 100%;
      background-repeat: repeat-x;
    }

    .wave1 {
      top: 0;
      background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23ffffff" fill-opacity="0.3" d="M0,192L80,186.7C160,181,320,171,480,154.7C640,139,800,117,960,117.3C1120,117,1280,139,1360,149.3L1440,160L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path></svg>') repeat-x;
      animation: waveMove 10s linear infinite;
    }

    .wave2 {
      top: 10px;
      background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23ffffff" fill-opacity="0.5" d="M0,192L80,186.7C160,181,320,171,480,154.7C640,139,800,117,960,117.3C1120,117,1280,139,1360,149.3L1440,160L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path></svg>') repeat-x;
      animation: waveMove 12s linear infinite reverse;
    }

    .wave3 {
      top: 20px;
      background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="%23ffffff" fill-opacity="0.7" d="M0,192L80,186.7C160,181,320,171,480,154.7C640,139,800,117,960,117.3C1120,117,1280,139,1360,149.3L1440,160L1440,0L1360,0C1280,0,1120,0,960,0C800,0,640,0,480,0C320,0,160,0,80,0L0,0Z"></path></svg>') repeat-x;
      animation: waveMove 8s linear infinite;
    }

    @keyframes waveMove {
      from {
        transform: translateX(0);
      }
      to {
        transform: translateX(-50%);
      }
    }

    .water-splash {
      position: absolute;
      top: -30px;
      left: 0;
      width: 100%;
      height: 50px;
      pointer-events: none;
      z-index: 2;
    }

    .splash {
      position: absolute;
      bottom: 0;
      width: 10px;
      height: 10px;
      background: #00aaff;
      border-radius: 50%;
      opacity: 0;
      animation: splash 0.5s ease-out forwards;
    }


    .splash1 {
      left: 15%;
      animation-delay: 2s;
    }

    .splash2 {
      left: 50%;
      animation-delay: 2.05s;
    }

    .splash3 {
      left: 85%;
      animation-delay: 2.1s;
    }

    @keyframes splash {
      0% {
        opacity: 0;
        transform: translateY(0) scale(0.8);
      }
      30% {
        opacity: 1;
        transform: translateY(-10px) scale(1);
      }
      60% {
        opacity: 1;
        transform: translateY(-20px) scale(1.1);
      }
      100% {
        opacity: 0;
        transform: translateY(-30px) scale(1.2);
      }
    }`
})
export default class MainPage implements OnInit {
  private userService = inject(UserService);
  private uiService = inject(UiService);
  private productService = inject(ProductService);
  private plattform = inject(PLATFORM_ID);

  public $loaded = signal<boolean>(false);

  ngOnInit() {
    //Produkte schonmal vorladen
    this.productService.reload();
    if (isPlatformBrowser(this.plattform)) {
      this.userService.checkToken();
      this.uiService.initFromStorage();
      setTimeout(() => this.$loaded.set(true), 1900);
    }
  }

}
