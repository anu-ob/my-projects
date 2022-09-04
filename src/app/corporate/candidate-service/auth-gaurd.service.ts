import { Injectable } from '@angular/core'
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot
} from '@angular/router'
import { CorporateServiceService } from './corporate-service.service'

@Injectable({
  providedIn: 'root'
})
export class AuthGaurdService implements CanActivate {
  constructor (
    private userService: CorporateServiceService,
    private router: Router
  ) {}
  canActivate (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const currentUser = JSON.parse(this.userService.currentUserValue)
    if (currentUser) {
      return true
    } else {
      // not logged in so redirect to login page with the return url
      this.router.navigate(['/corporate-login'], {
        queryParams: { returnUrl: state.url }
      })
      return false
    }
  }
}
