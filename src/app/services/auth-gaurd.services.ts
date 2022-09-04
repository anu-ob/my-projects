import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router'
import { Observable } from 'rxjs'
import { CorporateServiceService } from '../corporate/candidate-service/corporate-service.service'
import { UserService } from '../home/home-services/user.service'

@Injectable()
export class AuthGaurd implements CanActivate {
  constructor (private userService: UserService,private router: Router) {}

  canActivate (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = JSON.parse(this.userService.currentUserValue)
  
    if (currentUser) {
      return true
    } else {
      // not logged in so redirect to login page with the return url
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: state.url }
      })
      return false
    }
  }
}
