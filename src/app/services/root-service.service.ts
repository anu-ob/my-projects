import { Injectable } from '@angular/core'
import { BehaviorSubject, Observable, Subject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class RootServiceService {
  public isStudent: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    true
  )
  isCorporate: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true)
  // corporateV = this.isCorporate.asObservable();
  //isCorporate:BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
  constructor () {}

  /*getUserData(){
    this.crLoginUser = JSON.parse(sessionStorage.getItem('cr_login_user'))
    this.loginUser = JSON.parse(sessionStorage.getItem('login_user'))
    this.googleUser = JSON.parse(sessionStorage.getItem('userConsent'))
    this.fbUser = JSON.parse(sessionStorage.getItem('userData'))

    if(this.crLoginUser && Object.keys(this.crLoginUser).length>0){
      this.isLoggedIn = true;
      this.crLoginData = this.crLoginUser.body.result[0]
      this.profileStatus = this.crLoginUser.body.result[0].is_profile_complete
      return
    
      }
      else if(this.loginUser && Object.keys(this.loginUser).length>0){
        this.isLoggedIn = true;
        this.loginData = this.loginUser.body.result[0]
        this.profileStatus = this.loginUser.body.result[0].is_profile_complete
        return
      }
      else if(this.googleUser && Object.keys(this.googleUser).length > 0){
        this.isLoggedIn = true;
         this.googleUserData = this.googleUser.result[0]
         this.profileStatus = this.googleUser.result[0].is_profile_complete
         return
      }
      else if(this.fbUser && Object.keys(this.fbUser).length>0){
        this.isLoggedIn = true;
        this.fbUserData = this.fbUser.result[0]
        this.profileStatus =  this.fbUser.result[0].is_profile_complete
        return
      }
      return
  }  */

  loggedIn () {
    return !!sessionStorage.getItem('login_user')
  }
  corporateLogin () {
    return !!sessionStorage.getItem('cr_login_user')
  }
  googleLoggedIn () {
    return !!sessionStorage.getItem('userConsent')
  }
  facebookLoggedIn () {
    return !!sessionStorage.getItem('userData')
  }

  logout () {
    sessionStorage.removeItem('login_user')
    sessionStorage.removeItem('userConsent')
    sessionStorage.removeItem('userData')
    sessionStorage.removeItem('cr_login_user')
    return
  }
}
function editShowEventForm () {
  throw new Error('Function not implemented.')
}
