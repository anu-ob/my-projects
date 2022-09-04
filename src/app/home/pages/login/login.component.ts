import { HttpResponse } from '@angular/common/http'
import { Component, OnInit, ViewChild } from '@angular/core'
import { FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router'
//import { AuthService, LinkedinLoginProvider } from 'angular-6-social-login-v2';
import {
  FacebookLoginProvider,
  GoogleLoginProvider,
  SocialAuthService
} from 'angularx-social-login'
//import { FacebookLoginProvider, GoogleLoginProvider, SocialAuthService } from 'angularx-social-login';
import { RecaptchaErrorParameters } from 'ng-recaptcha'
import { NgxSpinnerService } from 'ngx-spinner'
import { ToastrService } from 'ngx-toastr'
import { CandidateService } from 'src/app/candidate/candidate-services/candidate.service'
import { UserDataSharingService } from '../../home-services/user-data-sharing.service'
import { UserService } from '../../home-services/user.service'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup
  forgetPasswordForm: FormGroup
  isSubmit: boolean
  isSubmitted: boolean = false
  loginResponse: any
  captchaResponse: any
  googleLoginResult: any
  isComplete: any
  isEmailSubmit: boolean = false
  @ViewChild('closebutton') closebutton: any
  constructor (
    private service: UserService,
    private candidateService: CandidateService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    //private socialService:AuthService,
    private authService: SocialAuthService,
    private userDataSharingService: UserDataSharingService,
    private router: Router
  ) {}

  ngOnInit (): void {
    this.loginForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('[a-zA-Z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')]),
      password: new FormControl('', Validators.required),
      reCaptcha: new FormControl('', Validators.required)
    })

    this.forgetPasswordForm = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern('[a-zA-Z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,3}$')
      ])
    })
  }
  get email () {
    return this.loginForm.get('email')
  }
  get password () {
    return this.loginForm.get('password')
  }

  onSubmit (model: { email: string; password: string }) {
    this.isSubmitted = true
    if (this.loginForm.invalid) {
      this.toastr.error('Please fill all the mandotry fields.')
    } else {
      
      if (this.captchaResponse) {
        this.spinner.show()
        sessionStorage.setItem('userEmail',model.email)
        this.service.loginUser(model).subscribe(
          (res: HttpResponse<any>) => {
            this.spinner.hide()

            this.isSubmitted = false
            this.loginResponse = res
            if (this.loginResponse != undefined) {
              sessionStorage.setItem('login_user', JSON.stringify(res))
              var result = JSON.parse(sessionStorage.getItem('login_user'))
            }
            if (res && res.body.status_code == 1) {
              if (result.body.result[0].is_profile_complete == true) {
                this.toastr.success(res.body.message)

                this.router.navigate(['/user'])
              } else {
                this.toastr.success(res.body.message)

                this.router.navigate(['/profile'])
              }
            
            }
          },
          err => {
          
            this.spinner.hide()
            if (err && err.error) {
              if (err.error.status_code == 3 || err.error.status_code == 2) {
                this.toastr.error(err.error.message)
                if (err.error.status_code == 3) {
                  this.router.navigate(['/email-verification'])
                  
                }
                this.spinner.hide()
              }
            }
          },
          () => {
            this.spinner.hide()
          }
        )
      }
    }
  }
  forgetPassword (model: { email: any }) {
    this.isEmailSubmit = true

    if (this.forgetPasswordForm.invalid) {
      this.toastr.error('Please enter the email.')
    } else {
      this.spinner.show()
      this.service.forgetPassword(model).subscribe(
        res => {
          this.spinner.hide()
          if (res && res.status_code == 1) {
            this.toastr.success(res.message)

            this.closebutton.nativeElement.click()
          }
        },
        err => {
          this.spinner.hide()
          if (err && err.error) {
            if (err.error.status_code == 2) {
              this.toastr.error(err.error.message)

              this.spinner.hide()
            }
          }
        }
      )
    }
  }
  resolved (captchaResponse: string) {
    this.captchaResponse = captchaResponse
  }
  public onError (errorDetails: RecaptchaErrorParameters): void {
    //   console.log(`reCAPTCHA error encountered; details:`, errorDetails);
  }
  signInWithFB (): void {
    this.authService.signIn(FacebookLoginProvider.PROVIDER_ID).then(res => {
      if (res && res.authToken) {
        this.spinner.show()

        var modal = { email: res.email }

        this.userDataSharingService.setUserInfo(res)
        this.service.socialLogin(modal).subscribe(
          res => {
            let response: any = res
            this.spinner.hide()

            if (res != undefined) {
              sessionStorage.setItem('userData', JSON.stringify(res.body))
              var result = JSON.parse(sessionStorage.getItem('userData'))
            }
            if (response && response.body.status_code == 1) {
              if (response.body.result[0].is_profile_complete == true) {
                let fbResult: any = response
                this.toastr.success('Successfully Logged in')
                this.router.navigate(['/user'])
              } else if (response.body.result[0].is_profile_complete == false) {
                this.googleLoginResult = response
                this.toastr.success('Successfully Logged In')
                this.router.navigate(['/user-profile'])
              }
            }
            /* else {
            this.toastr.error(response.message)
            setTimeout(() => {
              this.toastr.info('Please register to proceed')
              this.router.navigate(['/sign-up'])
            }, 2000)
          }*/
          },
          err => {
            if (err && err.error) {
              if (err.error.status_code == 3 || err.error.status_code == 2) {
                this.toastr.error(err.error.message)
                if (err.error.status_code == 3) {
                  this.router.navigate(['/email-verification'])
                }
                this.spinner.hide()
              }
            }
          }
        )
      }
    })
  }
  signInWithGoogle (): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID).then(res => {
      if (res && res.authToken) {
        this.spinner.show()

        var modal = { email: res.email }
        this.userDataSharingService.setUserInfo(res)
        this.service.socialLogin(modal).subscribe(
          res => {
            let response: any = res

            this.spinner.hide()
            if (res != undefined) {
              sessionStorage.setItem('userConsent', JSON.stringify(res.body))
              var result = JSON.parse(sessionStorage.getItem('userConsent'))
            }
            if (response && response.body.status_code == 1) {
              if (response.body.result[0].is_profile_complete == true) {
                //sessionStorage.removeItem("userConsent");
                this.googleLoginResult = response
                this.toastr.success('Successfully Logged In')
                this.router.navigate(['/user'])
              } else if (response.body.result[0].is_profile_complete == false) {
                this.googleLoginResult = response
                this.toastr.success('Successfully Logged In')
                this.router.navigate(['/user-profile'])
              }
              /* else {
                console.log(this.toastr.success(response.message))
                setTimeout(() => {
                  this.toastr.info('Please register to proceed')
                  this.router.navigate(['/sign-up'])
                }, 2000)
              }*/
            }
          },
          err => {

            this.spinner.hide()
            if (err && err.error) {
              if (err.error.status_code == 3 || err.error.status_code == 2) {
                this.toastr.error(err.error.message)
                if (err.error.status_code == 3) {
                  this.router.navigate(['/email-verification'])
                }
                this.spinner.hide()
              }
            }
          },
          () => {
            this.spinner.hide()
          }
        )
      }
    })
  }
  //  signInWithLinkedin(): void{
  //  console.log(this.authService.signIn(LinkedinLoginProvider.PROVIDER_ID));
  // }
}
