import {BenutzerSmall} from "./models/Benutzer";

declare module '*.analog' {
  import {Type} from '@angular/core';

  const cmp: Type<unknown>;
  export default cmp;
}

declare module '*.ag' {
  import {Type} from '@angular/core';

  const cmp: Type<unknown>;
  export default cmp;
}

declare module 'h3' {
  interface H3EventContext {
    user?: BenutzerSmall;
  }
}
