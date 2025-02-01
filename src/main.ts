import 'zone.js';
import {bootstrapApplication} from '@angular/platform-browser';

import {App} from './app/app-root.component';
import {appConfig} from './app/app.config';

bootstrapApplication(App, appConfig);
