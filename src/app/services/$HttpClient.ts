import {inject, Injectable} from "@angular/core";
import {HttpClient, HttpContext, HttpHeaders, HttpParams} from "@angular/common/http";
import {injectAPIPrefix} from "@analogjs/router/tokens";
import {firstValueFrom, Observable} from "rxjs";
import {InternalApi} from "nitropack/types";

type ApiRoutes = keyof InternalApi;
type ApiResponse<TPath extends ApiRoutes> = InternalApi[TPath]['default'];

export type HTTP_METHOD = 'GET' | 'POST'

type HTTP_Input_Payload<T extends HTTP_METHOD> = T extends 'GET' ? {
    params: { [key: string]: string } | HttpParams | undefined,
  }
  : T extends 'POST' ? { body: unknown }
    : never

export interface HTTP_Input<T extends HTTP_METHOD> {
  method: T;
  payload: HTTP_Input_Payload<T>
}

export function usingFetch() {
  const client = inject($HttpClient);

  function fetchTyped<TPath extends ApiRoutes, TMethod extends HTTP_METHOD = 'GET'>(path: TPath, input?: HTTP_Input<TMethod>, responseType: 'text' | 'json' = 'json'): Promise<ApiResponse<TPath>> {
    if (input == null || input.method === 'GET') {
      return firstValueFrom(client.get(path));
    }
    // @ts-ignore
    return firstValueFrom(client.post(path, input.payload.body, {responseType}));
  }

  return fetchTyped;
}

@Injectable({
  providedIn: 'root'
})
export class $HttpClient {
  #httpClient = inject(HttpClient);
  #apiPrefix = injectAPIPrefix();

  get<TPath extends ApiRoutes>(
    path: TPath,
    options?: {
      headers?: HttpHeaders | {
        [header: string]: string | string[];
      };
      context?: HttpContext;
      params?: HttpParams | {
        [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
      };
      reportProgress?: boolean;
      responseType?: 'json';
      withCredentials?: boolean;
      transferCache?: {
        includeHeaders?: string[];
      } | boolean;
    }
  ): Observable<ApiResponse<TPath>> {
    return this.#httpClient.get<ApiResponse<TPath>>(`${this.#apiPrefix}${path}`, options);
  }

  post<TPath extends ApiRoutes>(
    path: TPath,
    body: any,
    options?: {
      headers?: HttpHeaders | {
        [header: string]: string | string[];
      };
      context?: HttpContext;
      params?: HttpParams | {
        [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
      };
      reportProgress?: boolean;
      responseType?: 'json' | 'text';
      withCredentials?: boolean;
      transferCache?: {
        includeHeaders?: string[];
      } | boolean;
    }
  ): Observable<ApiResponse<TPath>> {
    // @ts-ignore
    return this.#httpClient.post<ApiResponse<TPath>>(`${this.#apiPrefix}${path}`, body, options);
  }
}
