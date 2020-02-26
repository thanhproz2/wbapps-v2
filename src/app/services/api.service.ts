import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpParams } from '@angular/common/http';
import { RequestOptions, Http, Headers } from '@angular/http';
import { AuthenticateService } from './authenticate.service';
// import 'rxjs/add/operator/toPromise';
import { SessionData } from '../models/session.data.model';
import { ApiResult } from '../models/api.result.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ApiService {

  private _sessionData: SessionData;
  constructor(private _http: Http, private _authenticateService: AuthenticateService,
    private route: ActivatedRoute,
    private router: Router,
    private _httpClient: HttpClient) {
    this._authenticateService.getSessionData().subscribe(o => { this._sessionData = o });
  }

  httpPost(url: string, model: any, myParams?: any, addToken: boolean = true): Promise<ApiResult> {
    var options = this.createHeaderToken(addToken, true);
    options.params = myParams;
    return this._http.post(url, JSON.stringify(model), options).toPromise().then((response: any) => {
      return response as ApiResult;
    }).catch((reason: any) => {
      if (reason.status == 401) {
        this._authenticateService.clearSessionData();
        location.reload();
        // this.router.navigate(['/login']);
      }
      if (reason.status == 403){
        this.router.navigate(['']);
      }
      return Promise.reject(reason as ApiResult);
    });
  }

  httpGet(url: string, myParams?: any, addToken: boolean = true ): Promise<ApiResult> {
    var options = this.createHeaderToken(addToken, true);
    options.params = myParams;
    return this._http.get(url, options).toPromise().then((response: any) => {
      return response.json();
    }).catch((reason: any) => {
      if (reason.status == 401) {
        this._authenticateService.clearSessionData();
        location.reload();
        // this.router.navigate(['/login']);
      }
      if (reason.status == 403){
        this.router.navigate(['']);
      }
      if (reason.status == 400){
        return reason;
      }
      return Promise.reject(reason as ApiResult);
    });
  }

  get(url: string, params?: any): Observable<any> {
    var options = this.createHeaderToken(true, true);
    options.params = params;
    return this._http.get(url, options).pipe(catchError(this.formatErrors));
  }

  _httpGet(url: string, params?): Observable<ApiResult> {
    const httpHeaders = this.getHTTPHeaders();
    return this._httpClient.get<ApiResult>(url, {
      headers: httpHeaders,
      params: params ? new HttpParams({ fromObject: params }) : new HttpParams()
    });
  }

  _httpPost(url, body): Observable<ApiResult> {
    const httpHeaders = this.getHTTPHeaders();
    return this._httpClient.post<ApiResult>(url, body, {
      headers: httpHeaders
    });
  }

  _httpDelete(url: string): Observable<ApiResult> {
    const httpHeaders = this.getHTTPHeaders();
    return this._httpClient.delete<ApiResult>(url, { headers: httpHeaders });
  }

  _httpPut(url, body): Observable<ApiResult> {
    const httpHeaders = this.getHTTPHeaders();
    return this._httpClient.put<ApiResult>(url, body, {
      headers: httpHeaders
    });
  }

  private formatErrors(error: any) {
    return  throwError(error.error);
  }

  httpPut(url, model, addToken: boolean = true): Promise<ApiResult> {
    return this._http.put(url, JSON.stringify(model), this.createHeaderToken(addToken, true)).toPromise().then((response: any) => {
      return response as ApiResult;
    }).catch((reason: any) => {
      if (reason.status == 401) {
        this._authenticateService.clearSessionData();
        location.reload();
        // this.router.navigate(['/login']);
      }
      if (reason.status == 403){
        this.router.navigate(['']);
      }
      return Promise.reject(reason as ApiResult);
    });
  }
  httpDelete(url: string, body?: any, addToken: boolean = true): Promise<ApiResult> {
    var option = this.createHeaderToken(addToken, true);
    option.body = body;
    return this._http.delete(url, option).toPromise().then((response: any) => {
      return response as ApiResult;
    }).catch((reason: any) => {
      if (reason.status == 401) {
        this._authenticateService.clearSessionData();
        location.reload();
        // this.router.navigate(['/login']);
      }
      if (reason.status == 403){
        this.router.navigate(['']);
      }
      return Promise.reject(reason as ApiResult);
    });
  }

  createHeaderToken(addToken: boolean, addOnBehalfToken: boolean = false): RequestOptions {
    var headers = new Headers({ timeout: 2000 });
    headers.append('Content-Type', 'application/vnd.blackbox.v1+json');

    if (addToken && this._sessionData != null && this._sessionData.token != null) {
      headers.append('token', this._sessionData.token);
    }

    return new RequestOptions({ headers: headers });
  }

  getHTTPHeaders(): HttpHeaders {
    const result = new HttpHeaders({
      'Content-Type': 'application/vnd.blackbox.v1+json',
      'token': localStorage.getItem('token')
    });
    return result;
  }

}
