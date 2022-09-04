import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class UserDataSharingService {
  user: any = {}
  private userResult = new BehaviorSubject<any>(this.user)
  constructor () {}

  setUserInfo (user: any) {
    this.userResult.next(user)
  }

  getUserInfo () {
    return this.userResult.asObservable()
  }
}
