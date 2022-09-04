import { HttpClient, HttpClientModule } from '@angular/common/http'
import { Injectable } from '@angular/core'

import { BehaviorSubject, Observable } from 'rxjs'
import { map } from 'rxjs/operators'
import { URI } from 'src/app/common/url'

@Injectable({
  providedIn: 'root'
})
export class CorporateServiceService {
  public currentUserSubject: BehaviorSubject<any>
  public currentUser: Observable<any>
  token: any
  constructor (private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<any>(
      sessionStorage.getItem('corporateUser')
    )
    this.currentUser = this.currentUserSubject.asObservable()
  }
  public get currentUserValue (): any {
    return this.currentUserSubject.value
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

  signUp (model: any): Observable<any> {
    return this.http.post<any>(URI.corporateSignup, model)
  }
  emailVerify (model: any): Observable<any> {
    return this.http.post(URI.crEmailVerify, model)
  }
  login (model: any): Observable<any> {
    return this.http
      .post(URI.crLogin, model, {
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
              'corporateUser',
              JSON.stringify(obj.body.result[0])
            )
            this.currentUserSubject.next(JSON.stringify(obj.body.result[0]))
            return user
          } else {
            return user
          }
        })
      )
  }
  logout(){
    sessionStorage.removeItem('corporateUser');
    this.currentUserSubject.next(null)
  }
  getCompanyType (): Observable<any> {
    return this.http.get(URI.getCompanyType)
  }
  cr_profile (id: any, model: any): Observable<any> {
    return this.http.patch(URI.cr_profile + id, model)
  }
  addJob (model: any): Observable<any> {
    return this.http.post(URI.addJob, model)
  }
  getJobtype (): Observable<any> {
    return this.http.get(URI.getJobtype)
  }
  getJobPostedbyCr (model: any, id: any): Observable<any> {
    return this.http.post(URI.getjobpostedByuser + id, model)
  }
  changePassword (model: any, id: any): Observable<any> {
    return this.http.patch(URI.crChangePassword + id, model)
  }
  updateAddJob (id: any, model: any): Observable<any> {
    return this.http.patch(URI.updateAddJob + id, model)
  }
  crForgotPassword (model:any):Observable<any>{
    return this.http.post(URI.crForgotPassword,model)
  }
  getCrDetails(id:any):Observable<any>{
    return this.http.get(URI.corporateDetails+id)
  }
  resendOTP(model:any):Observable<any>{
    return this.http.post(URI.resendOTPCr, model)
  }
  setApplicationStatus(model:any):Observable<any>{
    return this.http.post(URI.changeUserAppStatus,model)
  }
  getApplicationStatus():Observable<any>{
    return this.http.get(URI.getApplicationStatus)
  }
  corporateList(model:any):Observable<any>{
    return this.http.post(URI.getCorporateList,model)
  }
 
}
