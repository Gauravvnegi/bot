import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable, throwError as observableThrowError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { has, isBoolean } from 'lodash';

@Injectable({ providedIn: 'root' })
export class ApiService {
  // baseUrl = environment.base_url;

  constructor(
    protected httpClient: HttpClient,
    @Inject('BASE_URL') public baseUrl
  ) {}

  httpOptions = {
    headers: new HttpHeaders({}),
  };

  /**
   * Get Base Url
   * @param uri string
   */
  getBaseUrl(): any {
    return this.baseUrl;
  }

  /**
   * GET request
   */
  get(uri: string, config: any = {}): Observable<any> {
    let headers = this.httpOptions.headers;

    if (config?.headers) {
      Object.entries(config.headers).forEach(
        ([key, value]: [string, string]) => {
          headers = headers.set(key, value);
        }
      );
    }

    return this.httpClient
      .get(this.getBaseUrl() + uri, {
        ...config,
        headers,
      })
      .pipe(catchError(this.handleError));
  }

  // get(uri: string, config = {}): Observable<any> {
  //   return this.httpClient
  //     .get(this.getBaseUrl() + uri, config)
  //     .pipe(catchError(this.handleError));
  // }

  /**
   * PATCH request
   */
  patch(uri: string, data: any, config: any = {}): Observable<any> {
    // this.httpOptions.headers.append(
    //   'Content-Type',
    //   'application/json;charset=UTF-8'
    // );
    let headers = this.httpOptions.headers;

    if (config?.headers) {
      Object.entries(config.headers).forEach(
        ([key, value]: [string, string]) => {
          headers = headers.set(key, value);
        }
      );
    }
    return this.httpClient
      .patch(this.getBaseUrl() + uri, data, {
        ...config,
        headers,
      })
      .pipe(catchError((err) => this.handleError(err)));
  }

  /**
   * PUT request
   */
  put(uri: string, data: any): Observable<any> {
    // this.httpOptions.headers.append(
    //   'Content-Type',
    //   'application/json;charset=UTF-8'
    // );
    return this.httpClient
      .put(this.getBaseUrl() + uri, data, this.httpOptions)
      .pipe(catchError((err) => this.handleError(err)));
  }

  /**
   * POST request
   */
  post(uri: string, data: any, config: any = {}): Observable<any> {
    let headers = this.httpOptions.headers;

    if (config?.headers) {
      Object.entries(config.headers).forEach(
        ([key, value]: [string, string]) => {
          headers = headers.set(key, value);
        }
      );
    }

    // this.httpOptions.headers.append('oauth-token', '');
    return this.httpClient
      .post(this.getBaseUrl() + uri, data, { ...config, headers })
      .pipe(catchError((err) => this.handleError(err)));
  }

  /**
   * DELETE request
   */
  delete(uri: string): Observable<any> {
    // this.httpOptions.headers.append('oauth-token', '');
    return this.httpClient
      .delete(this.getBaseUrl() + uri, this.httpOptions)
      .pipe(catchError((err) => this.handleError(err)));
  }

  /**
   * UPLOAD document request
   */
  uploadDocument(uri: string, data: any): Observable<any> {
    // this.httpOptions.headers.append('Content-Type', 'multipart/form-data;');
    return this.httpClient
      .put(this.getBaseUrl() + uri, data, this.httpOptions)
      .pipe(catchError((err) => this.handleError(err)));
  }

  uploadDocumentPost(uri: string, data: any): Observable<any> {
    // this.httpOptions.headers.append('Content-Type', 'multipart/form-data;');
    return this.httpClient
      .post(this.getBaseUrl() + uri, data, this.httpOptions)
      .pipe(catchError((err) => this.handleError(err)));
  }

  /**
   * Handle general errors from the API
   *
   * @param err
   * @returns {ErrorObservable}
   */
  private handleError(err: any) {
    return observableThrowError(err);
  }

  getQueryParam(query?: Record<string, string | number>) {
    if (query) {
      return `?${Object.entries(query)
        .map(([key, value]) => `${key}=${value}`)
        .join('&')}`;
    }
    return '';
  }

  makeQueryParams(queries = [], callingMethod?) {
    if (!queries.length) {
      return;
    }
    const queryObj = queries.reduce((acc, curr) => {
      for (let key in curr) {
        // TO_DO: Readme
        let currValue = curr[key];
        if (currValue || isBoolean(currValue)) {
          if (has(acc, key)) {
            acc[key] = [acc[key], currValue].join(',');
          } else if (currValue !== null && currValue !== undefined) {
            acc[key] = currValue;
          }
        }
      }
      return { ...acc };
    }, {});

    let queryStr = '';

    queryStr = Object.keys(queryObj)
      .map((key) => `${key}=${queryObj[key]}`)
      .join('&');

    return `?${queryStr}`;
  }
}
