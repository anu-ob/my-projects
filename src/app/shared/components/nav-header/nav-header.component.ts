import { ThrowStmt } from '@angular/compiler'
import { Component, OnDestroy, OnInit } from '@angular/core'
import { Router, RouteReuseStrategy } from '@angular/router'
import { Subscription } from 'rxjs'
import { CandidateService } from 'src/app/candidate/candidate-services/candidate.service'
import { CorporateServiceService } from 'src/app/corporate/candidate-service/corporate-service.service'
import { UserService } from 'src/app/home/home-services/user.service'
import { RootServiceService } from 'src/app/services/root-service.service'

@Component({
  selector: 'app-nav-header',
  templateUrl: './nav-header.component.html',
  styleUrls: ['./nav-header.component.css']
})
export class NavHeaderComponent implements OnInit {
  userName: string
  user: string
  isLoggedIn: boolean = false
  loggedInUser: boolean = false
  crLoginUser: any
  crLoginData: boolean = false
  loginUser: any
  loginData: boolean = false
  profileStatus: boolean
  userProfile: boolean
  crProfile: boolean
  public userIsAuthenticated: boolean = false
  googleUser: any
  googleUserData: any
  fbUser: any
  fbUserData: any
  loggedIn: boolean = false
  userSubscription: any
  isCorporate: boolean = false
  isStudent: boolean
  susbscription: Subscription

  constructor (
    private router: Router,
    public service: RootServiceService,
    private userService: UserService,
    private candidateService: CandidateService,
    private crService: CorporateServiceService
  ) {}

  ngOnInit (): void {
    this.service.isStudent.subscribe(value => {
      if (value != null) {
    
        this.isStudent = value
      }
      
     
    })
   

    //this.service.getUserData();
    this.crService.currentUserSubject.subscribe(val => {
      if (val != null) {
        
        this.crLoginUser = JSON.parse(val)
        if (this.crLoginUser && Object.keys(this.crLoginUser).length > 0) {
          this.crProfile = this.crLoginUser.is_profile_complete
          this.crLoginData = true
        }
      }
    })
    this.userService.currentUserSubject.subscribe(val => {
      if (val != null) {
        this.loginUser = JSON.parse(val)
        if (this.loginUser && Object.keys(this.loginUser).length > 0) {
          this.userProfile = this.loginUser.is_profile_complete
          this.loginData = true
        }
      }
    })
  }
 
  onCorporate () {
    this.isStudent = false
    this.service.isStudent.next(false)
  }
  onStudent () {
    this.isStudent = true
    this.service.isStudent.next(true)
   // window.location.reload();
  
  
  }
 
  signOut () {
    if (this.crLoginUser) {
      this.crLoginData = false
      this.service.logout()
      this.crService.logout()
      sessionStorage.removeItem('login_user')
      sessionStorage.removeItem('currentUser')
      sessionStorage.removeItem('userName')
      sessionStorage.removeItem('userConsent')
      sessionStorage.removeItem('registeredCorporate')
      sessionStorage.removeItem('cr_login_user')
      sessionStorage.removeItem('userEmail')
      sessionStorage.removeItem('corporateUser')
      sessionStorage.removeItem('registeredUser')
      sessionStorage.removeItem('userEmail')
      sessionStorage.removeItem('paymentModel')
      this.userName = ''
      this.isLoggedIn = false
      this.router.navigate(['/corporate-login'])
      // window.location.reload()
    } else if (this.loginUser) {
      this.loginData = false
      this.service.logout()
      this.userService.logout()
      sessionStorage.removeItem('login_user')
      sessionStorage.removeItem('currentUser')
      sessionStorage.removeItem('userName')
      sessionStorage.removeItem('userConsent')
      sessionStorage.removeItem('registeredCorporate')
      sessionStorage.removeItem('cr_login_user')
      sessionStorage.removeItem('userEmail')
      sessionStorage.removeItem('corporateUser')
      sessionStorage.removeItem('registeredUser')
      sessionStorage.removeItem('userEmail')
      sessionStorage.removeItem('paymentModel')
      this.userName = ''
      this.isLoggedIn = false
      //window.location.reload()
      this.router.navigate(['/login'])
    }
  }
}
