import { Injectable } from '@angular/core'
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders
} from '@angular/common/http'
import { URI } from 'src/app/common/url'
import { catchError, map } from 'rxjs/operators'
import { BehaviorSubject, Observable, of, Subject, throwError } from 'rxjs'
import { Router } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class UserService {
  public currentUserSubject: BehaviorSubject<any>
  public currentUser: Observable<any>
  token: any

  constructor (private http: HttpClient, private router: Router) {
    this.currentUserSubject = new BehaviorSubject<any>(
      sessionStorage.getItem('currentUser')
    )
    this.currentUser = this.currentUserSubject.asObservable()
  }
  public get currentUserValue (): any {
    return this.currentUserSubject.value
  }

  registeration (model: any): Observable<any> {
    return this.http.post<any>(URI.signup, model)
  }
  getToken (): string {
    let ca: Array<string> = document.cookie.split(';')
    let caLen: number = ca.length
    let cookieName = 'token'
    let c: string

    for (let i: number = 0; i < caLen; i += 1) {
      c = ca[i].replace(/^\s+/g, '')
      if (c.indexOf(cookieName) == 0) {
        const tt = c.substring(cookieName.length, c.length)

        return tt
      }
    }
    return ''
  }

  private setReqHeader (response: any) {
    if (response && response.headers) {
      var token = response.headers.get('x-auth-token')

      if (token) {
        document.cookie = 'token' + token
      }
    }
  }

  verifyEmail (model: any): Observable<any> {
    return this.http.post<any>(URI.verifyEmail, model)
  }
  resendOtp (model: any): Observable<any> {
    return this.http.post<any>(URI.resentOtp, model)
  }

 

  loginUser (model: any): Observable<any> {
    return this.http
      .post<any>(URI.login, model, {
        observe: 'response'
      })
      .pipe(
        map(user => {
          //  ;
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          var obj: any = user
          if (obj.body && obj.body.status_code == 1) {
            this.setReqHeader(obj)
            sessionStorage.setItem(
              'currentUser',
              JSON.stringify(obj.body.result[0])
            )
            this.currentUserSubject.next(JSON.stringify(obj.body.result[0]))
            return user
          } else {
            return user
          }
        }),
        catchError(this.errorHandler)
      )
  }

  errorHandler (error: HttpErrorResponse) {
    return throwError(error || 'Server error')
  }
  logout(){
    sessionStorage.removeItem('currentUser');
    this.currentUserSubject.next(null)
  }
  updateProfile (id: any, formdata: FormData): Observable<any> {
    return this.http.patch(URI.updateProfile + id, formdata)
  }
  getProfile (): Observable<any> {
    return this.http.get<any>(URI.getProfile)
  }
  getSkills (): Observable<any> {
    return this.http.get<any>(URI.getSkills)
  }

  socialLogin (model: any): Observable<any> {
    // return this.http.post(URI.socialLogin, model)
    return this.http
      .post<any>(URI.socialLogin, model, {
        observe: 'response'
      })
      .pipe(
        map(user => {
          //  ;
          // store user details and jwt token in local storage to keep user logged in between page refreshes
          var obj: any = user
          if (obj.body && obj.body.status_code == 1) {
            this.setReqHeader(obj)
            sessionStorage.setItem(
              'currentUser',
              JSON.stringify(obj.body.result[0])
            )
            this.currentUserSubject.next(JSON.stringify(obj.body.result[0]))
            return user
          } else {
            return user
          }
        }),
        catchError(this.errorHandler)
      )
  }

  forgetPassword (model: any): Observable<any> {
    return this.http.post(URI.forgetPassword, model)
  }
  changePassword (model: any, id: any): Observable<any> {
    return this.http.patch(URI.changePassowrd + id, model)
  }
  getPaymentPlans():Observable<any>{
    return this.http.get(URI.getPaymentPlans)
  }
  makePayment(model:any):Observable<any>{
    return this.http.post(URI.makePayment,model)
  }
  paymentSuccess(model:any):Observable<any>{
    return this.http.post(URI.paymentSuccess,model)
  }
}
