import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError as observableThrowError, Observable } from 'rxjs';

@Injectable()
export class ApiService {
  baseUrl = 'https://api.botshot.in:8443';

  constructor(protected httpClient: HttpClient) {}

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
  get(uri: string): any {
    return this.httpClient
      .get(this.getBaseUrl() + uri)
      .pipe(catchError(this.handleError));
  }

  /**
   * PATCH request
   */
  patch(uri: string, data: any): Observable<any> {
    this.httpOptions.headers.append(
      'Content-Type',
      'application/json;charset=UTF-8'
    );
    return this.httpClient
      .patch(this.getBaseUrl() + uri, data, this.httpOptions)
      .pipe(catchError((err) => this.handleError(err)));
  }

  /**
   * PUT request
   */
  put(uri: string, data: any): Observable<any> {
    this.httpOptions.headers.append(
      'Content-Type',
      'application/json;charset=UTF-8'
    );
    return this.httpClient
      .put(this.getBaseUrl() + uri, data, this.httpOptions)
      .pipe(catchError((err) => this.handleError(err)));
  }

  /**
   * POST request
   */
  post(uri: string, data: any): Observable<any> {
    this.httpOptions.headers.append('oauth-token', '');
    return this.httpClient
      .post(this.getBaseUrl() + uri, data, this.httpOptions)
      .pipe(catchError((err) => this.handleError(err)));
  }

  /**
   * DELETE request
   */
  delete(uri: string): Observable<any> {
    this.httpOptions.headers.append('oauth-token', '');
    return this.httpClient
      .delete(this.getBaseUrl() + uri, this.httpOptions)
      .pipe(catchError((err) => this.handleError(err)));
  }

  /**
   * UPLOAD document request
   */
  uploadDocument(uri: string, data: any): Observable<any> {
    this.httpOptions.headers.append('Content-Type', 'multipart/form-data;');
    return this.httpClient
      .put(this.getBaseUrl() + uri, data, this.httpOptions)
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
}
