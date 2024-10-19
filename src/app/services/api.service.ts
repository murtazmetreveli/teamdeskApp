import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, of, retry, Subject, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  logdata: any;
  httpOptions = {}
  imageOptions = {}
  httpMarkOption = {}
  authData: any;
  public netWorkOn: Subject<boolean> = new Subject()
  public notificationRedirect: Subject<boolean> = new Subject()
  constructor(
    private http: HttpClient,
   
  ) {


  }
  getUserDetail(email: string, password: string) {
    return this.http.get(`${environment.baseURL}/user.json`, { headers: { Authorization: `Basic ` + btoa(`${email}:${password}`) } });
  }
  getAuthToken() {
    return localStorage.getItem("chunk") || '';
  }
  getLoginData() {
    return JSON.parse(localStorage.getItem("auth") || '{}');
  }
  httpOption() {
    this.logdata = this.getAuthToken();
    this.httpOptions = {
      headers: new HttpHeaders({
        // 'Content-Type': 'application/json',
        'access-control-allow-origin': 'https://app.mrmccouriers.com',
        'Authorization': `Basic` + ' ' + this.logdata,
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
      })
    }
  }

  postCollection(data: any): Observable<any> {
    try {
      this.httpOption();
      this.authData = this.getAuthToken();
      if (!this.authData) {
        throw new Error('Log data is missing');
      }
      let form_data: any = new FormData();
      for (var key in data) {
        form_data.append(key, data[key]);
      }
      for (var pair of form_data.entries()) {
      }
      return this.http
        .post<any>(
          environment.baseURL + '/Collection/create.json',
          form_data,
          this.httpOptions
        )
        .pipe(catchError(this.handleError));
    } catch (error) {
      console.error('Error in synchronous code:', error);
      return throwError(error.message);
    }
  }

  handleError(error: any) {

    this.logdata = this.getAuthToken();
    let errorMessage = '';
    if (error.status == 0) {
      errorMessage = error.message
    } else {
      errorMessage = error.message
    }
    if (this.logdata) {
      window.alert(errorMessage);
    }
    return throwError(() => {
      return errorMessage;
    });
  }
  markLocation(data: any) {
    this.httpMarkOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    return this.http
      .post<any>(
        'https://zeorouteplanner.com/api/v6/route_location_progress/mark_status',
        JSON.stringify(data),
        this.httpMarkOption,
      )
      .pipe(retry(1), catchError(this.handleError));
  }
  getCollectionView(id: any) {
    this.httpOption();
    return this.http.get(`${environment.baseURL}/Collection/retrieve.json?id=${id}`, this.httpOptions);
  }
  getLocationPractice(id: number) {
    this.httpOption();
    return this.http.get(`${environment.baseURL}/Practices/retrieve.json?id=${id}`, this.httpOptions);
  }

  getTodayCollection(params: any) {
    this.httpOption();
    return this.http.get(`${environment.baseURL}/Collection/List%20All/select.json?filter=%20Between(ToDate(%5BDate%2FTime%20Collected%5D)%2C%20%23${params.dateFrom}%23%2C%20%23${params.dateTo}%23)`, this.httpOptions).pipe(retry(1), catchError(error => this.handleError(error)));
  }
  imageOption() {
    this.logdata = this.getAuthToken();
    this.imageOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'multipart/related',
        'access-control-allow-origin': 'https://app.mrmccouriers.com',
        'Authorization': `Basic` + ' ' + this.logdata,
      })
    }
  }
  getAttachment() {
    this.httpOption();
    return this.http.get(`${environment.baseURL}/Collection/describe.json`, this.httpOptions);
  }
  getPhotoAttachment(id: any) {
    this.httpOption();
    return this.http.get(`${environment.baseURL}/Collection/Photo/attachments.json?id = ${id}`, this.httpOptions);
  }
  dropOffCollection(data: any): Observable<any> {
    this.httpOption();
    this.authData = this.getAuthToken();
    if (!this.authData) {
      throw new Error('Log data is missing');
    }
    let form_data: any = new FormData();
    for (var key in data) {
      form_data.append(key, data[key]);
    }
    for (var pair of form_data.entries()) {
    }
    return this.http
      .post<any>(
        environment.baseURL + '/Drop-Off/create.json',
        form_data,
        this.httpOptions,
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  sendTokenToDb(data: any): Observable<any> {
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    return this.http
      .post<any>(
        'https://couriercontrol.app/php-test-api/insert.php',
        data,
        header
      )
      .pipe(retry(1), catchError(this.handleError));
  }
  sendStatus(data: any): Observable<any> {
    const header = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    return this.http
      .post<any>(
        'https://couriercontrol.app/php-test-api/update.php',
        data,
        header
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  showNotification() {
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/json')
      .set('Pragma', 'no-cache');
    const options = {
      headers: headers,
      timeout: 100 // Adjust timeout as needed
    };
    return this.http.get(`https://couriercontrol.app/php-test-api/getNotification.php`, options)
      .pipe(
        retry(1),
        catchError(error => this.handleError(error))
      );
  }
  postRouteComplete(data: any) {
    try {
      this.httpOption();
      this.authData = this.getAuthToken();
      if (!this.authData) {
        throw new Error('Log data is missing');
      }

      let form_data: any = new FormData();
      for (var key in data) {
        form_data.append(key, data[key]);
      }
      for (var pair of form_data.entries()) {
      }
      return this.http
        .post<any>(
          environment.baseURL + '/Route%20Log/create.json',
          form_data,
          this.httpOptions
        )
        .pipe(catchError(this.handleError));
    } catch (error) {
      console.error('Error in synchronous code:', error);
      return throwError(error.message);
    }
  }
  getDropOffCollection(params: any) {
    return this.http.get(`${environment.baseURL}/Drop-Off/Default%20View/select.json?filter=Between(ToDate(%5BDate%2FTime%5D)%2C%23${params.dateFrom}%23%2C%23${params.dateTo}%23)`, this.httpOptions).pipe(retry(1), catchError(error => this.handleError(error)));

  }
  getDropOffAttachment() {
    this.httpOption();
    return this.http.get(`${environment.baseURL}/Drop-Off/describe.json`, this.httpOptions);
  }
}
